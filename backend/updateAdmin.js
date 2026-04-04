import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Look for the admin user, or any user with role 'admin'
        let admin = await User.findOne({ role: 'admin' });

        if (admin) {
            admin.email = 'JERRYXONE@gmail.com';
            admin.password = 'RATTAN27';
            admin.name = 'Admin'; // Updating name as well just in case
            await admin.save();
            console.log('Admin user updated successfully');
        } else {
            // Create new admin user
            admin = await User.create({
                name: 'Admin',
                email: 'JERRYXONE@gmail.com',
                password: 'RATTAN27',
                role: 'admin'
            });
            console.log('Admin user created successfully');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error updating admin:', error);
        process.exit(1);
    }
};

updateAdmin();
