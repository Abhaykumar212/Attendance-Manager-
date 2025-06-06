const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  subject: String,
  day: String,
  date: Date,
  status: { type: String, enum: ['present', 'absent'] },
  professorName: String,
}, { _id: false });

const studentSchema = new mongoose.Schema({
  studentName: String,
  studentRollNumber: { type: String, unique: true },
  attendanceRecord: [attendanceSchema],
});

module.exports = mongoose.models.AttendanceStudent || mongoose.model('AttendanceStudent', studentSchema, 'studentAttendance');
