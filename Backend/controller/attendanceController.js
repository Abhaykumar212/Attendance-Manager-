// controllers/attendanceController.js

const Attendance = require('../model/attendance');

const submitAttendance = async (req, res) => {
  const records = req.body;

  // Validate input is an array
  if (!Array.isArray(records)) {
    return res.status(400).json({
      success: false,
      message: 'Expected an array of attendance records',
    });
  }

  try {
    const savedRecords = await Attendance.insertMany(records);
    console.log("Attendance saved successfully");

    return res.status(201).json({
      success: true,
      message: 'Attendance saved successfully',
      data: savedRecords,
    });
  } catch (error) {
    console.error('DB insert error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving attendance',
    });
  }
};

module.exports = {
  submitAttendance, 
};
