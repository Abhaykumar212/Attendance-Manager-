const studentAttendance = require('../model/attendance');

const createStudent = async (req, res) => {
    try {
        const newStudent = new studentAttendance(req.body);
        await newStudent.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const getStudents = async (req, res) => {
    try {
        const students = await studentAttendance.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getStudentProfile = async (req, res) => {
    try {
        // console.log(req.userData)
        const studentRoll =  req.userData.rollNo.toString();
        const student = await studentAttendance.findOne({ studentRollNumber: studentRoll });

        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        res.status(200).json({ success: true, user: student });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

module.exports = {
    createStudent,
    getStudents,
    getStudentProfile,
};
