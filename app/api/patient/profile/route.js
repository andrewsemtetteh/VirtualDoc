import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 });
    }
    
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized - Invalid session' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Extract user ID from session - handle different possible formats
    const userId = session.user.id || 
                  session.user.userId || 
                  session.user.sub || 
                  (session.user.email ? session.user.email : null);

    if (!userId) {
      console.error('Session user data:', session.user);
      return NextResponse.json({ 
        error: 'No user ID found in session',
        sessionData: session.user 
      }, { status: 400 });
    }

    // Try to find patient by ID first, then by email if ID lookup fails
    let patient = null;
    if (userId.match(/^[0-9a-fA-F]{24}$/)) {
      // If userId looks like a MongoDB ObjectId
      patient = await db.collection('users').findOne(
        { _id: new ObjectId(userId) },
        { projection: { password: 0 } }
      );
    }

    // If not found by ID and we have an email, try finding by email
    if (!patient && session.user.email) {
      patient = await db.collection('users').findOne(
        { email: session.user.email },
        { projection: { password: 0 } }
      );
    }

    if (!patient) {
      // Get the next patient number by counting all patients
      const totalPatients = await db.collection('users').countDocuments({
        role: 'patient'
      });

      // Create new patient with sequential ID
      const patientNumber = totalPatients + 1;
      const patientId = `PT-${String(patientNumber).padStart(4, '0')}`;
      
      const newPatient = {
        fullName: session.user.name || 'Patient',
        email: session.user.email,
        role: 'patient',
        patientId: patientId,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // If we have a valid ObjectId, use it
      if (userId.match(/^[0-9a-fA-F]{24}$/)) {
        newPatient._id = new ObjectId(userId);
      }
      
      await db.collection('users').insertOne(newPatient);
      patient = newPatient;
    }

    // If patient exists but doesn't have a patientId, generate one
    if (!patient.patientId) {
      const totalPatients = await db.collection('users').countDocuments({
        role: 'patient',
        createdAt: { $lt: patient.createdAt }
      });
      
      const patientNumber = totalPatients + 1;
      const patientId = `PT-${String(patientNumber).padStart(4, '0')}`;
      
      await db.collection('users').updateOne(
        { _id: patient._id },
        { $set: { patientId: patientId } }
      );
      
      patient.patientId = patientId;
    }

    // Get member since year
    const memberSince = patient.createdAt ? new Date(patient.createdAt).getFullYear() : new Date().getFullYear();

    return NextResponse.json({
      ...patient,
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