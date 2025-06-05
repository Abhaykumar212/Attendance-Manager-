const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rollNo: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    verifyOTP: {
        type: String,
    },
    verifyOTPExpireAt: {
        type: Number,
    },
    isAccountVerified: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'student',
    },
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
