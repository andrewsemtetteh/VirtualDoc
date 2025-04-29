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
    const status = searchParams.get('status') || 'pending';

    const { db } = await connectToDatabase();

    // Build query based on status filter
    let query = { 
      role: 'doctor',
      status: status === 'all' ? { $in: ['pending', 'rejected'] } : status
    };

    // Get doctors based on filter
    const doctors = await db.collection('users')
      .find(query)
      .project({ password: 0 }) // Exclude password
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    // Get counts for pending and rejected
    const [pendingCount, rejectedCount] = await Promise.all([
      db.collection('users').countDocuments({ 
        role: 'doctor', 
        status: 'pending'
      }),
      db.collection('users').countDocuments({ 
        role: 'doctor', 
        status: 'rejected'
      })
    ]);

    // Calculate total count for 'all' status
    const totalCount = pendingCount + rejectedCount;

    // Get the count of doctors in the current filter
    const currentFilterCount = doctors.length;

    return NextResponse.json({
      doctors,
      counts: {
        pending: pendingCount,
        rejected: rejectedCount,
        total: totalCount,
        currentFilter: currentFilterCount
      }
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 