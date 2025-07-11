const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini AI with your API key
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Generate personalized notification messages
async function generatePersonalizedNotification(studentData, attendancePattern, context, recipientType = 'student') {
  try {
    let prompt;
    
    if (recipientType === 'teacher') {
      prompt = `
      You are an AI assistant helping teachers monitor student attendance. Generate a professional notification for a teacher about a student's attendance pattern.

      Student Details:
      - Name: ${studentData.name}
      - Course: ${context.courseName}
      - Current Attendance: ${attendancePattern.attendancePercentage}%
      - Consecutive Absences: ${attendancePattern.consecutiveAbsences}
      - Total Classes: ${attendancePattern.totalClasses}
      - Classes Attended: ${attendancePattern.classesAttended}
      - Days Since Last Attendance: ${attendancePattern.daysSinceLastAttendance}

      Context:
      - Required Attendance: ${context.requiredAttendance || 75}%
      - Alert Type: ${context.alertType}
      - Academic Period: ${context.academicPeriod}

      Generate a professional notification message that:
      1. Clearly presents the attendance data
      2. Highlights concerning patterns
      3. Suggests possible interventions
      4. Maintains a factual, objective tone
      5. Is concise (max 150 words)

      Return ONLY the message text without any additional formatting.
      `;
    } else {
      // Default student message
      prompt = `
      You are an AI assistant helping with student attendance notifications. Generate a personalized, encouraging message for a student based on their attendance pattern.

      Student Details:
      - Name: ${studentData.name}
      - Course: ${context.courseName}
      - Current Attendance: ${attendancePattern.attendancePercentage}%
      - Consecutive Absences: ${attendancePattern.consecutiveAbsences}
      - Total Classes: ${attendancePattern.totalClasses}
      - Classes Attended: ${attendancePattern.classesAttended}
      - Days Since Last Attendance: ${attendancePattern.daysSinceLastAttendance}

      Context:
      - Required Attendance: ${context.requiredAttendance || 75}%
      - Alert Type: ${context.alertType}
      - Academic Period: ${context.academicPeriod}

      Generate a personalized notification message that:
      1. Is encouraging and supportive (not harsh or negative)
      2. Mentions specific attendance numbers
      3. Provides actionable suggestions
      4. Includes relevant resources or next steps
      5. Keeps a friendly, academic tone
      6. Is concise (max 150 words)

      Return ONLY the message text without any additional formatting.
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error('❌ Error generating notification:', error);
    
    // Fallback messages based on recipient type
    if (recipientType === 'teacher') {
      return `Notification: ${studentData.name} in ${context.courseName} has ${attendancePattern.attendancePercentage}% attendance (${attendancePattern.classesAttended}/${attendancePattern.totalClasses} classes).`;
    } else {
      return `Hi ${studentData.name}, your attendance in ${context.courseName} is ${attendancePattern.attendancePercentage}%. Please catch up on missed classes to maintain good academic standing.`;
    }
  }
}

// Analyze attendance patterns (unchanged)
function analyzeAttendancePattern(studentRecords, currentDate = new Date()) {
  const totalClasses = studentRecords.length;
  const classesAttended = studentRecords.filter(r => r.status.toLowerCase() === 'present').length;
  const attendancePercentage = totalClasses > 0 ? ((classesAttended / totalClasses) * 100).toFixed(1) : 0;

  let consecutiveAbsences = 0;
  const sortedRecords = studentRecords.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  for (const record of sortedRecords) {
    if (record.status.toLowerCase() === 'absent') {
      consecutiveAbsences++;
    } else {
      break;
    }
  }

  const lastAttendance = sortedRecords.find(r => r.status.toLowerCase() === 'present');
  const daysSinceLastAttendance = lastAttendance 
    ? Math.floor((currentDate - new Date(lastAttendance.date)) / (1000 * 60 * 60 * 24))
    : null;

  let alertType = 'info';
  if (attendancePercentage < 50) alertType = 'critical';
  else if (attendancePercentage < 75) alertType = 'warning';
  else if (consecutiveAbsences >= 3) alertType = 'pattern';

  return {
    totalClasses,
    classesAttended,
    attendancePercentage: parseFloat(attendancePercentage),
    consecutiveAbsences,
    daysSinceLastAttendance,
    alertType,
    needsAttention: alertType !== 'info'
  };
}

module.exports = { 
  generatePersonalizedNotification, 
  analyzeAttendancePattern 
};