const studentModel = require('../model/studentModel');
const profModel = require('../model/profModel');
const attendanceModel = require('../model/attendance');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../services/mailservice');
const { getCookieConfig } = require('../config/production');

const sendVerificationOTP = async (req, res, sendResponse = true, email, name, role) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = Date.now() + 10 * 60 * 1000;

    const userModel = role === 'professor' || role === 'admin' ? profModel : studentModel;

    await userModel.findOneAndUpdate(
      { email },
      { verifyOTP: otp, verifyOTPExpireAt: expireAt }
    );

    const verifyMessage = {
      from: `"Attendance Manager Support" <${process.env.EMAIL}>`,
      to: email,
      subject: '🔐 Verify Your Attendance Manager Account',
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>🔒 Email Verification</h2>
          <p>Hi ${name},</p>
          <p>Your OTP is: <strong style="font-size: 22px; color: #800000;">${otp}</strong></p>
          <p>This code is valid for 10 minutes.</p>
          <p>— Attendance Manager Team</p>
        </div>
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

  if (!name || !email || !password || (!email.split('@')[0].match(/^\d+$/) && !rollNo)) {
    return res.status(400).json({ success: false, error: 'All required fields must be filled correctly' });
  }

  const allowedDomains = ['nitkkr.ac.in'];
  const emailDomain = email.split('@')[1];
  if (!allowedDomains.includes(emailDomain)) {
    return res.status(400).json({success: false, error: 'Only NIT Kurukshetra emails are allowed' });
  }

  const isStudent = /^\d+$/.test(email.split('@')[0]);
  const isAdmin = email === '123105080@nitkkr.ac.in';
  
  let role, model;
  
  if (isAdmin) {
    role = 'admin';
    model = profModel; // Admin uses professor model but with admin role
  } else if (isStudent) {
    role = 'student';
    model = studentModel;
  } else {
    role = 'professor';
    model = profModel;
  }

  try {
    const existing = await model.findOne({ email });
    if (existing) return res.status(400).json({message: "User already exists", success: false, error: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = isStudent
      ? { name, email, password: hashedPassword, role, rollNo }
      : { name, email, password: hashedPassword, role };

    const newUser = new model(userData);
    await newUser.save();

    const token = jwt.sign({ email, role }, process.env.JWT_SECRET);
    res.cookie('token', token, getCookieConfig());

    const welcomeMessage = {
      from: `"Attendance Manager Support" <${process.env.EMAIL}>`,
      to: email,
      subject: '📋 Welcome to Attendance Manager!',
      html: `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');
          body {
            font-family: 'Poppins', sans-serif;
            background-color: #f6f9fc;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 30px;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            animation: slideFade 0.5s ease-out;
          }
          @keyframes slideFade {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          h2 {
            color: #004aad;
            margin-bottom: 10px;
          }
          p {
            color: #555;
            font-size: 16px;
            line-height: 1.6;
          }
          .highlight {
            color: #f39c12;
            font-weight: 600;
          }
          .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #004aad;
            color: #fff;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 600;
            transition: background 0.3s ease;
          }
          .btn:hover {
            background: #003580;
          }
          .footer {
            margin-top: 30px;
            font-size: 13px;
            color: #888;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>📋 Welcome to Attendance Manager, ${name}!</h2>
          <p>We’re excited to have you on board. Your Attendance Manager account is ready to help you track attendance, view academic reports, and stay organized.</p>
          <p>Click below to access your dashboard:</p>
          <a href="https://attendance-manager-five-kappa.vercel.app" class="btn">Open Dashboard</a>
          <div class="footer">
            <p>Need help? Contact support anytime.</p>
            <p>— The Attendance Manager Team</p>
          </div>
        </div>
      </body>
    </html>
  `
    };


    transporter.sendMail(welcomeMessage).catch((err) => {
      console.error('Welcome email failed:', err.message);
    });

    await sendVerificationOTP(req, res, false, email, name, role);
    return res.status(202).json({ success: true, message: "Successful registration" });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: 'All fields are required' });

  try {
    const isStudent = /^\d+@/.test(email);
    const model = isStudent ? studentModel : profModel;

    const user = await model.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET);
    res.cookie('token', token, getCookieConfig());

    return res.status(200).json({ message: 'Login successful' });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyemail = async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.status(400).json({ error: 'OTP is required' });

  try {
    // Try to find user by OTP in both student and professor models
    let user = await studentModel.findOne({ verifyOTP: otp });
    if (!user) {
      user = await profModel.findOne({ verifyOTP: otp });
    }

    if (!user) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (user.isAccountVerified) {
      return res.status(400).json({ error: 'Account already verified' });
    }

    if (Date.now() > user.verifyOTPExpireAt) {
      return res.status(400).json({ error: 'OTP expired' });
    }

    user.isAccountVerified = true;
    user.verifyOTP = '';
    user.verifyOTPExpireAt = 0;
    await user.save();

    return res.status(200).json({ message: 'Account verified successfully', success: true });
  } catch (err) {
    console.error('Verification error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = req.userData;
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Remove sensitive information
    const { password, verifyOTP, verifyOTPExpireAt, ...userProfile } = user.toObject();
    
    res.status(200).json({ 
      success: true, 
      user: userProfile 
    });
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', getCookieConfig());
    return res.status(200).json({ message: 'Logout successful', success: true });
  } catch (err) {
    console.error('Logout error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const sendPasswordResetOTP = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required' });
    }

    // Check if user exists in either student or professor model
    const isStudent = /^\d+@/.test(email);
    const model = isStudent ? studentModel : profModel;
    
    const user = await model.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, error: 'No account found with this email address' });
    }

    if (!user.isAccountVerified) {
      return res.status(400).json({ success: false, error: 'Please verify your account first' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expireAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store reset OTP
    await model.findOneAndUpdate(
      { email },
      { 
        resetPasswordOTP: otp, 
        resetPasswordOTPExpireAt: expireAt 
      }
    );

    // Send reset password email
    const resetMessage = {
      from: `"Attendance Manager Support" <${process.env.EMAIL}>`,
      to: email,
      subject: '🔑 Reset Your Password - Attendance Manager',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f9fc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h2 style="color: #004aad; margin-bottom: 20px;">🔑 Password Reset Request</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi ${user.name},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">We received a request to reset your password. Use the OTP below to reset your password:</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <span style="font-size: 28px; font-weight: bold; color: #800000; letter-spacing: 3px;">${otp}</span>
            </div>
            <p style="color: #777; font-size: 14px;">This OTP is valid for 10 minutes only.</p>
            <p style="color: #777; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #888; font-size: 13px;">— Attendance Manager Team</p>
            </div>
          </div>
        </div>
      `
    };

    const sendMailPromise = require('util').promisify(transporter.sendMail.bind(transporter));
    await sendMailPromise(resetMessage);

    res.status(200).json({ 
      success: true, 
      message: 'Password reset OTP sent to your email' 
    });

  } catch (err) {
    console.error('Password reset OTP error:', err);
    res.status(500).json({ success: false, error: 'Failed to send password reset email' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters long' });
    }

    // Find user by email and OTP
    const isStudent = /^\d+@/.test(email);
    const model = isStudent ? studentModel : profModel;
    
    const user = await model.findOne({ 
      email, 
      resetPasswordOTP: otp 
    });

    if (!user) {
      return res.status(400).json({ success: false, error: 'Invalid OTP or email' });
    }

    // Check if OTP is expired
    if (Date.now() > user.resetPasswordOTPExpireAt) {
      return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new one.' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset OTP
    await model.findOneAndUpdate(
      { email },
      {
        password: hashedPassword,
        resetPasswordOTP: '',
        resetPasswordOTPExpireAt: 0
      }
    );

    // Send confirmation email
    const confirmationMessage = {
      from: `"Attendance Manager Support" <${process.env.EMAIL}>`,
      to: email,
      subject: '✅ Password Reset Successful - Attendance Manager',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f9fc;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
            <h2 style="color: #28a745; margin-bottom: 20px;">✅ Password Reset Successful</h2>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Hi ${user.name},</p>
            <p style="color: #555; font-size: 16px; line-height: 1.6;">Your password has been successfully reset. You can now log in with your new password.</p>
            <p style="color: #777; font-size: 14px;">If you didn't make this change, please contact support immediately.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="color: #888; font-size: 13px;">— Attendance Manager Team</p>
            </div>
          </div>
        </div>
      `
    };

    transporter.sendMail(confirmationMessage).catch((err) => {
      console.error('Confirmation email failed:', err.message);
    });

    res.status(200).json({ 
      success: true, 
      message: 'Password reset successful. You can now log in with your new password.' 
    });

  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

const attendanceStoreInDB = async (req, res) => {
  try {
    const records = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({ error: 'Expected an array of attendance records' });
    }

    const saved = await attendanceModel.insertMany(records);
    return res.status(201).json(saved);
  } catch (error) {
    console.error('Error storing attendance:', error);
    res.status(500).json({ error: 'Server error while saving attendance' });
  }
};

const createSubject = async (req, res) => {
  try {
    const { subjectName, subjectCode } = req.body;
    const subject = new subjectModel({ subjectName, subjectCode });
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}



module.exports = {
  register,
  login,
  logout,
  getUserProfile,
  verifyemail,
  sendVerificationOTP,
  sendPasswordResetOTP,
  resetPassword,
  attendanceStoreInDB
};
