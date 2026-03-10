const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

dotenv.config();
require('./config/env');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

// Security & parsing middleware
app.use(
    helmet({
        contentSecurityPolicy: false,
    }),
);

const allowedOrigins = (process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim());

app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const studentsRoutes = require('./routes/students');
const busRoutes = require('./routes/buses');
const attendanceRoutes = require('./routes/attendance');
const pickupRoutes = require('./routes/pickup');
const dismissalRoutes = require('./routes/dismissal');
const academicRoutes = require('./routes/academic');
const behaviorRoutes = require('./routes/behavior');
const activityRoutes = require('./routes/activities');
const notificationRoutes = require('./routes/notifications');
const teacherRoutes = require('./routes/teacher');
const parentRoutes = require('./routes/parent');
const concernsRoutes = require('./routes/concerns');
const adminCommandCenterRoutes = require('./routes/adminCommandCenter');
const studentRoutes = require('./routes/student');
const wellbeingRoutes = require('./routes/wellbeing');
const driverRoutes = require('./routes/driver');
const governmentRoutes = require('./routes/government');

app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/pickup', pickupRoutes);
app.use('/api/dismissal', dismissalRoutes);
app.use('/api/academic', academicRoutes);
app.use('/api/behavior', behaviorRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/concerns', concernsRoutes);
app.use('/api/admin/command-center', adminCommandCenterRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/wellbeing', wellbeingRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/government', governmentRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Amantac API is running' });
});

// Error handler (must be last)
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Make io available to routes
app.set('io', io);

// Socket.io for real-time updates
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Database connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/amantac', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api/health`);
});

module.exports = { app, io };
