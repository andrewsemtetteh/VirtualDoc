import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: 'Doctor ID is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    
    const doctor = await db.collection('users').findOne(
      { 
        _id: new ObjectId(id),
        role: 'doctor'
      },
      {
        projection: {
          _id: 1,
          fullName: 1,
          specialization: 1,
          profilePicture: 1,
          rating: 1,
          reviewCount: 1,
          yearsOfExperience: 1,
          status: 1
        }
      }
    );

    if (!doctor) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor information' },
      { status: 500 }
    );
  }
} 