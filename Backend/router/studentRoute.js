const express = require('express');
const router = express.Router();
const { createStudent, getStudents, getStudentProfile } = require('../controller/studentController');
const userAuth = require('../middleware/userAuth');

router.post('/', createStudent);
router.get('/', getStudents);
router.get('/me', userAuth, getStudentProfile);

module.exports = router;