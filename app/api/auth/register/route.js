import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';

export async function POST(req) {
  try {
    console.log('Starting registration process...');
    await dbConnect();
    console.log('Connected to database');

    const data = await req.formData();
    const formData = Object.fromEntries(data);
    console.log('Registration attempt for:', formData.email);

    // Check if user already exists
    const existingUser = await User.findOne({ email: formData.email });

    if (existingUser) {
      console.log('Registration failed: User already exists');
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Create user object based on role
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      password: hashedPassword,
      role: formData.role,
    };

    // Add role-specific fields
    if (formData.role === 'doctor') {
      userData.specialization = formData.specialization;
      userData.licenseNumber = formData.licenseNumber;
      userData.yearsOfExperience = parseInt(formData.yearsOfExperience);
      // Handle license document upload here
      if (formData.licenseDocument) {
        userData.licenseDocument = formData.licenseDocument;
      }
    } else if (formData.role === 'patient') {
      userData.dateOfBirth = new Date(formData.dateOfBirth);
      userData.gender = formData.gender;
    }

    // Handle profile picture upload if provided
    if (formData.profilePicture) {
      userData.profilePicture = formData.profilePicture;
    }

    // Create new user
    const user = await User.create(userData);
    console.log('User registered successfully:', {
      id: user._id,
      email: user.email,
      role: user.role
    });

    return NextResponse.json(
      { 
        message: 'Registration successful',
        userId: user._id,
        role: user.role
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific error cases
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'This email is already registered' },
        { status: 400 }
      );
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
} 