const express = require('express');
const router = express.Router();
const {register, verifyemail, sendVerificationOTP} = require('../controller/userController')
const userAuth = require('../middleware/userAuth');

router.post('/register', register);
router.post('/verifyemail',userAuth, verifyemail);
router.post('/sendotp',userAuth, sendVerificationOTP);

module.exports = router;