import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Attempting to connect to database...');
    const { db } = await connectToDatabase();
    console.log('Database connection successful');
    
    // First, let's check all doctors to see their statuses
    const allDoctors = await db.collection('users')
      .find({ role: 'doctor' })
      .project({
        _id: 1,
        fullName: 1,
        status: 1
      })
      .toArray();

    console.log('All doctors and their statuses:', allDoctors);
    
    // Now fetch only active doctors
    const activeDoctors = await db.collection('users')
      .find({ 
        role: 'doctor',
        status: 'active'
      })
      .project({
        _id: 1,
        fullName: 1,
        specialization: 1,
        profilePicture: 1,
        rating: 1,
        reviewCount: 1,
        yearsOfExperience: 1,
        status: 1,
        phoneNumber: 1
      })
      .toArray();

    console.log('Active doctors found:', activeDoctors);

    return NextResponse.json({ doctors: activeDoctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctors' },
      { status: 500 }
    );
  }
} 