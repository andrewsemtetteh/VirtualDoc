import { NextResponse } from 'next/server';

// List of medical specializations
const specializations = [
  'All Specialties',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Oncology',
  'Pediatrics',
  'Psychiatry',
  'Radiology',
  'Urology'
];

export async function GET() {
  try {
    return NextResponse.json({ specializations });
  } catch (error) {
    console.error('Error fetching specialties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch specialties' },
      { status: 500 }
    );
  }
} 