import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { doctorId, patientId, date, time, reason, notes } = body;

    // Validate required fields
    if (!doctorId || !patientId || !date || !time || !reason) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that the patientId matches the session user
    const userId = session.user._id || session.user.id;
    if (patientId !== userId) {
      return NextResponse.json(
        { message: 'Unauthorized to book appointment for another user' },
        { status: 403 }
      );
    }

    const { db } = await connectToDatabase();

    // Validate date and time
    const scheduledFor = new Date(`${date}T${time}`);
    if (isNaN(scheduledFor.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date or time format' },
        { status: 400 }
      );
    }

    if (scheduledFor < new Date()) {
      return NextResponse.json(
        { message: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    // Check for existing appointments at the same time
    const existingAppointment = await db.collection('appointments').findOne({
      doctorId: new ObjectId(doctorId),
      scheduledFor: scheduledFor,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return NextResponse.json(
        { message: 'This time slot is already booked' },
        { status: 400 }
      );
    }

    // Create new appointment
    const appointment = await db.collection('appointments').insertOne({
      patientId: new ObjectId(patientId),
      doctorId: new ObjectId(doctorId),
      scheduledFor: scheduledFor,
      reason: reason,
      notes: notes || null,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ appointment }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/appointments:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error('No session found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Session user:', session.user); // Debug log

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role') || 'patient';

    const { db } = await connectToDatabase();

    let query = {};
    
    // Filter by role (patient or doctor)
    if (role === 'patient') {
      const userId = session.user._id || session.user.id;
      if (!userId) {
        console.error('No user ID found in session:', session.user);
        return NextResponse.json(
          { message: 'User ID not found in session' },
          { status: 400 }
        );
      }
      console.log('Patient ID:', userId); // Debug log
      query.patientId = new ObjectId(userId);
    } else if (role === 'doctor') {
      const userId = session.user._id || session.user.id;
      if (!userId) {
        console.error('No user ID found in session:', session.user);
        return NextResponse.json(
          { message: 'User ID not found in session' },
          { status: 400 }
        );
      }
      console.log('Doctor ID:', userId); // Debug log
      query.doctorId = new ObjectId(userId);
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    console.log('Query:', query); // Debug log

    try {
      // First, find the appointments
      const appointments = await db.collection('appointments').find(query).toArray();

      console.log('Found appointments:', appointments); // Debug log

      // Then, populate the references
      const populatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          try {
            // Populate patient
            const patient = await db.collection('users').findOne({ _id: appointment.patientId }, { projection: { name: 1, email: 1 } });

            // Populate doctor from users collection
            const doctor = await db.collection('users').findOne({ 
              _id: appointment.doctorId,
              role: 'doctor'
            }, { projection: { fullName: 1, email: 1, specialization: 1 } });

            return {
              ...appointment,
              patientId: patient,
              doctorId: doctor
            };
          } catch (error) {
            console.error('Error populating references:', error);
            return appointment;
          }
        })
      );

      console.log('Populated appointments:', populatedAppointments); // Debug log

      return NextResponse.json(populatedAppointments);
    } catch (findError) {
      console.error('Error finding appointments:', findError);
      return NextResponse.json(
        { message: 'Error fetching appointments', error: findError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/appointments:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error', error: error.stack },
      { status: 500 }
    );
  }
} 