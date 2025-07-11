const jwt = require('jsonwebtoken');
const studentModel = require('../model/studentModel');
const profModel = require('../model/profModel');

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No auth-token provided (middleware)' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        if (payload.role === "teacher") {
            const user = await profModel.findOne({ email: payload.email });
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized: User not found (middleware)' });
            }
            req.userData = user;
            next();
        }
        else {
            const user = await studentModel.findOne({ email: payload.email });

            if (!user) {
                return res.status(401).json({ error: 'Unauthorized: User not found (middleware)' });
            }

            req.userData = user;
            next();
        }
    } catch (err) {
        console.log("JWT Authentication Error:", err.message);
        return res.status(401).json({ error: 'Unauthorized: Invalid or Expired Token (middleware)' });
    }
};

module.exports = userAuth;
