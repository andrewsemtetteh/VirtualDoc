const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function checkDoctorData() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    const db = mongoose.connection.db;

    // Find the doctor by email
    const doctor = await db.collection('users').findOne({
      email: 'nana@gmail.com',
      role: 'doctor'
    });

    if (doctor) {
      console.log('\nDoctor Details:');
      console.log('------------------');
      console.log('Name:', doctor.fullName);
      console.log('Email:', doctor.email);
      console.log('Specialization:', doctor.specialization);
      console.log('Status:', doctor.status);
      console.log('License Number:', doctor.licenseNumber);
      console.log('Years of Experience:', doctor.yearsOfExperience);
      console.log('Created At:', doctor.createdAt);
      console.log('Updated At:', doctor.updatedAt);
    } else {
      console.log('Doctor not found');
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkDoctorData(); 