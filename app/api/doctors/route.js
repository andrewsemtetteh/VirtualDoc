import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

// List of medical specializations (matching RegisterForm)
const specializations = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology'
];

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    
    // Get all doctors (both active and pending)
    const doctors = await db.collection('users')
      .find({ 
        role: 'doctor',
      })
      .project({ 
        password: 0, // Exclude password
        email: 1,
        fullName: 1,
        specialization: 1,
        profilePicture: 1,
        yearsOfExperience: 1,
        rating: 1,
        ratingCount: 1,
        status: 1
      })
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    // Get counts for different statuses
    const counts = {
      total: doctors.length,
      active: doctors.filter(d => d.status === 'active').length,
      pending: doctors.filter(d => d.status === 'pending').length,
      rejected: doctors.filter(d => d.status === 'rejected').length
    };

    return NextResponse.json({
      doctors,
      counts
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 