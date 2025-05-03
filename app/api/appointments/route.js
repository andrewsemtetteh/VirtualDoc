import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Appointment from '@/models/Appointment';
import { connectToDatabase } from '@/lib/db';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Session user:', session.user); // Debug log

    const body = await req.json();
    const { doctorId, patientId, date, time, reason, notes } = body;

    console.log('Request body:', body); // Debug log

    // Validate required fields
    if (!doctorId || !patientId || !date || !time || !reason) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that the patientId matches the session user
    const userId = session.user._id || session.user.id;
    if (patientId !== userId) {
      console.log('Patient ID mismatch:', { patientId, userId }); // Debug log
      return NextResponse.json(
        { message: 'Unauthorized to book appointment for another user' },
        { status: 403 }
      );
    }

    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    // Validate date and time
    const appointmentDateTime = new Date(`${date}T${time}`);
    if (isNaN(appointmentDateTime.getTime())) {
      return NextResponse.json(
        { message: 'Invalid date or time format' },
        { status: 400 }
      );
    }

    if (appointmentDateTime < new Date()) {
      return NextResponse.json(
        { message: 'Cannot book appointments in the past' },
        { status: 400 }
      );
    }

    try {
      // Check for existing appointments at the same time
      const existingAppointment = await Appointment.findOne({
        doctorId: new mongoose.Types.ObjectId(doctorId),
        date,
        time,
        status: { $in: ['pending', 'accepted'] }
      });

      if (existingAppointment) {
        return NextResponse.json(
          { message: 'This time slot is already booked' },
          { status: 400 }
        );
      }

      // Create new appointment
      const appointment = await Appointment.create({
        patientId: new mongoose.Types.ObjectId(patientId),
        doctorId: new mongoose.Types.ObjectId(doctorId),
        date,
        time,
        reason,
        notes: notes || null,
        status: 'pending'
      });

      console.log('Created appointment:', appointment); // Debug log

      return NextResponse.json(appointment, { status: 201 });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return NextResponse.json(
        { message: 'Error creating appointment' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in POST /api/appointments:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      console.error('No session found');
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Session user:', session.user); // Debug log

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const role = searchParams.get('role') || 'patient';

    try {
      await connectToDatabase();
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { message: 'Database connection failed' },
        { status: 500 }
      );
    }

    let query = {};
    
    // Filter by role (patient or doctor)
    if (role === 'patient') {
      const userId = session.user._id || session.user.id;
      if (!userId) {
        console.error('No user ID found in session:', session.user);
        return NextResponse.json(
          { message: 'User ID not found in session' },
          { status: 400 }
        );
      }
      console.log('Patient ID:', userId); // Debug log
      query.patientId = new mongoose.Types.ObjectId(userId);
    } else if (role === 'doctor') {
      const userId = session.user._id || session.user.id;
      if (!userId) {
        console.error('No user ID found in session:', session.user);
        return NextResponse.json(
          { message: 'User ID not found in session' },
          { status: 400 }
        );
      }
      console.log('Doctor ID:', userId); // Debug log
      query.doctorId = new mongoose.Types.ObjectId(userId);
    }

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    console.log('Query:', query); // Debug log

    try {
      // First, find the appointments
      const appointments = await Appointment.find(query)
        .sort({ date: 1, time: 1 });

      console.log('Found appointments:', appointments); // Debug log

      // Then, populate the references
      const populatedAppointments = await Promise.all(
        appointments.map(async (appointment) => {
          try {
            // Populate patient
            const patient = await mongoose.model('User').findById(appointment.patientId)
              .select('name email')
              .lean();

            // Populate doctor
            const doctor = await mongoose.model('Doctor').findById(appointment.doctorId)
              .select('name email specialization')
              .lean();

            return {
              ...appointment.toObject(),
              patientId: patient,
              doctorId: doctor
            };
          } catch (error) {
            console.error('Error populating references:', error);
            return appointment;
          }
        })
      );

      console.log('Populated appointments:', populatedAppointments); // Debug log

      return NextResponse.json(populatedAppointments);
    } catch (findError) {
      console.error('Error finding appointments:', findError);
      return NextResponse.json(
        { message: 'Error fetching appointments', error: findError.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in GET /api/appointments:', error);
    return NextResponse.json(
      { message: error.message || 'Internal server error', error: error.stack },
      { status: 500 }
    );
  }
} 