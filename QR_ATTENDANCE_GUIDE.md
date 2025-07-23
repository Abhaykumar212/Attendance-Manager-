# QR Code-Based Attendance System

## Overview
This feature allows professors to generate time-sensitive QR codes for attendance marking, and students to scan these codes to mark their attendance. The system includes geolocation verification to ensure students are physically present in the classroom.

## Features

### For Professors:
1. **QR Code Generation**: Create unique, time-limited QR codes for each class session
2. **Geolocation Setup**: QR codes are tied to the classroom location
3. **Real-time Monitoring**: View live statistics of students marking attendance
4. **Time Management**: Configurable expiry times (30 seconds to 5 minutes)

### For Students:
1. **QR Code Scanning**: Use camera to scan professor's QR code
2. **Location Verification**: Automatic location check to ensure presence in classroom
3. **Instant Feedback**: Immediate confirmation of attendance marking
4. **Security**: Prevention of duplicate attendance marking for same session

## How to Use

### Professor Workflow:
1. Navigate to **Professor Dashboard** (`/phome`)
2. Click on **"QR Attendance"** button
3. Fill in the required details:
   - Subject Code (e.g., CS301)
   - Class Name (e.g., Database Management Systems)
   - Duration (30 seconds to 5 minutes)
4. Allow location access when prompted
5. Click **"Generate QR Code"**
6. Display the QR code on screen/projector for students to scan
7. Monitor real-time attendance statistics

### Student Workflow:
1. Navigate to **Student Dashboard** (`/home`)
2. Click on **"Scan QR Code"** button
3. Allow camera and location access when prompted
4. Point camera at the QR code displayed by professor
5. Confirm attendance marking
6. Receive instant confirmation

## Technical Implementation

### Backend Endpoints:
- `POST /api/qr-attendance/generate` - Generate QR code (Professor only)
- `POST /api/qr-attendance/mark` - Mark attendance via QR scan (Student only)
- `GET /api/qr-attendance/session/:sessionId` - Get session statistics (Professor only)

### Security Features:
1. **Time-based Expiry**: QR codes automatically expire after set duration
2. **Geolocation Verification**: Students must be within 100 meters of classroom
3. **Session Uniqueness**: Each QR code has a unique session ID
4. **Duplicate Prevention**: Students cannot mark attendance twice for same session
5. **Role-based Access**: Only professors can generate, only students can scan

### Database Schema:
The attendance records include additional fields for QR-based attendance:
- `markedVia`: 'QR' or 'Manual'
- `sessionId`: Unique identifier for QR session
- `location`: Student's location coordinates when marking attendance

## Error Handling:
- **Expired QR Code**: Clear error message when QR code has expired
- **Location Denied**: Informative message about location requirement
- **Invalid QR Code**: Detection and handling of non-attendance QR codes
- **Duplicate Attendance**: Prevention of multiple entries for same session
- **Camera Issues**: Graceful handling of camera permission/access issues

## Browser Requirements:
- **Camera Access**: Required for QR code scanning
- **Location Services**: Required for geofencing
- **Modern Browser**: Chrome 80+, Firefox 75+, Safari 13+

## Configuration:
- **QR Code Expiry**: Configurable from 30 seconds to 5 minutes
- **Geofence Radius**: Currently set to 100 meters (configurable in code)
- **QR Code Size**: 400x400 pixels for optimal scanning

## Usage Tips:
1. **For Professors**:
   - Ensure good lighting when displaying QR code
   - Use projector or large screen for better visibility
   - Keep QR code displayed for the entire duration
   - Monitor the live statistics to track attendance

2. **For Students**:
   - Hold phone steady when scanning
   - Ensure good lighting on QR code
   - Make sure you're within classroom range
   - Allow camera and location permissions when prompted

## Future Enhancements:
- Classroom mapping with predefined locations
- Attendance analytics and reporting
- Integration with academic calendar
- Batch QR generation for multiple sessions
- Student notification system for missed scans
