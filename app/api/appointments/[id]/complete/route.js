import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const appointmentId = params.id;

    // Update the appointment status to completed
    const result = await db.collection('appointments').updateOne(
      { 
        _id: new ObjectId(appointmentId),
        doctorId: new ObjectId(session.user.id)
      },
      { 
        $set: { 
          status: 'completed',
          completedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Appointment marked as completed' });
  } catch (error) {
    console.error('Error completing appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 