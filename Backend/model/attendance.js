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
    status : {
        required: true,
        type: String,
        enum: ['present', 'absent']
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
}, {timestamps: true})

const attendanceModel = model('Attendance', attendanceSchema);
module.exports = attendanceModel;