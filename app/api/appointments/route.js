import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');

    const { db } = await connectToDatabase();

    const query = {
      $or: [
        { patientId: session.user.id },
        { doctorId: session.user.id }
      ]
    };

    if (status) query.status = status;
    if (type) query.type = type;

    const appointments = await db.collection('appointments')
      .find(query)
      .sort({ scheduledFor: -1 })
      .toArray();

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create a new appointment
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { doctorId, date, time, type } = await request.json();
    const { db } = await connectToDatabase();

    // Check if the slot is still available
    const doctor = await db.collection('doctors').findOne({
      _id: new ObjectId(doctorId),
      'availability.date': date,
      'availability.slots': time
    });

    if (!doctor) {
      return NextResponse.json({ error: 'Slot no longer available' }, { status: 400 });
    }

    // Create the appointment
    const appointment = {
      patientId: session.user.id,
      doctorId: new ObjectId(doctorId),
      date,
      time,
      type,
      status: 'scheduled',
      createdAt: new Date()
    };

    const result = await db.collection('appointments').insertOne(appointment);

    // Update doctor's availability
    await db.collection('doctors').updateOne(
      {
        _id: new ObjectId(doctorId),
        'availability.date': date
      },
      {
        $pull: { 'availability.$.slots': time }
      }
    );

    // Get updated doctor data
    const updatedDoctor = await db.collection('doctors').findOne({
      _id: new ObjectId(doctorId)
    });

    // Emit real-time update
    emitDoctorUpdate(updatedDoctor);

    return NextResponse.json({
      message: 'Appointment booked successfully',
      appointmentId: result.insertedId
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    return NextResponse.json({ error: 'Failed to book appointment' }, { status: 500 });
  }
}

// Update an appointment
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, rescheduledFor } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const update = {
      status,
      updatedAt: new Date(),
      ...(rescheduledFor && { scheduledFor: new Date(rescheduledFor) })
    };

    const result = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: update },
      { returnDocument: 'after' }
    );

    if (!result.value) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    // Send real-time notification to relevant user
    const io = getIO();
    const notifyUserId = session.user.id === result.value.patientId
      ? result.value.doctorId
      : result.value.patientId;

    io.to(notifyUserId).emit('appointment_update', {
      id,
      status,
      rescheduledFor
    });

    return NextResponse.json(result.value);
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 