import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      console.error('No session found');
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }
    
    if (session.user.role !== 'patient') {
      console.error('User is not a patient:', session.user);
      return NextResponse.json({ error: 'Unauthorized - Not a patient' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const patientId = session.user.id;

    if (!patientId) {
      console.error('No patient ID in session:', session.user);
      return NextResponse.json({ error: 'No patient ID found' }, { status: 400 });
    }

    // Get patient profile
    const patient = await db.collection('users').findOne(
      { _id: new ObjectId(patientId) },
      { projection: { password: 0 } }
    );

    if (!patient) {
      console.error('Patient not found in database:', patientId);
      // Create a new patient record if not found
      const newPatient = {
        _id: new ObjectId(patientId),
        fullName: session.user.name || 'Patient',
        email: session.user.email,
        role: 'patient',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await db.collection('users').insertOne(newPatient);
      
      // Get the count after insertion
      const patientCount = await db.collection('users').countDocuments({
        role: 'patient',
        createdAt: { $lt: newPatient.createdAt }
      });

      return NextResponse.json({
        ...newPatient,
        patientId: `#${String(patientCount + 1).padStart(4, '0')}`,
        memberSince: new Date().getFullYear()
      });
    }

    // Get patient order number
    const patientCount = await db.collection('users').countDocuments({
      role: 'patient',
      createdAt: { $lt: patient.createdAt }
    });

    // Format patient ID with leading zeros
    const patientIdFormatted = `#${String(patientCount + 1).padStart(4, '0')}`;

    // Get member since year
    const memberSince = new Date(patient.createdAt).getFullYear();

    return NextResponse.json({
      ...patient,
      patientId: patientIdFormatted,
      memberSince
    });
  } catch (error) {
    console.error('Get patient profile error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    );
  }
} 