const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define User Schema (same as in your main app)
const userSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  password: String,
  role: String,
});

// Create User model
let User;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', userSchema);
}

async function listUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Successfully connected to MongoDB');

    console.log('\nFetching all users...');
    const users = await User.find({}, '-password'); // Exclude password field
    
    if (users.length === 0) {
      console.log('No users found in the database');
    } else {
      console.log('\nUsers in database:');
      users.forEach(user => {
        console.log('\n-------------------');
        console.log('Full Name:', user.fullName);
        console.log('Email:', user.email);
        console.log('Phone:', user.phoneNumber);
        console.log('Role:', user.role);
        console.log('ID:', user._id);
      });
      console.log('\nTotal users:', users.length);
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

listUsers(); 