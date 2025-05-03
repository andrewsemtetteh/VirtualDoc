import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const prescriptions = await db.collection('prescriptions')
      .find({ patientId: session.user.id })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate doctor information for each prescription
    const populatedPrescriptions = await Promise.all(
      prescriptions.map(async (prescription) => {
        const doctor = await db.collection('doctors').findOne(
          { _id: new ObjectId(prescription.doctorId) },
          { projection: { fullName: 1, specialization: 1 } }
        );

        return {
          ...prescription,
          doctor: {
            fullName: doctor?.fullName || 'Unknown Doctor',
            specialization: doctor?.specialization || 'General Practitioner'
          }
        };
      })
    );

    return NextResponse.json(populatedPrescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
} 