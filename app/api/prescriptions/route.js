import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { appointmentId, ...prescriptionData } = await req.json();
    const { db } = await connectToDatabase();

    // Get appointment details
    const appointment = await db.collection('appointments').findOne({
      _id: new ObjectId(appointmentId)
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Create prescription
    const prescription = {
      ...prescriptionData,
      appointmentId: new ObjectId(appointmentId),
      patientId: appointment.patientId,
      doctorId: appointment.doctorId,
      createdAt: new Date(),
      status: 'active'
    };

    const result = await db.collection('prescriptions').insertOne(prescription);

    // Update appointment with prescription reference
    await db.collection('appointments').updateOne(
      { _id: new ObjectId(appointmentId) },
      { $set: { prescriptionId: result.insertedId } }
    );

    return NextResponse.json({ success: true, prescription: { ...prescription, _id: result.insertedId } });
  } catch (error) {
    console.error('Error creating prescription:', error);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
} 