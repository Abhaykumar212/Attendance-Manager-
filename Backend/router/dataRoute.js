const express = require('express')
const router = express.Router();
const getUserData = require('../controller/dataController')
const userAuth = require('../middleware/userAuth')

router.get('/data', userAuth, getUserData)

module.exports = router;