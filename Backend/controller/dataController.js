const getUserData = async (req, res) => {
    try {
        const user = req.userData;
        if(user.role === "professor"){
            return res.json({
                success: true,
                userData: {
                    name: user.name,
                    email: user.email,
                }
            });
        }
        else{
            return res.json({
                success: true,
                userData: {
                    name: user.name,
                    email: user.email,
                    rollNo: user.rollNo
                }
            });
        }
    } catch (err) {
        console.error("Error fetching user data:", err);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = getUserData;
