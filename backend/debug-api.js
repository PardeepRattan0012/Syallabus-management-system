import connectDB from './config/db.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB().then(async () => {
    try {
        const user = await User.findOne({ email: 'money@gmail.com' }); // or whichever user they logged in as
        if (!user) {
            console.log("no user");
            process.exit(1);
        }
        console.log("User:", user.email);
        console.log("Progress array:", user.progress);
    } catch(e) {
        console.log("error", e);
    }
    process.exit(0);
});
