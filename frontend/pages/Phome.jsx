import React, { useState, useMemo } from "react";
import { attendanceRecord, professorsData } from "../dummyData/data.js";
import { BookOpen, UserCheck, ClipboardList, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Phome() {
  const navigate = useNavigate();
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentRoll, setStudentRoll] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Hardcoded professor email
  const professorEmail = "reddy.professor@nitkkr.ac.in";

  // Get professor data
  const professorData = useMemo(() => {
    return professorsData.find(prof => prof.email === professorEmail);
  }, []);

  // Calculate class statistics
  const classStats = useMemo(() => {
    if (!professorData) return { totalClasses: 0, subjectStats: [] };

    const totalClasses = professorData.completeClassData.length;
    const subjects = [...new Set(professorData.completeClassData.map(cls => cls.subject))];
    
    const subjectStats = subjects.map(subject => ({
      subject,
      count: professorData.completeClassData.filter(cls => cls.subject === subject).length
    }));

    return { totalClasses, subjectStats };
  }, [professorData]);

  // Get attendance data for a specific class
  const getClassAttendance = (date, subject) => {
    return attendanceRecord
      .map(student => ({
        studentName: student.studentName,
        rollNumber: student.studentRollNumber,
        status: student.attendanceRecord.find(
          record => record.date === date && record.subject === subject
        )?.status || "absent"
      }))
      .sort((a, b) => a.rollNumber - b.rollNumber);
  };

  // Calculate student attendance statistics
  const getStudentStats = (studentRollNo) => {
    const student = attendanceRecord.find(s => s.studentRollNumber === parseInt(studentRollNo));
    if (!student) return null;

    const professorSubjects = new Set(professorData.completeClassData.map(cls => cls.subject));
    
    const stats = Array.from(professorSubjects).map(subject => {
      const subjectRecords = student.attendanceRecord.filter(
        record => record.subject === subject && record.professorName === professorData.professorName
      );
      
      const totalClasses = subjectRecords.length;
      const presentClasses = subjectRecords.filter(record => record.status === "present").length;
      const presentPercentage = totalClasses ? ((presentClasses / totalClasses) * 100).toFixed(1) : "0.0";
      const absentPercentage = totalClasses ? (100 - presentPercentage).toFixed(1) : "0.0";

      return {
        subject,
        totalClasses,
        presentClasses,
        presentPercentage,
        absentPercentage
      };
    });

    return {
      student,
      stats: stats.filter(stat => stat.totalClasses > 0)
    };
  };

  // Handle student search
  const handleStudentSearch = (e) => {
    e.preventDefault();
    const studentData = getStudentStats(studentRoll);
    if (studentData) {
      setSelectedStudent(studentData);
    } else {
      alert("Student not found or no attendance records available.");
    }
    setShowStudentModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#800000]/10 rounded-full flex items-center justify-center">
              <BookOpen className="text-[#800000] h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#800000]">
                Welcome, {professorData?.professorName || "Professor"}
              </h1>
              <p className="text-gray-600">{professorEmail}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <button
              onClick={() => navigate("/add-attendance")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#800000] text-white rounded-lg hover:bg-[#800000]/90 transition-colors"
            >
              <UserCheck className="h-5 w-5" />
              <span>Add Attendance</span>
            </button>
            <button
              onClick={() => setShowStudentModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-[#800000] text-[#800000] rounded-lg hover:bg-[#800000]/10 transition-colors"
            >
              <ClipboardList className="h-5 w-5" />
              <span>Review Attendance</span>
            </button>
          </div>
        </div>

        {/* Class Summary */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Class Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-[#800000] mb-2">Total Classes</h3>
              <p className="text-3xl font-bold text-gray-900">{classStats.totalClasses}</p>
            </div>
            {classStats.subjectStats.map((stat, index) => (
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-[#800000] mb-2">{stat.subject}</h3>
                <p className="text-3xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-sm text-gray-600">classes taken</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Class Summary */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Detailed Class Summary</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {professorData?.completeClassData.map((cls, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cls.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cls.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => setSelectedClass(cls)}
                        className="text-[#800000] hover:text-[#800000]/70"
                      >
                        View Attendance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Student Search Modal */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Review Student Attendance</h2>
              <button
                onClick={() => setShowStudentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleStudentSearch}>
              <div className="mb-4">
                <label htmlFor="rollNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Student Roll Number
                </label>
                <input
                  type="text"
                  id="rollNumber"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
                  placeholder="Enter roll number"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#800000] text-white rounded-lg hover:bg-[#800000]/90 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Class Attendance Modal */}
      {selectedClass && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Class Attendance - {selectedClass.subject} ({selectedClass.date})
              </h2>
              <button
                onClick={() => setSelectedClass(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getClassAttendance(selectedClass.date, selectedClass.subject).map((student, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {student.rollNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === "present"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance Summary Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedStudent.student.studentName}
                </h2>
                <p className="text-gray-600">Roll Number: {selectedStudent.student.studentRollNumber}</p>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedStudent.stats.map((stat, index) => (
                <div key={index} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold text-[#800000] mb-2">{stat.subject}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Present:</span>
                      <span className="text-sm font-medium text-green-600">
                        {stat.presentPercentage}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Classes Attended:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {stat.presentClasses}/{stat.totalClasses}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#800000] rounded-full"
                        style={{ width: `${stat.presentPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}