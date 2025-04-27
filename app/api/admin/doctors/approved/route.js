import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();

    // Get only active doctors
    const doctors = await db.collection('users')
      .find({ 
        role: 'doctor',
        status: 'active'
      })
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    // Get count of active doctors
    const approvedCount = await db.collection('users')
      .countDocuments({ role: 'doctor', status: 'active' });

    return NextResponse.json({
      doctors,
      count: approvedCount
    });
  } catch (error) {
    console.error('Get approved doctors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 