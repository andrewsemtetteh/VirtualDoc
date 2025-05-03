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

    const { id } = params;
    const { meetingLink } = await request.json();

    const { db } = await connectToDatabase();
    const appointment = await db.collection('appointments').findOne({ _id: new ObjectId(id) });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Verify that the user is the doctor for this appointment
    if (appointment.doctorId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the appointment with the meeting link
    await db.collection('appointments').updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          meetingLink: meetingLink || null,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving meeting link:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 