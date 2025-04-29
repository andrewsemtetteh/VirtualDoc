import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const doctors = await db.collection('users')
      .find({ role: 'doctor' })
      .project({
        _id: 1,
        fullName: 1,
        specialization: 1,
        profilePicture: 1,
        rating: 1,
        reviewCount: 1,
        yearsOfExperience: 1,
        status: 1
      })
      .toArray();

    return NextResponse.json(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
} 