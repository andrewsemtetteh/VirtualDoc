import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    
    // Get all prescriptions for the patient
    const prescriptions = await db.collection('prescriptions')
      .find({ 
        patientId: new ObjectId(session.user.id),
        status: 'active'
      })
      .sort({ createdAt: -1 })
      .toArray();

    console.log('Found prescriptions:', prescriptions.length);
    
    // Log the doctor IDs we need to look up
    prescriptions.forEach(p => {
      console.log('Prescription doctorId:', p.doctorId, typeof p.doctorId);
    });
    
    // Populate doctor information for each prescription
    const populatedPrescriptions = await Promise.all(
      prescriptions.map(async (prescription) => {
        try {
          // Make sure we have a valid doctorId
          if (!prescription.doctorId) {
            console.log('Missing doctorId for prescription:', prescription._id);
            throw new Error('Missing doctorId');
          }
          
          // Convert string ID to ObjectId if needed
          const doctorId = typeof prescription.doctorId === 'string' 
            ? new ObjectId(prescription.doctorId) 
            : prescription.doctorId;
          
          // Get doctor information from users collection where role='doctor'
          const doctor = await db.collection('users').findOne(
            { _id: doctorId, role: 'doctor' }
          );
          
          // Add debug log
          console.log('Doctor lookup result:', doctor ? 
            `Found: ${doctor.fullName}` : 
            'Not found. Searching without role filter...');
          
          // If not found with role filter, try without it as a fallback
          let finalDoctor = doctor;
          if (!doctor) {
            finalDoctor = await db.collection('users').findOne(
              { _id: doctorId }
            );
            console.log('Secondary lookup result:', finalDoctor ? 
              `Found: ${finalDoctor.fullName} (role: ${finalDoctor.role})` : 
              'Not found at all');
          }

          // Get appointment information 
          const appointment = await db.collection('appointments').findOne(
            { _id: new ObjectId(prescription.appointmentId) }
          );

          return {
            ...prescription,
            doctor: {
              fullName: finalDoctor?.fullName || 'Unknown Doctor',
              specialization: finalDoctor?.specialization || 'General Practitioner',
              profilePicture: finalDoctor?.profilePicture
            },
            appointment: {
              date: appointment?.scheduledFor,
              type: appointment?.type
            }
          };
        } catch (error) {
          console.error('Error processing prescription:', error, 'Prescription ID:', prescription._id);
          return {
            ...prescription,
            doctor: {
              fullName: 'Unknown Doctor',
              specialization: 'General Practitioner',
              profilePicture: null
            },
            appointment: {
              date: null,
              type: 'Unknown'
            }
          };
        }
      })
    );

    return NextResponse.json(populatedPrescriptions);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
} 