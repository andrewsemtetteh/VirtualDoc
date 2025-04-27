import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const formData = await request.formData();
    
    // Extract form data
    const fullName = formData.get('fullName');
    const email = formData.get('email');
    const password = formData.get('password');
    const role = formData.get('role');
    const phoneNumber = formData.get('phoneNumber');
    const specialization = formData.get('specialization');
    const licenseNumber = formData.get('licenseNumber');
    const yearsOfExperience = formData.get('yearsOfExperience');
    const dateOfBirth = formData.get('dateOfBirth');
    const gender = formData.get('gender');

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user object
    const user = {
      fullName,
      email,
      password: hashedPassword,
      role,
      phoneNumber: phoneNumber || null,
      specialization: role === 'doctor' ? specialization : null,
      licenseNumber: role === 'doctor' ? licenseNumber : null,
      yearsOfExperience: role === 'doctor' ? yearsOfExperience : null,
      dateOfBirth: role === 'patient' ? dateOfBirth : null,
      gender: role === 'patient' ? gender : null,
      status: role === 'doctor' ? 'pending' : 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert user into database
    const result = await db.collection('users').insertOne(user);

    // Send verification email for doctors
    if (role === 'doctor') {
      await sendVerificationEmail(email, fullName);
    }

    return NextResponse.json(
      { 
        message: 'Registration successful', 
        userId: result.insertedId,
        role: user.role,
        status: user.status
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 