import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getIO } from '@/lib/socket';
import { ObjectId } from 'mongodb';
import { emitDoctorUpdate } from '@/lib/socket';

// Get appointments for a user
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const patientId = session.user.id;
    
    let query = { patientId };
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await db.collection('appointments').find(query).toArray();
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

// Create a new appointment
export async function POST(request) {
  try {
    // Validate session
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { doctorId, date, time, reason, notes } = body;

    // Validate required fields
    if (!doctorId || !date || !time || !reason) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Validate doctor exists
    const doctor = await db.collection('users').findOne({ 
      _id: new ObjectId(doctorId),
      role: 'doctor'
    });

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Create appointment object
    const appointment = {
      patientId: new ObjectId(session.user.id),
      doctorId: new ObjectId(doctorId),
      date,
      time,
      reason,
      notes: notes || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert appointment
    const result = await db.collection('appointments').insertOne(appointment);

    // Get the saved appointment
    const savedAppointment = await db.collection('appointments').findOne(
      { _id: result.insertedId },
      {
        projection: {
          _id: 1,
          patientId: 1,
          doctorId: 1,
          date: 1,
          time: 1,
          reason: 1,
          notes: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    );

    // Notify doctor about new appointment
    const io = getIO();
    if (io) {
      io.to(`doctor_${doctorId}`).emit('new_appointment', {
        appointment: savedAppointment,
        message: 'New appointment request received'
      });
    }

    return NextResponse.json({ 
      success: true,
      appointment: savedAppointment 
    });

  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment', details: error.message },
      { status: 500 }
    );
  }
}

// Update appointment (reschedule, accept, reject)
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    const { appointmentId, action, newDate, newTime, reason } = await request.json();
    
    const appointment = await db.collection('appointments').findOne(
      { _id: new ObjectId(appointmentId) },
      {
        projection: {
          _id: 1,
          patientId: 1,
          doctorId: 1,
          date: 1,
          time: 1,
          reason: 1,
          status: 1,
          rescheduleHistory: 1
        }
      }
    );
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check if user has permission to modify this appointment
    if (session.user.role === 'doctor' && appointment.doctorId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    if (session.user.role === 'patient' && appointment.patientId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let update = {};
    let notificationMessage = '';

    switch (action) {
      case 'accept':
        update.status = 'accepted';
        notificationMessage = 'Your appointment has been accepted';
        break;
      case 'reject':
        update.status = 'rejected';
        notificationMessage = 'Your appointment has been rejected';
        break;
      case 'reschedule':
        if (!newDate || !newTime || !reason) {
          return NextResponse.json({ error: 'Missing required fields for rescheduling' }, { status: 400 });
        }
        
        // Add to reschedule history
        const rescheduleEntry = {
          oldDate: appointment.date,
          oldTime: appointment.time,
          newDate,
          newTime,
          reason,
          changedBy: session.user.role
        };
        
        update = {
          date: newDate,
          time: newTime,
          rescheduleReason: reason,
          status: 'rescheduled',
          $push: { rescheduleHistory: rescheduleEntry }
        };
        
        notificationMessage = `Appointment has been rescheduled to ${newDate} at ${newTime}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const updatedAppointment = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(appointmentId) },
      { $set: update },
      {
        projection: {
          _id: 1,
          patientId: 1,
          doctorId: 1,
          date: 1,
          time: 1,
          reason: 1,
          status: 1,
          rescheduleHistory: 1
        },
        returnDocument: 'after'
      }
    );

    // Notify the other party
    const io = getIO();
    if (io) {
      const targetUserId = session.user.role === 'doctor' 
        ? appointment.patientId 
        : appointment.doctorId;
      
      io.to(`user_${targetUserId}`).emit('appointment_update', {
        appointment: updatedAppointment.value,
        message: notificationMessage
      });
    }

    return NextResponse.json({ 
      success: true, 
      appointment: updatedAppointment.value 
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    );
  }
} 