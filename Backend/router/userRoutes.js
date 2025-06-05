const express = require('express');
const router = express.Router();
const {register, verifyemail, sendVerificationOTP, login} = require('../controller/userController')
const userAuth = require('../middleware/userAuth');

router.post('/register', register);
router.post('/verifyemail',userAuth, verifyemail);
router.post('/sendotp',userAuth, sendVerificationOTP);
router.post('/login', login);

module.exports = router;