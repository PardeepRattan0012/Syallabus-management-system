import connectDB from './config/db.js';
import Subject from './models/Subject.js';
import dotenv from 'dotenv';

dotenv.config();

connectDB().then(async () => {
    try {
        console.log("Starting Army Theme Database Migration...");
        
        // Find all subjects that have the old purple gradient
        const subjects = await Subject.find({});
        let count = 0;

        for (const subject of subjects) {
            if (subject.colorHex && subject.colorHex.includes('purple-600')) {
                subject.colorHex = subject.colorHex.replace('purple-600', '[#4b5e28]');
                await subject.save();
                count++;
            }
        }
        
        console.log(`Migration Complete: Updated ${count} subjects to the new Army gradient.`);
    } catch(e) {
        console.log("Migration error:", e);
    }
    process.exit(0);
});
