import { connectToDatabase } from '../lib/mongodb';
import bcrypt from 'bcryptjs';

async function seedAdminUser() {
  try {
    const { db } = await connectToDatabase();

    // Check if admin already exists
    const existingAdmin = await db.collection('users').findOne({ 
      email: 'andrewsemtetteh@gmail.com' 
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash('admin@123', 10);

    // Create admin user
    const adminUser = {
      fullName: 'Admin User',
      email: 'andrewsemtetteh@gmail.com',
      password: hashedPassword,
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert admin user
    const result = await db.collection('users').insertOne(adminUser);
    console.log('Admin user created successfully:', result.insertedId);
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    process.exit(0);
  }
}

seedAdminUser(); 