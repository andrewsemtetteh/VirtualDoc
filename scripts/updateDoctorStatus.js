const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function updateDoctorStatus() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    const db = mongoose.connection.db;

    // Find all doctors with 'approved' status
    const doctors = await db.collection('users').find({
      role: 'doctor',
      status: 'approved'
    }).toArray();

    console.log(`Found ${doctors.length} doctors with 'approved' status`);

    if (doctors.length > 0) {
      // Update all approved doctors to active status
      const result = await db.collection('users').updateMany(
        { role: 'doctor', status: 'approved' },
        { 
          $set: { 
            status: 'active',
            updatedAt: new Date()
          }
        }
      );

      console.log(`Updated ${result.modifiedCount} doctors to 'active' status`);

      // Log the updated doctors
      console.log('\nUpdated doctors:');
      doctors.forEach(doctor => {
        console.log(`- ${doctor.fullName} (${doctor.email})`);
      });
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

updateDoctorStatus(); 