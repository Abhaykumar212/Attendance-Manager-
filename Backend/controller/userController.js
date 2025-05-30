const studentModel = require('../model/studentModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const transporter = require('../services/mailservice')

const sendVerificationOTP = async (req, res, sendResponse = true, email, name) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const expireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save OTP to the user’s DB record
    await studentModel.findOneAndUpdate(
      { email },
      {
        verifyOTP: otp.toString(),
        verifyOTPExpireAt: expireAt
      }
    );

    const verifyMessage = {
      from: `"Attendance Manager Support" <${process.env.EMAIL}>`,
      to: email,
      subject: '🔐 Verify Your Attendance Manager Account',
      html: `
        <html>
        <body>
          <div style="font-family: Arial; padding: 20px;">
            <h2>🔒 Email Verification</h2>
            <p>Hi ${name},</p>
            <p>Your OTP is: <strong style="font-size: 22px; color: #800000;">${otp}</strong></p>
            <p>This code is valid for 10 minutes.</p>
            <p>— Attendance Manager Team</p>
          </div>
        </body>
        </html>
      `
    };

    const sendMailPromise = require('util').promisify(transporter.sendMail.bind(transporter));
    await sendMailPromise(verifyMessage);

    if (sendResponse) {
      return res.json({ message: "OTP sent to your email", success: true });
    }
  } catch (err) {
    console.error('OTP Send Error:', err);
    if (sendResponse) {
      return res.status(500).json({ error: 'Failed to send verification email' });
    }
  }
};

const register = async (req, res) => {
    const { name, rollNo, email, password } = req.body;
    console.log('req',req.body)

    if (!name || !rollNo || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const allowedDomains = ['nitkkr.ac.in'];
    const emailDomain = email.split('@')[1];
    const emailWithoutDomain = email.split('@')[0];
    const isOnlyNumbers = /^\d+$/.test(emailWithoutDomain);
    if(emailWithoutDomain)
    if (!allowedDomains.includes(emailDomain)) {
        return res.status(400).json({ error: 'Only NIT Kurukshetra emails are allowed' });
    }

    try {
        const existingUser = await studentModel.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        let role;
        if(isOnlyNumbers){
            role = student;
        } else{
            role = teacher;
        }
        const user = new studentModel({ name, rollNo, email, password: hashedPassword , role});
        await user.save();

        console.log('user', user)

        const token = jwt.sign({ email, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000, sameSite: 'lax' });

        const welcomeMessage = {
            from: `"Attendance Manager Support" <${process.env.EMAIL}>`,
            to: email,
            subject: '📋 Welcome to Attendance Manager!',
            html: `
                <html>
                <head>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap');

                        body {
                            font-family: 'Poppins', sans-serif;
                            background: #f4f4f4;
                            color: #333;
                            text-align: center;
                            padding: 40px 0;
                        }

                        .container {
                            max-width: 450px;
                            margin: auto;
                            padding: 25px;
                            border-radius: 15px;
                            background: white;
                            box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
                            animation: fadeIn 1.5s ease-in-out;
                        }

                        @keyframes fadeIn {
                            from { opacity: 0; transform: translateY(-10px); }
                            to { opacity: 1; transform: translateY(0); }
                        }

                        h2 {
                            font-size: 24px;
                            margin-bottom: 15px;
                            color: #28a745;
                            text-shadow: 0px 0px 10px rgba(40, 167, 69, 0.2);
                        }

                        .greeting {
                            font-size: 18px;
                            color: #555;
                            margin-bottom: 15px;
                        }

                        .highlight {
                            color: #ffc107;
                            font-weight: bold;
                        }

                        .footer {
                            font-size: 12px;
                            color: #777;
                            margin-top: 20px;
                        }

                        .btn {
                            display: inline-block;
                            margin-top: 15px;
                            padding: 12px 25px;
                            background: #28a745;
                            color: white;
                            font-weight: bold;
                            border-radius: 8px;
                            text-decoration: none;
                            transition: 0.3s;
                            box-shadow: 0px 0px 10px rgba(40, 167, 69, 0.2);
                        }

                        .btn:hover {
                            background: #218838;
                            transform: scale(1.05);
                            box-shadow: 0px 0px 15px rgba(33, 136, 56, 0.5);
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <h2>📋 Welcome to Attendance Manager, ${name}!</h2>
                        <p class="greeting">We're thrilled to have you onboard. Managing your class attendance just got a whole lot easier!</p>
                        <p>Track attendance, view reports, and stay on top of your academic progress.</p>
                        <a href="${process.env.FRONTEND_URL}" class="btn">Go to Dashboard</a>
                        <div class="footer">
                            <p>Stay organized, stay ahead. 📈</p>
                            <p><strong>The Attendance Manager Team</strong></p>
                            <p>If this wasn't you, feel free to ignore this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        };

        transporter.sendMail(welcomeMessage)
            .then(() => { console.log("Welcome email sent!") })
            .catch((error) => { console.log("Email error:", error) });

        console.log('Registered!');

        await sendVerificationOTP(req, res, false,email,name);

        return res.status(202).json({ message: "Successful registration" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const verifyemail = async (req, res) => {
  const { otp } = req.body;

  if (!otp) return res.status(400).json({ error: 'OTP is required' });

  try {
    // const user = await studentModel.findOne({ email });

    // if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.userData.isAccountVerified) {
      return res.status(400).json({ error: 'Account already verified' });
    }

    if (req.userData.verifyOTP !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (Date.now() > req.userData.verifyOTPExpireAt) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    // Mark as verified
    req.userData.isAccountVerified = true;
    req.userData.verifyOTP = '';
    req.userData.verifyOTPExpireAt = 0;
    await req.userData.save();

    return res.status(200).json({ message: 'Account verified successfully', success: true });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { register, verifyemail, sendVerificationOTP };