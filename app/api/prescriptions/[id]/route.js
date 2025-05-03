import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const prescriptionId = params.id;

    // Delete the prescription
    const result = await db.collection('prescriptions').deleteOne({
      _id: new ObjectId(prescriptionId),
      doctorId: new ObjectId(session.user.id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Prescription not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Prescription deleted successfully' });
  } catch (error) {
    console.error('Error deleting prescription:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 