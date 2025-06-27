const mongoose = require('mongoose');

const MONGO_URI = 'mongodb://127.0.0.1:27017/attendanceDB';

mongoose.connect(MONGO_URI);

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB at', MONGO_URI);
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

module.exports = db;
