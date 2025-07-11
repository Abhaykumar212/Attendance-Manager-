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

const db = require('./db/db');
require('dotenv').config();
db.connect;

const server = require('http').createServer(app)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cors = require('cors')
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST"], 
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use('/', userRoutes);
app.use('/', dataRoutes);
app.use('/api/students', studentRoute);
app.use('/', subjectRoute);
// ...existing code...
const notificationRoutes = require('./router/notifications');
app.use('/api/notifications', notificationRoutes);
// ...existing code...
app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/attendanceDB')
.then(() => {
    console.log('Connected to MongoDB locally');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});
