import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { writeFile } from 'fs/promises';
import path from 'path';
import User from '../models/User.js';
import dbConnect from '../config/db.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Create reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

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
    
    const { fullName, email, phoneNumber, password, role, specialization, licenseNumber, yearsOfExperience, dateOfBirth, gender, address } = await req.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or phone number already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = await User.create({
      fullName,
      email,
      phoneNumber,
      password,
      role,
      specialization,
      licenseNumber,
      yearsOfExperience,
      dateOfBirth,
      gender,
      address
    });
    
    // Remove password from response
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;
    
    return NextResponse.json(
      { user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
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
    
    const { email, password } = await req.json();
    
    // Find user by credentials
    const user = await User.findByCredentials(email, password);
    
    // Create session
    const session = {
      userId: user._id,
      role: user.role,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
    
    // Remove password from response
    const userWithoutPassword = { ...user.toObject() };
    delete userWithoutPassword.password;
    
    // Set session cookie
    const response = NextResponse.json(
      { user: userWithoutPassword },
      { status: 200 }
    );
    
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });
    
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 401 }
    );
  }
};

// Forgot password
export const forgotPassword = async (req) => {
  try {
    await dbConnect();
    
    const { email } = await req.json();
    
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'No account with that email exists' },
        { status: 404 }
      );
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetExpires = Date.now() + 3600000; // 1 hour
    
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();
    
    // Send reset email
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset</p>
        <p>Click this <a href="${resetUrl}">link</a> to reset your password</p>
        <p>This link will expire in 1 hour</p>
      `
    });
    
    return NextResponse.json(
      { message: 'Password reset email sent' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
};

// Reset password
export const resetPassword = async (req) => {
  try {
    await dbConnect();
    
    const { token, password } = await req.json();
    
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }
    
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}; 