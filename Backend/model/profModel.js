const mongoose = require('mongoose');
const { verify } = require('../services/mailservice');

const ProfSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verifyOTP: {
        type: String,
    },
    verifyOTPExpieredAt: {
        type: Number,
    },
    isAccountVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        required: true,
        default : 'professor'
    },
})

const Prof = mongoose.model('Prof', ProfSchema);

module.exports = Prof;