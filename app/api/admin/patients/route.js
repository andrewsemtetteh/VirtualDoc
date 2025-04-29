import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const status = searchParams.get('status') || 'all';
    const search = searchParams.get('search') || '';

    await connectToDatabase();
    const skip = (page - 1) * limit;

    // Build query
    const query = { role: 'patient' };
    
    if (status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } }
      ];
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get patients
    const patients = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password'); // Exclude password field

    return NextResponse.json({
      patients,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 