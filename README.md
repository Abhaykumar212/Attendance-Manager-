# 📋 Attendance Manager

A comprehensive full-stack attendance management system designed specifically for **NIT Kurukshetra**. This modern web application streamlines attendance tracking with role-based access control, AI-powered insights, and real-time notifications.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)

---

## 🎯 Project Overview

The Attendance Manager is a sophisticated web application that automates and simplifies attendance tracking for educational institutions. Built with a modern tech stack, it features secure authentication, role-based dashboards, AI-powered analytics, and comprehensive reporting capabilities.

**Target Institution**: NIT Kurukshetra (emails must end with `@nitkkr.ac.in`)

---

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Registration & Login** with JWT-based authentication
- **Email Verification** with OTP (10-minute validity)
- **Password Reset** functionality with OTP
- **Role-Based Access Control** (Student, Professor, Admin)
- **Cookie-based session management** with secure HTTP-only cookies
- **Institution-specific access** (NIT Kurukshetra emails only)

### 👨‍🎓 Student Dashboard
- **Comprehensive Attendance Overview** with visual analytics
- **Subject-wise Performance Tracking** with pie charts and area graphs
- **Real-time Attendance Percentage** calculations
- **AI-Powered Insights** using Google Gemini AI for personalized recommendations
- **PDF Report Generation** with detailed attendance records
- **Search & Filter** functionality for attendance records
- **Responsive Design** with modern UI using Framer Motion animations

### 👨‍🏫 Professor Dashboard
- **Add Attendance** for multiple students and subjects
- **Class Management** with subject-wise tracking
- **Student Lookup** by roll number with detailed statistics
- **View Attendance Records** for specific classes and dates
- **Class Summary Statistics** with visual representations

### 👑 Admin Panel
- **Dual Access** to both student and professor dashboards
- **Complete System Overview** with administrative controls
- **User Management** capabilities

### 🤖 AI-Powered Features
- **Smart Notifications** using Google Gemini AI
- **Personalized Attendance Insights** based on student patterns
- **Teacher Notifications** for at-risk students
- **Attendance Pattern Analysis** with consecutive absence tracking
- **Automated Alert System** (critical, warning, pattern-based)

### 📧 Email Notifications
- **Welcome Emails** with styled HTML templates
- **OTP Verification Emails** for account verification
- **Password Reset Emails** with secure OTPs
- **Confirmation Emails** for password changes
- **Professional Email Templates** with modern styling

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js v5.1.0** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose v8.15.1** | ODM for MongoDB |
| **JWT (jsonwebtoken)** | Authentication tokens |
| **bcrypt/bcryptjs** | Password hashing |
| **Nodemailer v7.0.3** | Email service |
| **Google Gemini AI** | AI-powered insights |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variables |
| **cookie-parser** | Cookie handling |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React v19.1.0** | UI library |
| **React Router DOM v7.6.1** | Client-side routing |
| **Vite v6.3.5** | Build tool & dev server |
| **Tailwind CSS v4.1.8** | Utility-first CSS framework |
| **Framer Motion v12.18.1** | Animation library |
| **Recharts v3.0.2** | Data visualization charts |
| **jsPDF & jsPDF-AutoTable** | PDF generation |
| **Axios v1.9.0** | HTTP client |
| **React Hot Toast** | Toast notifications |
| **Lucide React** | Icon library |

---

## 📁 Project Structure

```
Attendance Manager/
├── Backend/
│   ├── config/
│   │   └── production.js          # Production environment config
│   ├── controller/
│   │   ├── attendanceController.js # Attendance CRUD operations
│   │   ├── dataController.js       # Data management
│   │   ├── studentController.js    # Student operations
│   │   ├── subjectController.js    # Subject management
│   │   └── userController.js       # Auth & user management
│   ├── db/
│   │   └── db.js                   # MongoDB connection
│   ├── middleware/
│   │   └── userAuth.js             # JWT authentication middleware
│   ├── model/
│   │   ├── attendance.js           # Attendance schema
│   │   ├── profModel.js            # Professor/Admin schema
│   │   ├── studentModel.js         # Student schema
│   │   └── subjectModel.js         # Subject schema
│   ├── router/
│   │   ├── attendanceRoutes.js     # Attendance endpoints
│   │   ├── dataRoute.js            # Data endpoints
│   │   ├── notifications.js        # AI notification endpoints
│   │   ├── studentRoute.js         # Student endpoints
│   │   ├── subjectRoute.js         # Subject endpoints
│   │   └── userRoutes.js           # Auth endpoints
│   ├── services/
│   │   ├── mailservice.js          # Email configuration
│   │   └── smartNotifications.js   # AI-powered notifications
│   ├── utils/
│   │   └── logger.js               # Logging utility
│   ├── index.js                    # Server entry point
│   ├── package.json
│   └── vercel.json                 # Vercel deployment config
│
├── frontend/
│   ├── components/
│   │   ├── ProtectedRoute.jsx      # Auth-required route wrapper
│   │   ├── PublicRoute.jsx         # Public-only route wrapper
│   │   └── RoleProtectedRoute.jsx  # Role-based route wrapper
│   ├── context/
│   │   └── Appcontext.jsx          # Global state management
│   ├── dummyData/
│   │   └── data.js                 # Sample data for testing
│   ├── pages/
│   │   ├── Add_Attendance.jsx      # Professor attendance entry
│   │   ├── ForgotPassword.jsx      # Password reset request
│   │   ├── Home.jsx                # Student dashboard
│   │   ├── Landing.jsx             # Landing page
│   │   ├── Login.jsx               # Login page
│   │   ├── Phome.jsx               # Professor dashboard
│   │   ├── Register.jsx            # Registration page
│   │   ├── ResetPassword.jsx       # Password reset with OTP
│   │   └── VerifyMail.jsx          # Email verification
│   ├── src/
│   │   ├── utils/
│   │   │   └── debugProduction.js  # Production debugging
│   │   ├── App.jsx                 # Main app component
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # App entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── vercel.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Gmail Account** (for email notifications)
- **Google Gemini API Key** (for AI features)

### Backend Setup

1. **Navigate to Backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the `Backend` directory:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=production

   # Database
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendance_manager

   # JWT Secret
   JWT_SECRET=your_super_secret_jwt_key_here

   # Email Configuration (Gmail)
   EMAIL=your-email@gmail.com
   EMAIL_PASSWORD=your-app-specific-password

   # Google Gemini AI
   GEMINI_API_KEY=your-gemini-api-key

   # Frontend URL (for CORS)
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the backend server**
   ```bash
   node index.js
   ```
   Server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in the `frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:3000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Email Configuration (Gmail)

To enable email notifications:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings → Security
   - Select "2-Step Verification"
   - Scroll to "App passwords"
   - Generate a new app password for "Mail"
3. **Use the generated password** as `EMAIL_PASSWORD` in `.env`

### Google Gemini AI Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it as `GEMINI_API_KEY` in your `.env` file

---

## 📋 Database Schema

### Student Model
```javascript
{
  name: String (required),
  rollNo: Number (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  verifyOTP: String,
  verifyOTPExpireAt: Number,
  resetPasswordOTP: String,
  resetPasswordOTPExpireAt: Number,
  isAccountVerified: Boolean (default: false),
  role: String (default: 'student')
}
```

### Professor Model
```javascript
{
  name: String (required),
  email: String (required),
  password: String (required, hashed),
  verifyOTP: String,
  verifyOTPExpireAt: Number,
  resetPasswordOTP: String,
  resetPasswordOTPExpireAt: Number,
  isAccountVerified: Boolean (default: false),
  role: String (default: 'professor' or 'admin')
}
```

### Attendance Model
```javascript
{
  professorName: String (required),
  studentRollNumber: Number (required),
  studentEmail: String,
  studentName: String,
  status: String (enum: ['present', 'absent', 'Present', 'Absent']),
  date: Date (required),
  subjectName: String (required),
  subjectCode: String (required),
  className: String,
  day: String (required),
  branch: String (required),
  year: Number (required),
  markedVia: String (default: 'Manual'),
  sessionId: String,
  location: String,
  timestamps: true
}
```

### Subject Model
```javascript
{
  subjectName: String (required),
  subjectCode: String (required),
  timestamps: true
}
```

---

## 🔌 API Endpoints

### Authentication Routes (`/`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user (student/professor) | No |
| POST | `/login` | Login user | No |
| POST | `/logout` | Logout user | Yes |
| POST | `/verify-email` | Verify email with OTP | No |
| POST | `/send-verify-otp` | Resend verification OTP | No |
| POST | `/send-reset-otp` | Send password reset OTP | No |
| POST | `/reset-password` | Reset password with OTP | No |
| GET | `/profile` | Get user profile | Yes |

### Student Routes (`/api/students`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/students` | Get all students | Yes (Professor/Admin) |
| GET | `/api/students/:id` | Get student by ID | Yes |
| POST | `/api/students` | Create new student | Yes (Professor/Admin) |

### Subject Routes (`/`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/subjects` | Get all subjects | Yes |
| POST | `/subjects` | Create new subject | Yes (Professor/Admin) |

### Attendance Routes (`/`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/attendance` | Submit attendance records | Yes (Professor/Admin) |
| GET | `/attendance` | Get attendance records | Yes |
| GET | `/attendance/student/:rollNo` | Get student attendance | Yes |

### Notification Routes (`/api/notifications`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/notifications/personalized` | Get AI-powered insights | Yes |

---

## 👥 User Roles & Access

### Student Role
- View personal attendance dashboard
- View subject-wise performance
- Get AI-powered insights
- Download attendance reports (PDF)
- Search and filter attendance records

### Professor Role
- Add attendance for classes
- View class summaries
- Search student attendance by roll number
- View detailed class attendance records
- Manage subjects

### Admin Role
**Special Email**: `123105080@nitkkr.ac.in`
- All student privileges
- All professor privileges
- Access to both dashboards
- System-wide oversight

---

## 🎨 UI Features

### Modern Design Elements
- **Glassmorphism** effects with backdrop blur
- **Gradient Animations** for interactive elements
- **Framer Motion** for smooth transitions
- **Dark Theme** with cyberpunk-inspired colors
- **Responsive Layout** for all screen sizes
- **Loading States** with animated spinners
- **Toast Notifications** for user feedback

### Color Palette
- Primary: `#00e0ff` (Cyan)
- Secondary: `#1ecbe1` (Teal)
- Success: `#4ade80` (Green)
- Error: `#f87171` (Red)
- Background: `#0f0f0f` (Dark)
- Surface: `#1e1e1e` (Dark Gray)

---

## 🤖 AI Features (Google Gemini)

### Personalized Student Notifications
- Analyzes attendance patterns
- Identifies concerning trends
- Provides actionable suggestions
- Generates encouraging messages
- Customized based on attendance percentage

### Teacher Notifications
- Highlights at-risk students
- Summarizes attendance data
- Suggests interventions
- Maintains professional tone

### Pattern Analysis
- Consecutive absence tracking
- Days since last attendance
- Alert type classification (critical, warning, pattern, info)
- Attendance percentage calculations

---

## 📊 Deployment

### Backend (Vercel)
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "index.js"
    }
  ]
}
```

### Frontend (Vercel)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

**Live URLs**:
- Frontend: `https://attendance-manager-five-kappa.vercel.app`
- Backend: (Configure in environment variables)

---

## 🔒 Security Features

- **Password Hashing** with bcrypt (10 rounds)
- **JWT Authentication** with HTTP-only cookies
- **OTP Expiration** (10 minutes)
- **CORS Protection** with whitelist
- **Environment Variables** for sensitive data
- **Input Validation** on all endpoints
- **Role-based Authorization**
- **Secure Cookie Configuration** (sameSite, secure, httpOnly)

---

## 📝 Usage Guide

### For Students

1. **Register**
   - Use your NIT Kurukshetra email (`rollnumber@nitkkr.ac.in`)
   - Enter your roll number, name, and password
   - You'll receive a welcome email

2. **Verify Email**
   - Check your email for the OTP
   - Enter the OTP on the verification page
   - OTP is valid for 10 minutes

3. **Login**
   - Use your email and password
   - Access your personalized dashboard

4. **View Attendance**
   - See overall attendance percentage
   - View subject-wise performance with charts
   - Filter and search attendance records
   - Download PDF reports

5. **Get AI Insights**
   - Click "AI Insights" button
   - Receive personalized recommendations
   - Get attendance improvement suggestions

### For Professors

1. **Register**
   - Use your NIT Kurukshetra faculty email
   - System auto-detects professor role
   - Verify your email with OTP

2. **Add Attendance**
   - Click "Add Attendance" button
   - Select subject, date, and class details
   - Mark students as present/absent
   - Submit attendance records

3. **View Class Summary**
   - See all classes you've conducted
   - View attendance for specific dates
   - Get subject-wise statistics

4. **Search Students**
   - Click "View Students" button
   - Enter student roll number
   - View detailed attendance statistics

### For Admins

1. **Login** with admin email: `123105080@nitkkr.ac.in`
2. **Access Both Dashboards**:
   - Click "Admin Panel" to switch to professor view
   - Click "Student Dashboard" to switch to student view
3. **Full System Access** to all features

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: Cannot receive emails
- **Solution**: Verify Gmail app password is correct, check spam folder

**Issue**: MongoDB connection failed
- **Solution**: Check MONGO_URI, verify network access in MongoDB Atlas

**Issue**: CORS errors
- **Solution**: Ensure FRONTEND_URL in backend .env matches your frontend URL

**Issue**: AI insights not working
- **Solution**: Verify GEMINI_API_KEY is valid and has quota

**Issue**: OTP expired
- **Solution**: Request a new OTP (valid for 10 minutes only)

---

## 📄 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Abhay Kumar**
- Institution: NIT Kurukshetra
- Repository: [Attendance-Manager](https://github.com/Abhaykumar212/Attendance-Manager-)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Contact via email through the system

---

## 🎓 Acknowledgments

- **NIT Kurukshetra** for the institutional framework
- **Google Gemini AI** for AI-powered features
- **React** and **Node.js** communities for excellent documentation
- All contributors and users of this system

---

**Made with ❤️ for NIT Kurukshetra**
