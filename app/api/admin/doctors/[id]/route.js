import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { sendDoctorApprovalEmail } from '@/lib/email';

// Helper function to send email notification
async function sendDoctorNotification(email, fullName, status, message) {
  // TODO: Implement email notification
  console.log(`Sending ${status} notification to ${email}`);
}

export async function PATCH(request, { params }) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status, message } = await request.json();

    // Validate status
    const validStatuses = ['active', 'rejected', 'pending'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    // Find doctor by ID
    const doctor = await db.collection('users').findOne({
      _id: new ObjectId(id),
      role: 'doctor'
    });

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Update doctor status
    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          statusMessage: message,
          updatedAt: new Date(),
          ...(status === 'active' ? { approvedAt: new Date() } : {})
        }
      }
    );

    // Send email notification to doctor
    await sendDoctorApprovalEmail(doctor.email, doctor.fullName, status, message);

    // Add notification for admin tracking
    await db.collection('notifications').insertOne({
      userId: doctor._id,
      type: 'doctor_verification',
      title: `Doctor ${status}`,
      message: `Doctor ${doctor.fullName} has been ${status}`,
      status,
      createdAt: new Date(),
      read: false
    });

    return NextResponse.json(
      { message: `Doctor successfully ${status}` },
      { status: 200 }
    );
  } catch (error) {
    console.error('Doctor status update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get doctor details
export async function GET(request, { params }) {
  try {
    // Check if user is authenticated and is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { db } = await connectToDatabase();

    const doctor = await db.collection('users').findOne(
      { _id: new ObjectId(id), role: 'doctor' },
      {
        projection: {
          password: 0 // Exclude password from response
        }
      }
    );

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Get doctor error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 