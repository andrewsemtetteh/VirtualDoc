import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
import { sendVerificationEmail, sendAdminNotificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    // Log the content type to debug
    console.log('Content-Type:', request.headers.get('content-type'));

    let data;
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('multipart/form-data')) {
      data = await request.formData();
      console.log('Form data received:', Object.fromEntries(data.entries()));
    } else if (contentType?.includes('application/json')) {
      data = await request.json();
      console.log('JSON data received:', data);
    } else {
      console.error('Unsupported content type:', contentType);
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    // Extract form data
    const fullName = data.get?.('fullName') || data.fullName;
    const email = data.get?.('email') || data.email;
    const password = data.get?.('password') || data.password;
    const role = data.get?.('role') || data.role;
    const phoneNumber = data.get?.('phoneNumber') || data.phoneNumber;
    const specialization = data.get?.('specialization') || data.specialization;
    const licenseNumber = data.get?.('licenseNumber') || data.licenseNumber;
    const yearsOfExperience = data.get?.('yearsOfExperience') || data.yearsOfExperience;
    const dateOfBirth = data.get?.('dateOfBirth') || data.dateOfBirth;
    const gender = data.get?.('gender') || data.gender;
    const profileImage = data instanceof FormData ? data.get('profileImage') : null;
    const licenseDocument = data instanceof FormData ? data.get('licenseDocument') : null;

    console.log('Extracted data:', {
      fullName,
      email,
      role,
      specialization,
      licenseNumber,
      yearsOfExperience
    });

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      console.error('Missing required fields:', { fullName, email, role });
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
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle file uploads (if any)
    let profileImageUrl = null;
    let licenseDocumentUrl = null;

    if (profileImage && profileImage.size > 0) {
      // TODO: Implement file upload to cloud storage
      // For now, just log that we received the file
      console.log('Profile image received:', profileImage.name, profileImage.type);
    }

    if (licenseDocument && licenseDocument.size > 0) {
      // TODO: Implement file upload to cloud storage
      // For now, just log that we received the file
      console.log('License document received:', licenseDocument.name, licenseDocument.type);
    }

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
      profilePicture: profileImageUrl,
      licenseDocument: licenseDocumentUrl,
      status: role === 'doctor' ? 'pending' : 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Creating user:', { ...user, password: '[REDACTED]' });

    // Insert user into database
    const result = await db.collection('users').insertOne(user);
    console.log('User created with ID:', result.insertedId);

    try {
      // Send verification email for doctors
      if (role === 'doctor') {
        // Send verification email
        await sendVerificationEmail(email, fullName);
        console.log('Verification email sent to:', email);

        // Send admin notification
        await sendAdminNotificationEmail(fullName, 'pending');
        console.log('Admin notification sent for:', fullName);

        // Create notification for admin
        await db.collection('notifications').insertOne({
          type: 'doctor_verification',
          title: 'New Doctor Registration',
          message: `${fullName} has registered as a doctor and requires verification.`,
          userId: result.insertedId,
          status: 'pending',
          createdAt: new Date(),
          read: false
        });
        console.log('Admin notification created in database');
      }
    } catch (notificationError) {
      // Log but don't fail if notifications fail
      console.error('Error sending notifications:', notificationError);
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
    // Log the full error
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    
    // Return a more specific error message if possible
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
} 