import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { reason } = await request.json();

    if (!reason) {
      return NextResponse.json({ error: 'Suspension reason is required' }, { status: 400 });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'suspended',
          suspensionReason: reason,
          suspendedAt: new Date(),
          suspendedBy: session.user.id
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Patient suspended successfully' });
  } catch (error) {
    console.error('Error suspending patient:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 