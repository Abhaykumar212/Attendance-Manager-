import React, { useState, useMemo, useContext } from "react";
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
  FileText,
  TrendingUp,
  Award,
  Home,
  Settings,
  QrCode
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";

export default function Phome() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentRoll, setStudentRoll] = useState("");
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Admin detection
  const ADMIN_EMAIL = '123105080@nitkkr.ac.in';
  const isAdmin = userData?.email === ADMIN_EMAIL;

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
    <div className="bg-[#0f0f0f] min-h-screen text-gray-100 overflow-hidden relative">
      {/* Floating Orbs Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.4, 0],
              scale: [0, 1, 0],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ]
            }}
            transition={{
              duration: Math.random() * 15 + 12,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut"
            }}
            className={`absolute w-${Math.random() > 0.5 ? '48' : '40'} h-${Math.random() > 0.5 ? '48' : '40'} rounded-full blur-3xl ${
              Math.random() > 0.7 ? 'bg-[#00e0ff]/10' : 
              Math.random() > 0.4 ? 'bg-[#1ecbe1]/10' : 
              'bg-[#4ade80]/10'
            }`}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Welcome Header */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-3xl border border-[#333333]/50 p-8 mb-8 shadow-2xl relative overflow-hidden"
        >
          {/* Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00e0ff] via-[#1ecbe1] to-[#4ade80]" />
          
          {/* Subtle Glow Effects */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00e0ff]/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#1ecbe1]/8 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-20 h-20 bg-gradient-to-br from-[#00e0ff]/20 to-[#1ecbe1]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-[#00e0ff]/30"
              >
                <BookOpen className="text-[#00e0ff] h-10 w-10" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent tracking-tight">
                  Welcome, {professorData?.professorName || "Professor"}
                </h1>
                <p className="text-[#aaaaaa] text-lg">{professorEmail}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(0, 224, 255, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/add-attendance")}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] font-semibold rounded-xl hover:from-[#1ecbe1] hover:to-[#4ade80] transition-all duration-300 shadow-lg hover:shadow-[#00e0ff]/25"
              >
                <UserCheck className="h-5 w-5" />
                <span>Add Attendance</span>
              </motion.button>

              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(138, 43, 226, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/qr-generator")}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#8a2be2] to-[#9932cc] text-[#ffffff] font-semibold rounded-xl hover:from-[#9932cc] hover:to-[#7b68ee] transition-all duration-300 shadow-lg hover:shadow-[#8a2be2]/25"
              >
                <QrCode className="h-5 w-5" />
                <span>QR Attendance</span>
              </motion.button>
              
              <motion.button
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: "rgba(51, 51, 51, 0.8)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowStudentModal(true)}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-[#2a2a2a]/50 backdrop-blur-sm text-[#ffffff] font-semibold rounded-xl border border-[#444444]/50 hover:border-[#00e0ff]/50 transition-all duration-300"
              >
                <ClipboardList className="h-5 w-5" />
                <span>View Students</span>
              </motion.button>

              {/* Admin-only button to access student dashboard */}
              {isAdmin && (
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(74, 222, 128, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/home")}
                  className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#0f0f0f] font-semibold rounded-xl hover:from-[#22c55e] hover:to-[#16a34a] transition-all duration-300 shadow-lg hover:shadow-[#4ade80]/25"
                >
                  <Home className="h-5 w-5" />
                  <span>Student Dashboard</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Class Summary */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-3xl border border-[#333333]/50 p-8 mb-8 shadow-2xl relative overflow-hidden"
        >
          {/* Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#1ecbe1] via-[#4ade80] to-[#00ffd0]" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent tracking-tight">
                Class Summary
              </h2>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-[#1ecbe1]/20 to-[#4ade80]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[#1ecbe1]/30"
              >
                <BarChart2 className="text-[#1ecbe1] h-6 w-6" />
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(0, 224, 255, 0.2)"
                }}
                className="bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#444444]/50 p-6 shadow-lg hover:border-[#00e0ff]/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="text-[#00e0ff] h-8 w-8 group-hover:scale-110 transition-transform" />
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] bg-clip-text text-transparent">
                    {classStats.totalClasses}
                  </span>
                </div>
                <h3 className="text-[#aaaaaa] text-sm font-medium">Total Classes</h3>
              </motion.div>

              {classStats.subjectStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(30, 203, 225, 0.2)"
                  }}
                  className="bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl border border-[#444444]/50 p-6 shadow-lg hover:border-[#1ecbe1]/50 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="text-[#1ecbe1] h-8 w-8 group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-bold bg-gradient-to-r from-[#1ecbe1] to-[#4ade80] bg-clip-text text-transparent">
                      {stat.count}
                    </span>
                  </div>
                  <h3 className="text-[#aaaaaa] text-sm font-medium">{stat.subject} Classes</h3>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Detailed Class Summary */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-3xl border border-[#333333]/50 p-8 shadow-2xl relative overflow-hidden"
        >
          {/* Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#4ade80] via-[#00ffd0] to-[#00e0ff]" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent tracking-tight">
                Detailed Class Summary
              </h2>
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 bg-gradient-to-br from-[#4ade80]/20 to-[#00ffd0]/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-[#4ade80]/30"
              >
                <Users className="text-[#4ade80] h-6 w-6" />
              </motion.div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[#333333]/50">
                    {["Subject", "Date", "Actions"].map((header) => (
                      <th 
                        key={header} 
                        className="px-6 py-4 text-left text-sm font-semibold text-[#aaaaaa] uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#333333]/30">
                  {professorData?.completeClassData.map((cls, index) => (
                    <motion.tr 
                      key={index}
                      whileHover={{ backgroundColor: 'rgba(42, 42, 42, 0.5)' }}
                      className="hover:bg-[#2a2a2a]/50 transition-all duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#ffffff]">
                        {cls.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#aaaaaa]">
                        {cls.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedClass(cls)}
                          className="text-[#00e0ff] hover:text-[#1ecbe1] font-medium transition-colors duration-200"
                        >
                          View Attendance
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-8 max-w-md w-full relative shadow-2xl"
            >
              {/* Gradient Border Top */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00e0ff] via-[#1ecbe1] to-[#4ade80] rounded-t-2xl" />
              
              <button 
                onClick={() => setShowStudentModal(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#2a2a2a]/50 transition-colors"
              >
                <X className="h-6 w-6 text-[#aaaaaa]" />
              </button>
              
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent mb-6">
                Search Student
              </h2>
              
              <form onSubmit={handleStudentSearch} className="space-y-6">
                <div>
                  <label htmlFor="studentRoll" className="block text-[#aaaaaa] mb-2 font-medium">
                    Student Roll Number
                  </label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] h-5 w-5 transition-colors group-focus-within:text-[#00e0ff]" />
                    <input
                      id="studentRoll"
                      type="text"
                      value={studentRoll}
                      onChange={(e) => setStudentRoll(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a]/50 border border-[#444444]/50 rounded-xl text-[#ffffff] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300 backdrop-blur-sm"
                      placeholder="Enter student roll number"
                      required
                    />
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: "0 0 30px rgba(0, 224, 255, 0.3)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] font-semibold rounded-xl hover:from-[#1ecbe1] hover:to-[#4ade80] transition-all duration-300 shadow-lg hover:shadow-[#00e0ff]/25"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-8 max-w-2xl w-full relative shadow-2xl"
            >
              {/* Gradient Border Top */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#1ecbe1] via-[#4ade80] to-[#00ffd0] rounded-t-2xl" />
              
              <button 
                onClick={() => setSelectedClass(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#2a2a2a]/50 transition-colors"
              >
                <X className="h-6 w-6 text-[#aaaaaa]" />
              </button>
              
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent mb-2">
                {selectedClass.subject} - {selectedClass.date}
              </h2>
              <p className="text-[#aaaaaa] mb-6">Attendance Records</p>
              
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="min-w-full">
                  <thead className="sticky top-0 bg-[#2a2a2a]/80 backdrop-blur-sm">
                    <tr className="border-b border-[#333333]/50">
                      {["Roll No.", "Student Name", "Status"].map((header) => (
                        <th 
                          key={header} 
                          className="px-6 py-4 text-left text-sm font-semibold text-[#aaaaaa] uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#333333]/30">
                    {getClassAttendance(selectedClass.date, selectedClass.subject).map((student, index) => (
                      <tr key={index} className="hover:bg-[#2a2a2a]/50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#ffffff]">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#aaaaaa]">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.status === "present" 
                              ? "bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30" 
                              : "bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-8 max-w-2xl w-full relative shadow-2xl"
            >
              {/* Gradient Border Top */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#4ade80] via-[#00ffd0] to-[#00e0ff] rounded-t-2xl" />
              
              <button 
                onClick={() => setSelectedStudent(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#2a2a2a]/50 transition-colors"
              >
                <X className="h-6 w-6 text-[#aaaaaa]" />
              </button>
              
              <div className="flex items-center gap-6 mb-8">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 bg-gradient-to-br from-[#4ade80]/20 to-[#00ffd0]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-[#4ade80]/30"
                >
                  <UserCheck className="text-[#4ade80] h-8 w-8" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent">
                    {selectedStudent.student.studentName}
                  </h2>
                  <p className="text-[#aaaaaa]">Roll No: {selectedStudent.student.studentRollNumber}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent">
                  Attendance Statistics
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedStudent.stats.map((stat, index) => (
                    <motion.div 
                      key={index} 
                      whileHover={{ scale: 1.02 }}
                      className="bg-[#2a2a2a]/50 backdrop-blur-sm rounded-xl p-6 border border-[#444444]/50 hover:border-[#00e0ff]/50 transition-all duration-300"
                    >
                      <h4 className="text-lg font-medium text-[#ffffff] mb-4">{stat.subject}</h4>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[#aaaaaa]">Total Classes:</span>
                          <span className="font-medium text-[#ffffff]">{stat.totalClasses}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#aaaaaa]">Present:</span>
                          <span className="text-[#4ade80] font-medium">
                            {stat.presentClasses} ({stat.presentPercentage}%)
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#aaaaaa]">Absent:</span>
                          <span className="text-[#ef4444] font-medium">
                            {stat.totalClasses - stat.presentClasses} ({stat.absentPercentage}%)
                          </span>
                        </div>
                      </div>
                    </motion.div>
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