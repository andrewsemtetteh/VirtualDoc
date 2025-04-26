import bcrypt from 'bcryptjs';
import dbConnect from '../lib/dbConnect';
import User from '../models/User';

async function createAdmin() {
  try {
    await dbConnect();

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'andrewsemtetteh@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const adminUser = await User.create({
      fullName: 'Andrew Sem Tetteh',
      email: 'andrewsemtetteh@gmail.com',
      phoneNumber: '0508882013',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user created successfully:', adminUser);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdmin(); 