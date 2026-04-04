import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import userRoutes from './routes/userRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🔥");
});
app.get("/api/test", (req, res) => {
  res.json({ message: "API working 🔥" });
});

app.get("/fix-admin", async (req, res) => {
  const bcrypt = (await import("bcrypt")).default;
  const User = (await import("./models/User.js")).default;

  const hashedPassword = await bcrypt.hash("RATTAN_27", 10);

  const adminUser = await User.findOneAndUpdate(
    { email: "admin@gmail.com" },
    { $set: { password: hashedPassword, role: "admin", name: "System Admin" } },
    { upsert: true, new: true }
  );

  res.send("Admin fixed 🔥 " + adminUser.email);
});
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
