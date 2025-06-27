import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { attendanceRecord, professorsData } from "../dummyData/data.js";
import { 
  BookOpen, 
  UserCheck, 
  ClipboardList, 
  Search, 
  X, 
  BarChart2, 
  Users,
  Calendar,
  FileText
} from "lucide-react";
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
    <div className="dark bg-[#0a0a1a] min-h-screen text-gray-100 overflow-hidden relative">
      {/* Animated Background Gradient */}
      <motion.div 
        initial={{ backgroundPosition: '0% 50%' }}
        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
        transition={{ 
          duration: 15, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] opacity-50 z-0"
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Header */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-[#1a1a2e] rounded-3xl border border-[#2c2c4a] p-6 mb-8 shadow-2xl"
        >
          <div className="flex items-center gap-6">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 bg-[#4a4e69]/20 rounded-full flex items-center justify-center"
            >
              <BookOpen className="text-[#6a7fdb] h-10 w-10" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold text-[#6a7fdb] tracking-tight">
                Welcome, {professorData?.professorName || "Professor"}
              </h1>
              <p className="text-gray-400 text-lg">{professorEmail}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/add-attendance")}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#6a7fdb] text-white rounded-lg hover:bg-[#5a6fdb] transition-colors"
            >
              <UserCheck className="h-5 w-5" />
              <span>Add Attendance</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStudentModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#2c2c4a] text-gray-200 rounded-lg hover:bg-[#3c3c5a] transition-colors"
            >
              <ClipboardList className="h-5 w-5" />
              <span>Review Attendance</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Class Summary */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="bg-[#1a1a2e] rounded-3xl border border-[#2c2c4a] p-6 mb-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-wide text-[#6a7fdb]">Class Summary</h2>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-[#2c2c4a] p-2 rounded-full"
            >
              <BarChart2 className="text-[#6a7fdb] h-6 w-6" />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-[#2c2c4a] rounded-2xl border border-[#3c3c5a] p-5 shadow-lg hover:shadow-[#6a7fdb]/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-3">
                <Calendar className="text-[#6a7fdb] h-6 w-6" />
                <span className="text-xl font-bold text-[#6a7fdb]">{classStats.totalClasses}</span>
              </div>
              <h3 className="text-gray-400 text-sm">Total Classes</h3>
            </motion.div>
            {classStats.subjectStats.map((stat, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.05 }}
                className="bg-[#2c2c4a] rounded-2xl border border-[#3c3c5a] p-5 shadow-lg hover:shadow-[#6a7fdb]/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <FileText className="text-[#6a7fdb] h-6 w-6" />
                  <span className="text-xl font-bold text-[#6a7fdb]">{stat.count}</span>
                </div>
                <h3 className="text-gray-400 text-sm">{stat.subject} Classes</h3>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Detailed Class Summary */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          className="bg-[#1a1a2e] rounded-3xl border border-[#2c2c4a] p-6 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-wide text-[#6a7fdb]">Detailed Class Summary</h2>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-[#2c2c4a] p-2 rounded-full"
            >
              <Users className="text-[#6a7fdb] h-6 w-6" />
            </motion.div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#3c3c5a]">
              <thead>
                <tr>
                  {["Subject", "Date", "Actions"].map((header) => (
                    <th 
                      key={header} 
                      className="px-6 py-3 bg-[#2c2c4a] text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-[#1a1a2e] divide-y divide-[#3c3c5a]">
                {professorData?.completeClassData.map((cls, index) => (
                  <motion.tr 
                    key={index}
                    whileHover={{ backgroundColor: '#2c2c4a' }}
                    className="hover:bg-[#2c2c4a] transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{cls.subject}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{cls.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedClass(cls)}
                        className="text-[#6a7fdb] hover:text-[#6a7fdb]/70"
                      >
                        View Attendance
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Student Search Modal */}
        {showStudentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a2e] rounded-2xl border border-[#2c2c4a] p-8 max-w-md w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setShowStudentModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#2c2c4a] transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
              
              <h2 className="text-2xl font-bold text-[#6a7fdb] mb-6">Search Student</h2>
              
              <form onSubmit={handleStudentSearch} className="space-y-6">
                <div>
                  <label htmlFor="studentRoll" className="block text-gray-400 mb-2">
                    Student Roll Number
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                    <input
                      id="studentRoll"
                      type="text"
                      value={studentRoll}
                      onChange={(e) => setStudentRoll(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg 
                        focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50 
                        text-gray-200 placeholder-gray-500 transition-all"
                      placeholder="Enter student roll number"
                      required
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-3.5 bg-[#6a7fdb] text-white rounded-lg 
                    font-semibold hover:bg-[#5a6fdb] focus:outline-none 
                    focus:ring-2 focus:ring-[#6a7fdb]/30 transition-all"
                >
                  Search Student
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Class Attendance Modal */}
        {selectedClass && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a2e] rounded-2xl border border-[#2c2c4a] p-8 max-w-2xl w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedClass(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#2c2c4a] transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
              
              <h2 className="text-2xl font-bold text-[#6a7fdb] mb-2">
                {selectedClass.subject} - {selectedClass.date}
              </h2>
              <p className="text-gray-400 mb-6">Attendance Records</p>
              
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full divide-y divide-[#3c3c5a]">
                  <thead className="sticky top-0 bg-[#2c2c4a]">
                    <tr>
                      {["Roll No.", "Student Name", "Status"].map((header) => (
                        <th 
                          key={header} 
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-[#1a1a2e] divide-y divide-[#3c3c5a]">
                    {getClassAttendance(selectedClass.date, selectedClass.subject).map((student, index) => (
                      <tr key={index} className="hover:bg-[#2c2c4a] transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            student.status === "present" 
                              ? "bg-green-900/50 text-green-400" 
                              : "bg-red-900/50 text-red-400"
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Student Attendance Modal */}
        {selectedStudent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a2e] rounded-2xl border border-[#2c2c4a] p-8 max-w-2xl w-full relative shadow-2xl"
            >
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#2c2c4a] transition-colors"
              >
                <X className="h-6 w-6 text-gray-400" />
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-[#4a4e69]/20 rounded-full flex items-center justify-center">
                  <UserCheck className="text-[#6a7fdb] h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-[#6a7fdb]">
                    {selectedStudent.student.studentName}
                  </h2>
                  <p className="text-gray-400">Roll No: {selectedStudent.student.studentRollNumber}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#6a7fdb]">Attendance Statistics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedStudent.stats.map((stat, index) => (
                    <div key={index} className="bg-[#2c2c4a] rounded-xl p-4 border border-[#3c3c5a]">
                      <h4 className="text-lg font-medium text-gray-200 mb-3">{stat.subject}</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Classes:</span>
                          <span className="font-medium">{stat.totalClasses}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Present:</span>
                          <span className="text-green-400 font-medium">
                            {stat.presentClasses} ({stat.presentPercentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Absent:</span>
                          <span className="text-red-400 font-medium">
                            {stat.totalClasses - stat.presentClasses} ({stat.absentPercentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}