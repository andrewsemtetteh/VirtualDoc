require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Drop the existing index on licenseNumber if it exists
        try {
            await mongoose.connection.db.collection('users').dropIndex('licenseNumber_1');
            console.log('Dropped existing licenseNumber index');
        } catch (error) {
            // Index might not exist, which is fine
            console.log('No existing licenseNumber index to drop');
        }

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'andrewsemtetteh@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const admin = new User({
            fullName: 'Andrew Sem Tetteh',
            email: 'andrewsemtetteh@gmail.com',
            password: hashedPassword,
            role: 'admin',
            status: 'active'
        });

        // Save the admin user
        await admin.save();
        console.log('Admin user created successfully');

    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        // Close the database connection
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

createAdmin(); 