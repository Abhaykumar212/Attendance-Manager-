const express = require('express');
const router = express.Router();
const { generateAttendanceQR, markAttendanceQR, getQRSessionStats } = require('../controller/qrAttendanceController');
const userAuth = require('../middleware/userAuth');

// Generate QR code for attendance (Professor only)
router.post('/generate', userAuth, generateAttendanceQR);

// Mark attendance via QR scan (Student only)
router.post('/mark', userAuth, markAttendanceQR);

// Get QR session statistics (Professor only)
router.get('/session/:sessionId', userAuth, getQRSessionStats);

module.exports = router;
