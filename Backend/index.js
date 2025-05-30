const express = require('express')
const app = express()
const port = 3000
const cookieparser = require('cookie-parser')
app.use(cookieparser())
const userRoutes = require('./router/userRoutes');
require('dotenv').config();

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

server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/attendanceDB')
.then(() => {
    console.log('Connected to MongoDB locally');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
});
