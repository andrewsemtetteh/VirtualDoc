const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function checkDoctors() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    const db = mongoose.connection.db;

    // Find all doctors
    const doctors = await db.collection('users').find({
      role: 'doctor'
    }).toArray();

    console.log(`\nFound ${doctors.length} total doctors:`);
    
    // Group doctors by status
    const doctorsByStatus = doctors.reduce((acc, doctor) => {
      const status = doctor.status || 'unknown';
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(doctor);
      return acc;
    }, {});

    // Print doctors by status
    Object.entries(doctorsByStatus).forEach(([status, doctors]) => {
      console.log(`\n${status.toUpperCase()} doctors (${doctors.length}):`);
      doctors.forEach(doctor => {
        console.log(`- ${doctor.fullName} (${doctor.email})`);
      });
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkDoctors(); 