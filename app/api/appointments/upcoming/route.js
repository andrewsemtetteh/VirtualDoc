import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const doctorId = session.user.id;

    // Get all appointments for this doctor
    const appointments = await db.collection('appointments')
      .find({
        doctorId: new ObjectId(doctorId),
        status: { $in: ['pending', 'accepted'] }
      })
      .sort({ scheduledFor: 1 })
      .toArray();

    // Populate patient information for each appointment
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = await db.collection('users').findOne(
          { _id: new ObjectId(appointment.patientId) },
          { projection: { fullName: 1, email: 1 } }
        );

        // Ensure scheduledFor is a valid Date object
        const scheduledFor = appointment.scheduledFor instanceof Date 
          ? appointment.scheduledFor 
          : new Date(appointment.scheduledFor);

        return {
          ...appointment,
          patientName: patient?.fullName || 'Unknown Patient',
          patientEmail: patient?.email,
          scheduledFor: scheduledFor
        };
      })
    );

    return NextResponse.json(populatedAppointments);
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 