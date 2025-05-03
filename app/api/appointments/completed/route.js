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

    // Get all completed appointments for this doctor
    const appointments = await db.collection('appointments')
      .find({
        doctorId: new ObjectId(doctorId),
        status: 'completed'
      })
      .sort({ completedAt: -1 })
      .toArray();

    // Populate patient and prescription information for each appointment
    const populatedAppointments = await Promise.all(
      appointments.map(async (appointment) => {
        const patient = await db.collection('users').findOne(
          { _id: new ObjectId(appointment.patientId) },
          { projection: { fullName: 1, email: 1 } }
        );

        // Get prescription data if it exists
        let prescription = null;
        if (appointment.prescriptionId) {
          prescription = await db.collection('prescriptions').findOne(
            { _id: new ObjectId(appointment.prescriptionId) }
          );
        }

        return {
          ...appointment,
          patientName: patient?.fullName || 'Unknown Patient',
          patientEmail: patient?.email,
          prescription: prescription
        };
      })
    );

    return NextResponse.json(populatedAppointments);
  } catch (error) {
    console.error('Error fetching completed appointments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 