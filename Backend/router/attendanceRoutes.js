const express = require('express');
const router = express.Router();
const { submitAttendance } = require('../controller/attendanceController');

router.post('/attendance', submitAttendance);

module.exports = router;
