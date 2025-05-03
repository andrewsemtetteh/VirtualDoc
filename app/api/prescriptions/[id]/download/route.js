import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const prescriptionId = params.id;

    // Get the prescription
    const prescription = await db.collection('prescriptions').findOne({
      _id: new ObjectId(prescriptionId),
      doctorId: new ObjectId(session.user.id)
    });

    if (!prescription) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    // Get patient information
    const patient = await db.collection('users').findOne(
      { _id: new ObjectId(prescription.patientId) },
      { projection: { fullName: 1, email: 1 } }
    );

    // Create PDF content
    const pdfContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; color: #666; }
            .value { margin-left: 10px; }
            .footer { margin-top: 50px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescription</h1>
            <p>Date: ${new Date(prescription.createdAt).toLocaleDateString()}</p>
          </div>

          <div class="section">
            <p><span class="label">Patient:</span> <span class="value">${patient?.fullName || 'Unknown Patient'}</span></p>
            <p><span class="label">Email:</span> <span class="value">${patient?.email || 'N/A'}</span></p>
          </div>

          <div class="section">
            <p><span class="label">Diagnosis:</span> <span class="value">${prescription.diagnosis}</span></p>
            <p><span class="label">Treatment Plan:</span> <span class="value">${prescription.treatmentPlan}</span></p>
          </div>

          <div class="section">
            <p><span class="label">Medication:</span> <span class="value">${prescription.medication}</span></p>
            <p><span class="label">Dosage:</span> <span class="value">${prescription.dosage}</span></p>
            <p><span class="label">Frequency:</span> <span class="value">${prescription.frequency}</span></p>
            <p><span class="label">Duration:</span> <span class="value">${prescription.duration}</span></p>
          </div>

          ${prescription.additionalInstructions ? `
            <div class="section">
              <p><span class="label">Additional Instructions:</span> <span class="value">${prescription.additionalInstructions}</span></p>
            </div>
          ` : ''}

          <div class="footer">
            <p>Prescribed by: Dr. ${session.user.name}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    // Convert HTML to PDF (you'll need to implement this part)
    // For now, we'll return the HTML content
    return new NextResponse(pdfContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': 'attachment; filename="prescription.html"'
      }
    });
  } catch (error) {
    console.error('Error generating prescription PDF:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 