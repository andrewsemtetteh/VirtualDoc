import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
    const validStatuses = ['active', 'rejected', 'pending', 'suspended'];
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

    if (status === 'rejected') {
      // Remove doctor from database if rejected
      await db.collection('users').deleteOne({ _id: new ObjectId(id) });
      
      // Add notification for admin tracking
      await db.collection('notifications').insertOne({
        userId: doctor._id,
        type: 'doctor_verification',
        title: 'Doctor Rejected',
        message: `Doctor ${doctor.fullName} has been rejected and removed from the system`,
        status: 'rejected',
        createdAt: new Date(),
        read: false
      });

      return NextResponse.json(
        { message: 'Doctor successfully rejected and removed from the system' },
        { status: 200 }
      );
    }

    // Update doctor status and sign-in permissions
    const updateData = {
      status,
      statusMessage: message,
      updatedAt: new Date()
    };

    // Handle sign-in permissions based on status
    if (status === 'active') {
      updateData.isActive = true;
      updateData.canLogin = true;
      updateData.approvedAt = new Date();
    } else if (status === 'suspended') {
      updateData.isActive = false;
      updateData.canLogin = false;
    }

    await db.collection('users').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

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
    console.error('Error updating doctor status:', error);
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