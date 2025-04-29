import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectToDatabase();

    // Total Patients
    const totalPatients = await User.countDocuments({ role: 'patient' });

    // New Patients This Month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    const newPatientsThisMonth = await User.countDocuments({
      role: 'patient',
      createdAt: { $gte: startOfMonth }
    });

    // Active Patients
    const activePatients = await User.countDocuments({
      role: 'patient',
      status: 'active'
    });

    // Pending Patients
    const pendingPatients = await User.countDocuments({
      role: 'patient',
      status: 'pending'
    });

    // Suspended Patients
    const suspendedPatients = await User.countDocuments({
      role: 'patient',
      status: 'suspended'
    });

    return NextResponse.json({
      totalPatients,
      newPatientsThisMonth,
      activePatients,
      pendingPatients,
      suspendedPatients
    });
  } catch (error) {
    console.error('Error fetching patient stats:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 