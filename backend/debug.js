import connectDB from './config/db.js';
import Content from './models/Content.js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

connectDB().then(async () => {
    const c = await Content.find().lean();
    fs.writeFileSync('c.json', JSON.stringify(c, null, 2));
    process.exit(0);
});
