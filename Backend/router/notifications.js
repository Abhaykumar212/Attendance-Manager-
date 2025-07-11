const express = require('express');
const router = express.Router();
const { generatePersonalizedNotification, analyzeAttendancePattern } = require('../services/smartNotifications');

router.post('/personalized', async (req, res) => {
  try {
    const { studentData, attendanceRecords, context } = req.body;
    console.log(attendanceRecords)
    if (!studentData || !attendanceRecords || !context) {
      return res.status(400).json({ message: "Missing required fields." });
    }
    const pattern = analyzeAttendancePattern(attendanceRecords);
    const message = await generatePersonalizedNotification(studentData, pattern, context);
    res.json({ message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate notification.' });
  }
});

module.exports = router;