import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Total Patients
    const totalPatients = await db.collection('users').countDocuments({ role: 'patient' });

    // New Patients This Month
    const newPatientsThisMonth = await db.collection('users').countDocuments({
      role: 'patient',
      createdAt: { $gte: startOfMonth }
    });

    // Active Patients
    const activePatients = await db.collection('users').countDocuments({
      role: 'patient',
      status: 'active'
    });

    // Upcoming Appointments
    const upcomingAppointments = await db.collection('appointments')
      .aggregate([
        {
          $match: {
            appointmentDate: { $gt: now }
          }
        },
        {
          $group: {
            _id: '$patientId',
            count: { $sum: 1 }
          }
        },
        {
          $count: 'total'
        }
      ])
      .toArray();

    return NextResponse.json({
      totalPatients,
      newPatientsThisMonth,
      activePatients,
      upcomingAppointments: upcomingAppointments[0]?.total || 0
    });
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 