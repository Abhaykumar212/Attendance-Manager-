const {model, Schema} = require('mongoose');

const attendanceSchema = new Schema({
    professorName : {
        required: true,
        type: String
    },
    studentRollNumber : {
        required: true,
        type: Number
    },
    studentEmail: {
        type: String
    },
    studentName: {
        type: String
    },
    rollNo: {
        type: Number
    },
    status : {
        required: true,
        type: String,
        enum: ['present', 'absent', 'Present', 'Absent']
    },
    date : {
        required: true,
        type: Date
    },
    subjectName : {
        required: true,
        type: String
    },
    subjectCode : {
        required: true,
        type: String
    },
    className: {
        type: String
    },
    day : {
        required: true,
        type: String
    },
    branch : {
        required: true,
        type: String
    },
    year : {
        required: true,
        type:Number 
    },
    markedVia: {
        type: String,
        enum: ['Manual'],
        default: 'Manual'
    },
    sessionId: {
        type: String
    },
    location: {
        type: String
    }
}, {timestamps: true})

const attendanceModel = model('Attendance', attendanceSchema);
module.exports = attendanceModel;