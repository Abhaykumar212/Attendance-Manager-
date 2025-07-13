const express = require('express')
const app = express()
const port = process.env.PORT || 3000;
const cookieparser = require('cookie-parser')
app.use(cookieparser())
const userRoutes = require('./router/userRoutes');
const path = require('path');
const dataRoutes = require('./router/dataRoute');
const studentRoute = require('./router/studentRoute');
const subjectRoute = require('./router/subjectRoute');

// const db = require('./db/db');
require('dotenv').config();
// db.connect;

const server = require('http').createServer(app)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors')
const allowedOrigins = ['https://attendance-manager-five-kappa.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed from this origin'), false);
    }
  },
  credentials: true
}));

app.use('/', userRoutes);
app.use('/', dataRoutes);
app.use('/api/students', studentRoute);
app.use('/', subjectRoute);

const notificationRoutes = require('./router/notifications');
app.use('/api/notifications', notificationRoutes);

app.use(express.static(path.join(__dirname, 'public')))

const connectDB = require('./db/db');

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err);
  });
