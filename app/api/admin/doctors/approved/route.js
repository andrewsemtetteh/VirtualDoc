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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    const { db } = await connectToDatabase();

    // Build query for approved doctors
    const query = {
      role: 'doctor',
      status: 'active'
    };

    // Add search if provided
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count for pagination
    const total = await db.collection('users').countDocuments(query);

    // Get doctors with pagination
    const doctors = await db.collection('users')
      .find(query)
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 }) // Most recent first
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      doctors,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get approved doctors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 