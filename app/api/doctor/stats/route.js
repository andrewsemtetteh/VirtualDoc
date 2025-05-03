import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const doctorId = new ObjectId(session.user.id);

    // Get current date range for monthly stats
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Fetch monthly appointments
    const monthlyAppointments = await db.collection('appointments').countDocuments({
      doctorId,
      scheduledFor: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    // Fetch total unique patients
    const totalPatients = await db.collection('appointments').distinct('patientId', {
      doctorId
    });

    // Fetch pending prescriptions
    const pendingPrescriptions = await db.collection('prescriptions').countDocuments({
      doctorId,
      status: 'pending'
    });

    // Calculate average response time (in minutes)
    const appointments = await db.collection('appointments')
      .find({
        doctorId,
        responseTime: { $exists: true }
      })
      .project({ responseTime: 1 })
      .toArray();

    const averageResponseTime = appointments.length > 0
      ? Math.round(appointments.reduce((acc, curr) => acc + curr.responseTime, 0) / appointments.length)
      : 0;

    // Calculate monthly revenue (assuming $100 per appointment)
    const monthlyRevenue = monthlyAppointments * 100;

    // Calculate patient satisfaction (placeholder - would normally come from reviews)
    const patientSatisfaction = '95%';

    return NextResponse.json({
      monthlyAppointments,
      totalPatients: totalPatients.length,
      pendingPrescriptions,
      averageResponseTime: `${averageResponseTime} min`,
      monthlyRevenue,
      patientSatisfaction
    });
  } catch (error) {
    console.error('Error fetching practice stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 