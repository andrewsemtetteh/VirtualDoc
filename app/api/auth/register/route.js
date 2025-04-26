import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../../lib/dbConnect';
import User from '../../../../models/User';

export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.formData();
    const formData = Object.fromEntries(data);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: formData.email },
        { phoneNumber: formData.phoneNumber }
      ]
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Create user object based on role
    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
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

    return NextResponse.json(
      { message: 'Registration successful', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 