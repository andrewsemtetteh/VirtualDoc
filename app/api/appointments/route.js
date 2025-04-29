import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Appointment from '@/models/Appointment';
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

    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const patientId = session.user.id;
    
    let query = { patientId };
    
    if (status) {
      query.status = status;
    }
    
    const appointments = await Appointment.find(query)
      .populate('doctorId', 'name specialty profilePicture')
      .sort({ date: 1 });
    
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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();
    
    const body = await request.json();
    const { doctorId, date, time } = body;
    
    // Generate video link (you might want to use a service like Daily.co or similar)
    const videoLink = `https://your-video-service.com/${Date.now()}`;
    
    const appointment = new Appointment({
      patientId: session.user.id,
      doctorId,
      date,
      time,
      videoLink,
      status: 'scheduled'
    });
    
    await appointment.save();
    
    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
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