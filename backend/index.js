// index.js
import express from 'express';
import { app, server } from './socket/socket.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoute.js';
import studentRoutes from './routes/studentRoute.js';
import notificationRoutes from './routes/notificationRoutes.js';
import timetableRoutes from './routes/timetableRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';
import zoomRoutes from './routes/zoomRoutes.js';
import performanceRotes from './routes/performanceRoutes.js';
import subjectRoutes from './routes/subjectRoutes.js';
import classRoutes from './routes/classRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import assignmetRoutes from './routes/AssignmentRoutes.js';


dotenv.config();

// Connect to MongoDB
connectDB();

// ✅ Correct CORS setup
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,  
};
app.use(cors(corsOptions));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ Fixed this line
app.use(cookieParser());

// Test route
app.get('/', (req, res) => {
  res.send('✅ API is running...');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/performance', performanceRotes);
app.use('/api/zoom', zoomRoutes);
app.use('/api/subject',subjectRoutes);
app.use('/api/class',classRoutes);
app.use('/api/attendance',attendanceRoutes);
app.use('/api/assignment',assignmetRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: '❌ Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: '💥 Server Error', error: err.message });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
