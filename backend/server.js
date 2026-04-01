import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import topicRoutes from './routes/topicRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: function(origin, callback) {
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
  const User = (await import("./models/userModel.js")).default;

  const hashedPassword = await bcrypt.hash("123456", 10);

  await User.findOneAndUpdate(
    { email: "admin@gmail.com" },
    { password: hashedPassword, role: "admin" }
  );

  res.send("Admin fixed 🔥");
});
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
