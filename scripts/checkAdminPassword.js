require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function checkAdminPassword() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the admin user
        const admin = await User.findOne({ email: 'andrewsemtetteh@gmail.com' });
        
        if (!admin) {
            console.log('Admin user not found');
            return;
        }

        console.log('Admin user found:', {
            email: admin.email,
            status: admin.status,
            hasPassword: !!admin.password,
            passwordLength: admin.password ? admin.password.length : 0
        });

    } catch (error) {
        console.error('Error checking admin password:', error);
    } finally {
        // Close the database connection
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

checkAdminPassword(); 