const errorHandler = require('./middleware/errorHandler');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));
// Authentication Routes
app.use('/api/auth', authRoutes);
// Event Routes
app.use('/api/events', eventRoutes);
app.use(errorHandler);

// Home API
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to CampusConnect API!',
        project: 'Campus Event Management System',
        status: 'Server is running successfully'
    });
});

// Health check API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'CampusConnect server is healthy'
    });
});

// Server configuration
const PORT = process.env.PORT || 5001;

// Connect database before starting server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`CampusConnect server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
