import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Appointment from '@/models/Appointment';
import Prescription from '@/models/Prescription';

export async function GET() {
  try {
    await connectToDatabase();

    const [totalAppointments, totalPrescriptions, completedAppointments, approvedAppointments] = await Promise.all([
      Appointment.countDocuments({ status: 'approved' }),
      Prescription.countDocuments(),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ 
        status: 'approved',
        approvedBy: { $exists: true, $ne: null }
      })
    ]);

    return NextResponse.json({
      totalAppointments,
      totalPrescriptions,
      completedAppointments,
      approvedAppointments
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment statistics' },
      { status: 500 }
    );
  }
} 