require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateAdminStatus() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Update the admin user's status
        const result = await User.findOneAndUpdate(
            { email: 'andrewsemtetteh@gmail.com' },
            { 
                $set: { 
                    status: 'active',
                    lastLogin: new Date()
                }
            },
            { new: true }
        );

        if (result) {
            console.log('Admin status updated successfully:', {
                email: result.email,
                status: result.status
            });
        } else {
            console.log('Admin user not found');
        }

    } catch (error) {
        console.error('Error updating admin status:', error);
    } finally {
        // Close the database connection
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
        process.exit(0);
    }
}

updateAdminStatus(); 