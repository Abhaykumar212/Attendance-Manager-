const usermodel = require('../model/studentModel')

const getUserData = async (req, res) => {
    try {
        const user = req.userData;
        res.json({
            success: true,
            userData: {
                name: user.name,
                email: user.email,
                rollNo: user.rollNo
            }
        });
    } catch (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getUserData;
