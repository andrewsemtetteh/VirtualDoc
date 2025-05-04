import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'patient') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const patientId = session.user.id;

    // Get upcoming appointments
    const appointments = await db.collection('appointments')
      .find({
        patientId: new ObjectId(patientId),
        status: { $in: ['scheduled', 'confirmed'] },
        scheduledFor: { $gte: new Date() }
      })
      .sort({ scheduledFor: 1 })
      .toArray();

    // Get active prescriptions
    const prescriptions = await db.collection('prescriptions')
      .find({
        patientId: new ObjectId(patientId),
        status: 'active'
      })
      .sort({ createdAt: -1 })
      .toArray();

    // Populate doctor information for each prescription
    const populatedPrescriptions = await Promise.all(
      prescriptions.map(async (prescription) => {
        const doctor = await db.collection('doctors').findOne(
          { _id: new ObjectId(prescription.doctorId) },
          { projection: { fullName: 1, specialization: 1 } }
        );

        return {
          ...prescription,
          doctor: {
            fullName: doctor?.fullName || 'Unknown Doctor',
            specialization: doctor?.specialization || 'General Practitioner'
          }
        };
      })
    );

    // Get unread messages count
    const unreadMessages = await db.collection('messages')
      .countDocuments({
        recipientId: new ObjectId(patientId),
        read: false
      });

    // Get last checkup date
    const lastCheckup = await db.collection('appointments')
      .findOne({
        patientId: new ObjectId(patientId),
        status: 'completed'
      }, {
        sort: { scheduledFor: -1 }
      });

    // Get next checkup
    const nextCheckup = await db.collection('appointments')
      .findOne({
        patientId: new ObjectId(patientId),
        status: { $in: ['scheduled', 'confirmed'] },
        scheduledFor: { $gte: new Date() }
      }, {
        sort: { scheduledFor: 1 }
      });

    return NextResponse.json({
      appointments,
      prescriptions: populatedPrescriptions,
      unreadMessages,
      lastCheckup: lastCheckup ? lastCheckup.scheduledFor : null,
      nextCheckup: nextCheckup ? {
        date: nextCheckup.scheduledFor,
        doctor: nextCheckup.doctorName,
        type: nextCheckup.type
      } : null
    });
  } catch (error) {
    console.error('Get patient dashboard data error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 