const express = require('express');
const router = express.Router();
const {register, verifyemail, sendVerificationOTP, login, logout, getUserProfile, sendPasswordResetOTP, resetPassword, attendanceStoreInDB} = require('../controller/userController')
const userAuth = require('../middleware/userAuth');

router.post('/register', register);
router.post('/verifyemail', verifyemail);
router.post('/sendotp',userAuth, sendVerificationOTP);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', userAuth, getUserProfile);
router.post('/forgot-password', sendPasswordResetOTP);
router.post('/reset-password', resetPassword);
router.post('/attendancee', attendanceStoreInDB);


module.exports = router;