const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

async function checkSession() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    const db = mongoose.connection.db;

    // Find the doctor's session
    const sessions = await db.collection('sessions').find({}).toArray();
    
    console.log('\nFound', sessions.length, 'sessions');
    
    for (const session of sessions) {
      try {
        const sessionData = JSON.parse(session.session);
        if (sessionData.user?.email === 'nana@gmail.com') {
          console.log('\nDoctor Session Data:');
          console.log('------------------');
          console.log('User:', sessionData.user);
          console.log('Expires:', session.expires);
        }
      } catch (e) {
        console.log('Error parsing session:', e);
      }
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkSession(); 