const attendanceModel = require('../model/attendance');
const studentModel = require('../model/studentModel');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Store active QR sessions in memory (in production, use Redis)
const activeQRSessions = new Map();

// Generate QR Code for attendance
const generateAttendanceQR = async (req, res) => {
  try {
    const { subjectCode, className, classLocation, duration = 60 } = req.body;
    const professorEmail = req.userData.email;

    if (!subjectCode || !className || !classLocation) {
      return res.status(400).json({ 
        success: false, 
        error: 'Subject code, class name, and location are required' 
      });
    }

    // Generate unique session ID
    const sessionId = crypto.randomUUID();
    const timestamp = Date.now();
    const expiryTime = timestamp + (duration * 1000); // Convert to milliseconds

    // Create QR data
    const qrData = {
      sessionId,
      subjectCode,
      className,
      classLocation,
      professorEmail,
      timestamp,
      expiryTime
    };

    // Store session data
    activeQRSessions.set(sessionId, {
      ...qrData,
      studentsPresent: new Set()
    });

    // Set timeout to clean up expired session
    setTimeout(() => {
      activeQRSessions.delete(sessionId);
    }, duration * 1000);

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    res.status(200).json({
      success: true,
      qrCode: qrCodeDataURL,
      sessionId,
      expiryTime,
      duration,
      message: `QR code generated for ${className} - ${subjectCode}`
    });

  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate QR code' });
  }
};

// Mark attendance via QR scan
const markAttendanceQR = async (req, res) => {
  try {
    const { qrData, studentLocation } = req.body;
    const studentEmail = req.userData.email;

    if (!qrData || !studentLocation) {
      return res.status(400).json({ 
        success: false, 
        error: 'QR data and location are required' 
      });
    }

    let parsedQRData;
    try {
      parsedQRData = JSON.parse(qrData);
    } catch (error) {
      return res.status(400).json({ success: false, error: 'Invalid QR code' });
    }

    const { sessionId, expiryTime, classLocation } = parsedQRData;

    // Check if session exists and is still valid
    const session = activeQRSessions.get(sessionId);
    if (!session) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired QR code' 
      });
    }

    // Check if QR code has expired
    if (Date.now() > expiryTime) {
      activeQRSessions.delete(sessionId);
      return res.status(400).json({ 
        success: false, 
        error: 'QR code has expired' 
      });
    }

    // Verify geolocation (simple distance check)
    const isLocationValid = verifyLocation(studentLocation, classLocation);
    if (!isLocationValid) {
      return res.status(400).json({ 
        success: false, 
        error: 'You must be in the classroom to mark attendance' 
      });
    }

    // Check if student already marked attendance for this session
    if (session.studentsPresent.has(studentEmail)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Attendance already marked for this session' 
      });
    }

    // Get student data
    const student = await studentModel.findOne({ email: studentEmail });
    if (!student) {
      return res.status(404).json({ success: false, error: 'Student not found' });
    }

    // Mark attendance in session
    session.studentsPresent.add(studentEmail);

    // Save attendance to database
    const attendanceRecord = new attendanceModel({
      studentEmail,
      studentName: student.name,
      rollNo: student.rollNo,
      subjectCode: parsedQRData.subjectCode,
      className: parsedQRData.className,
      date: new Date(),
      status: 'Present',
      markedVia: 'QR',
      sessionId,
      location: studentLocation
    });

    await attendanceRecord.save();

    res.status(200).json({
      success: true,
      message: `Attendance marked successfully for ${parsedQRData.className}`,
      student: student.name,
      subject: parsedQRData.subjectCode,
      timestamp: new Date()
    });

  } catch (error) {
    console.error('QR attendance error:', error);
    res.status(500).json({ success: false, error: 'Failed to mark attendance' });
  }
};

// Get QR session stats (for professors)
const getQRSessionStats = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = activeQRSessions.get(sessionId);

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found or expired' 
      });
    }

    // Get student details for all present students
    const presentStudentEmails = Array.from(session.studentsPresent);
    const presentStudents = await studentModel.find({ 
      email: { $in: presentStudentEmails } 
    }).select('name email rollNo');

    const timeRemaining = Math.max(0, session.expiryTime - Date.now());

    res.status(200).json({
      success: true,
      sessionInfo: {
        sessionId,
        subjectCode: session.subjectCode,
        className: session.className,
        classLocation: session.classLocation,
        totalPresent: session.studentsPresent.size,
        timeRemaining: Math.ceil(timeRemaining / 1000), // in seconds
        isExpired: timeRemaining <= 0
      },
      presentStudents
    });

  } catch (error) {
    console.error('QR session stats error:', error);
    res.status(500).json({ success: false, error: 'Failed to get session stats' });
  }
};

// Helper function to verify location
const verifyLocation = (studentLocation, classLocation) => {
  try {
    // Parse locations
    const studentCoords = JSON.parse(studentLocation);
    const classCoords = JSON.parse(classLocation);

    // Calculate distance using Haversine formula
    const distance = calculateDistance(
      studentCoords.latitude,
      studentCoords.longitude,
      classCoords.latitude,
      classCoords.longitude
    );

    // Allow attendance if within 100 meters of classroom
    const MAX_DISTANCE_METERS = 100;
    return distance <= MAX_DISTANCE_METERS;

  } catch (error) {
    console.error('Location verification error:', error);
    return false;
  }
};

// Calculate distance between two coordinates in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
};

module.exports = {
  generateAttendanceQR,
  markAttendanceQR,
  getQRSessionStats
};
