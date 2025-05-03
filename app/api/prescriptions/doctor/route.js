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

    // Get all prescriptions for this doctor
    const prescriptions = await db.collection('prescriptions')
      .find({
        doctorId: new ObjectId(doctorId)
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate patient information for each prescription
    const populatedPrescriptions = await Promise.all(
      prescriptions.map(async (prescription) => {
        const patient = await db.collection('users').findOne(
          { _id: new ObjectId(prescription.patientId) },
          { projection: { fullName: 1 } }
        );

        return {
          ...prescription,
          patientName: patient?.fullName || 'Unknown Patient'
        };
      })
    );

    return NextResponse.json(populatedPrescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 