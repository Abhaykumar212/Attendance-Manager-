const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cookieparser = require('cookie-parser');
const path = require('path');

require('dotenv').config();

// Middleware
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS config
const cors = require('cors');
const allowedOrigins = [
  'https://attendance-manager-five-kappa.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.error('Blocked by CORS:', origin);
      return callback(new Error('CORS not allowed from this origin'), false);
    }
  },
  credentials: true
}));

// Routes
const userRoutes = require('./router/userRoutes');
const dataRoutes = require('./router/dataRoute');
const studentRoute = require('./router/studentRoute');
const subjectRoute = require('./router/subjectRoute');
const notificationRoutes = require('./router/notifications');
const attendanceRoutes = require('./router/attendanceRoutes');

app.use('/', userRoutes);
app.use('/', dataRoutes);
app.use('/api/students', studentRoute);
app.use('/', subjectRoute);
app.use('/api/notifications', notificationRoutes);
app.use('/', attendanceRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const connectDB = require('./db/db');

// Server start
const server = require('http').createServer(app);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`✅ Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });
