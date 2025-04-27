import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const { db } = await connectToDatabase();
  const doctor = await db.collection('users').findOne(
    { email, role: 'doctor' },
    { projection: { password: 0 } }
  );
  if (!doctor) {
    return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
  }
  return NextResponse.json(doctor);
} 