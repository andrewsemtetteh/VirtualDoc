const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Hide password in logs
console.log('Attempting to connect to MongoDB Atlas...');

// Define User Schema
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    enum: ['admin', 'doctor', 'patient']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create User model
let User;
try {
  User = mongoose.model('User');
} catch {
  User = mongoose.model('User', userSchema);
}

async function seedAdmin() {
  let connection;
  try {
    // Connect with more detailed options
    connection = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });

    console.log('Successfully connected to MongoDB Atlas');
    console.log('Connected to database:', connection.connection.db.databaseName);

    // Drop existing users collection
    console.log('Dropping existing users collection...');
    await connection.connection.collection('users').drop().catch(err => {
      if (err.code !== 26) { // 26 is collection doesn't exist error
        throw err;
      }
    });
    console.log('Users collection dropped or did not exist');

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      fullName: 'Andrew Tetteh',
      email: 'andrewsemtetteh@gmail.com',
      phoneNumber: '0508882013',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully:', {
      id: adminUser._id.toString(),
      email: adminUser.email,
      role: adminUser.role
    });

    // Verify the user was created
    const verifyUser = await User.findOne({ email: 'andrewsemtetteh@gmail.com' });
    if (verifyUser) {
      console.log('Verified admin user exists in database');
      console.log('User details:', {
        id: verifyUser._id.toString(),
        email: verifyUser.email,
        role: verifyUser.role,
        createdAt: verifyUser.createdAt
      });
    } else {
      throw new Error('Failed to verify admin user after creation');
    }

    // List all users in the database
    const allUsers = await User.find({}, '-password');
    console.log('\nAll users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log('- User:', {
        id: user._id.toString(),
        email: user.email,
        role: user.role
      });
    });

  } catch (error) {
    console.error('Error seeding admin user:', error);
    if (error.code === 11000) {
      console.error('Duplicate key error - user might already exist');
    }
    throw error;
  } finally {
    if (connection) {
      await connection.disconnect();
      console.log('Disconnected from MongoDB Atlas');
    }
  }
}

// Run the seed function
console.log('Starting admin user seed process...');
seedAdmin()
  .then(() => {
    console.log('Seed process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed process failed:', error);
    process.exit(1);
  }); 