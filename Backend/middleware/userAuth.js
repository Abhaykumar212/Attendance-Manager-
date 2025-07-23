const jwt = require('jsonwebtoken');
const studentModel = require('../model/studentModel');
const profModel = require('../model/profModel');
const { logCookieDebug } = require('../config/production');

const userAuth = async (req, res, next) => {
    try {
        // Debug cookie information in production
        if (process.env.NODE_ENV === 'production') {
            logCookieDebug(req, 'auth-check');
        }
        
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            console.log('No token found - cookies:', Object.keys(req.cookies || {}), 'headers:', req.headers.authorization ? 'present' : 'missing');
            return res.status(401).json({ error: 'Unauthorized: No auth-token provided (middleware)' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token payload:', { email: payload.email, role: payload.role });
        
        if (payload.role === "professor" || payload.role === "admin") {
            const user = await profModel.findOne({ email: payload.email });
            if (!user) {
                console.log('Professor/Admin user not found:', payload.email);
                return res.status(401).json({ error: 'Unauthorized: User not found (middleware)' });
            }
            req.userData = user;
            console.log('✅ Professor/Admin authenticated:', user.email);
            next();
        }
        else {
            const user = await studentModel.findOne({ email: payload.email });

            if (!user) {
                console.log('Student user not found:', payload.email);
                return res.status(401).json({ error: 'Unauthorized: User not found (middleware)' });
            }

            req.userData = user;
            console.log('✅ Student authenticated:', user.email);
            next();
        }
    } catch (err) {
        console.log("JWT Authentication Error:", err.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid or Expired Token (middleware)' });
    }
};

module.exports = userAuth;
