import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { db } = await connectToDatabase();

    // Update appointment status to accepted
    const appointment = await db.collection('appointments').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status: 'accepted' } },
      { returnDocument: 'after' }
    );

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Get doctor details
    const doctor = await db.collection('users').findOne({ _id: appointment.doctorId });

    // Create notification for patient
    await db.collection('notifications').insertOne({
      userId: appointment.patientId,
      type: 'APPOINTMENT_CONFIRMED',
      title: 'Appointment Confirmed',
      message: `Your appointment with Dr. ${doctor.fullName} has been confirmed for ${new Date(appointment.scheduledFor).toLocaleString()}`,
      read: false,
      createdAt: new Date(),
    });

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error confirming appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 