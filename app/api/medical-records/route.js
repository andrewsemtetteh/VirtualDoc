import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const doctorId = session.user.id;

    // Get all medical records for the doctor
    const records = await db.collection('medicalrecords')
      .find({ doctorId: new ObjectId(doctorId) })
      .sort({ consultationDate: -1 })
      .toArray();

    return NextResponse.json(records);
  } catch (error) {
    console.error('Get medical records error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'doctor') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const doctorId = session.user.id;
    const data = await request.json();

    // Create new medical record
    const result = await db.collection('medicalrecords').insertOne({
      ...data,
      doctorId: new ObjectId(doctorId),
      patientId: new ObjectId(data.patientId),
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true,
      recordId: result.insertedId 
    });
  } catch (error) {
    console.error('Create medical record error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 