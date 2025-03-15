import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';
import User from '../models/User.js';
import dbConnect from '../config/db.js';

// Generate JWT Token
const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Register a new user
export const registerUser = async (req) => {
  try {
    await dbConnect();

    const formData = await req.formData();
    const profileImage = formData.get('profileImage');
    
    let profileImagePath = '';
    if (profileImage) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create unique filename
      const filename = `${Date.now()}-${profileImage.name}`;
      const filepath = path.join(process.cwd(), 'public/uploads', filename);
      
      // Save file
      await writeFile(filepath, buffer);
      profileImagePath = `/uploads/${filename}`;
    }

    // Create user data object
    const userData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      password: formData.get('password'),
      role: formData.get('role'),
      profileImage: profileImagePath,
      // Add other fields
      specialization: formData.get('specialization') || undefined,
      licenseNumber: formData.get('licenseNumber') || undefined,
      yearsOfExperience: formData.get('yearsOfExperience') || undefined,
      dateOfBirth: formData.get('dateOfBirth') || undefined,
      gender: formData.get('gender') || undefined,
      address: formData.get('address') || undefined,
    };

    // Check if user exists with the same email
    const existingUserByEmail = await User.findOne({ email: userData.email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if user exists with the same phone number
    const existingUserByPhone = await User.findOne({ phoneNumber: userData.phoneNumber });
    if (existingUserByPhone) {
      return NextResponse.json(
        { error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Create new user
    const user = await User.create(userData);
    
    // Generate JWT token
    const token = generateToken(user._id, user.role);

    // Remove password from response
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;

    return NextResponse.json({
      user: userWithoutPassword,
      token
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};

// Login user
export const loginUser = async (req) => {
  try {
    await dbConnect();
    
    const { login, password } = await req.json();
    
    // Check if login field is provided
    if (!login) {
      return NextResponse.json(
        { error: 'Email or phone number is required' },
        { status: 400 }
      );
    }
    
    try {
      // Use the static method to find user by credentials
      const user = await User.findByCredentials(login, password);
      
      // Generate JWT token
      const token = generateToken(user._id, user.role);
      
      // Remove password from response
      const userWithoutPassword = { ...user.toObject() };
      delete userWithoutPassword.password;
      
      return NextResponse.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}; 