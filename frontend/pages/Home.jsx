import React, { useMemo, useState, useContext } from "react";
import { Search, BookOpen, X, BarChart2, Bell, Download, Zap, TrendingUp, Clock, Users, CheckCircle2, AlertCircle, Settings, QrCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { attendanceRecord } from "../dummyData/data.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import axios from "axios";
import { AppContext } from "../context/Appcontext";
import { useNavigate } from "react-router-dom";

// Custom tooltip component for the PieChart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#1e1e1e]/95 backdrop-blur-xl p-4 rounded-xl shadow-2xl border border-[#2d2d2d]/80"
      >
        <p className="text-lg font-bold text-[#00e0ff]">{data.subject}</p>
        <p className="text-sm text-[#aaaaaa]">
          <span className="font-semibold text-[#4ade80]">Present:</span> {data.presentPercentage}% ({data.presentClasses} classes)
        </p>
        <p className="text-sm text-[#aaaaaa]">
          <span className="font-semibold text-[#f87171]">Absent:</span> {data.absentPercentage}% ({data.totalClasses - data.presentClasses} classes)
        </p>
      </motion.div>
    );
  }
  return null;
};

export default function Home() {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [notification, setNotification] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  // Admin detection
  const ADMIN_EMAIL = '123105080@nitkkr.ac.in';
  const isAdmin = userData?.email === ADMIN_EMAIL;

  const studentData = attendanceRecord[0];
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const handleGetNotification = async () => {
    setNotifLoading(true);
    setNotification("");
    setShowNotifModal(false);
    try {
      const response = await axios.post(`${backend_url}/api/notifications/personalized`, {
        studentData: {
          name: studentData.studentName,
        },
        attendanceRecords: studentData.attendanceRecord,
        context: {
          courseName: "All Subjects",
          requiredAttendance: 75,
          alertType: "info",
          academicPeriod: "Current Semester"
        }
      });
      setNotification(response.data.message);
      setShowNotifModal(true);
    } catch (err) {
      setNotification("Failed to get notification.");
      setShowNotifModal(true);
    }
    setNotifLoading(false);
  };

  const attendanceStats = useMemo(() => {
    if (!studentData?.attendanceRecord) return [];
    const subjectGroups = studentData.attendanceRecord.reduce((acc, record) => {
      if (!acc[record.subject]) {
        acc[record.subject] = {
          totalClasses: 0,
          presentClasses: 0,
          professorName: record.professorName
        };
      }
      acc[record.subject].totalClasses++;
      if (record.status === "present") {
        acc[record.subject].presentClasses++;
      }
      return acc;
    }, {});

    return Object.entries(subjectGroups).map(([subject, data]) => {
      const presentPercentage = data.totalClasses > 0 
        ? ((data.presentClasses / data.totalClasses) * 100).toFixed(1)
        : "0.0";
      const absentPercentage = data.totalClasses > 0 
        ? (((data.totalClasses - data.presentClasses) / data.totalClasses) * 100).toFixed(1)
        : "0.0";

      return {
        subject,
        presentPercentage: Number(presentPercentage),
        absentPercentage: Number(absentPercentage),
        professorName: data.professorName || "Not Assigned",
        totalClasses: data.totalClasses,
        presentClasses: data.presentClasses
      };
    });
  }, [studentData]);

  const filteredRecords = useMemo(() => {
    if (!studentData?.attendanceRecord) return [];
    const searchLower = searchTerm.toLowerCase();

    return studentData.attendanceRecord.filter((record) =>
      record.subject.toLowerCase().includes(searchLower) ||
      record.day.toLowerCase().includes(searchLower) ||
      record.date.includes(searchLower) ||
      record.status.toLowerCase().includes(searchLower) ||
      record.professorName.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, studentData]);

  const handleDownloadPDF = () => {
    try {
      if (typeof jsPDF === 'undefined') {
        throw new Error('jsPDF library not loaded');
      }

      const doc = new jsPDF();
      let yPosition = 20;
      
      doc.setFontSize(20);
      doc.setTextColor(0, 224, 255);
      doc.text("Attendance Report", 14, yPosition);
      yPosition += 15;
      
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`Student Name: ${studentData.studentName}`, 14, yPosition);
      yPosition += 10;
      doc.text(`Roll Number: ${studentData.studentRollNumber}`, 14, yPosition);
      yPosition += 10;
      doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, yPosition);
      yPosition += 20;
      
      doc.setFontSize(16);
      doc.setTextColor(0, 224, 255);
      doc.text("Attendance Summary", 14, yPosition);
      yPosition += 15;
      
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      
      attendanceStats.forEach((stat, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text(`${stat.subject}`, 14, yPosition);
        doc.text(`Prof: ${stat.professorName}`, 70, yPosition);
        doc.text(`${stat.presentClasses}/${stat.totalClasses}`, 130, yPosition);
        doc.text(`${stat.presentPercentage}%`, 170, yPosition);
        yPosition += 8;
      });

      yPosition += 15;
      
      doc.setFontSize(16);
      doc.setTextColor(0, 224, 255);
      doc.text("Detailed Attendance Records", 14, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text("Subject", 14, yPosition);
      doc.text("Professor", 50, yPosition);
      doc.text("Date", 100, yPosition);
      doc.text("Day", 130, yPosition);
      doc.text("Status", 160, yPosition);
      yPosition += 10;

      doc.line(14, yPosition - 2, 190, yPosition - 2);
      yPosition += 5;

      filteredRecords.forEach((record, index) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
          
          doc.setFontSize(10);
          doc.setTextColor(0, 0, 0);
          doc.text("Subject", 14, yPosition);
          doc.text("Professor", 50, yPosition);
          doc.text("Date", 100, yPosition);
          doc.text("Day", 130, yPosition);
          doc.text("Status", 160, yPosition);
          yPosition += 10;
          doc.line(14, yPosition - 2, 190, yPosition - 2);
          yPosition += 5;
        }
        
        doc.text(record.subject, 14, yPosition);
        doc.text(record.professorName, 50, yPosition);
        doc.text(record.date, 100, yPosition);
        doc.text(record.day, 130, yPosition);
        
        if (record.status === 'present') {
          doc.setTextColor(0, 128, 0);
        } else {
          doc.setTextColor(255, 0, 0);
        }
        doc.text(record.status.charAt(0).toUpperCase() + record.status.slice(1), 160, yPosition);
        doc.setTextColor(0, 0, 0);
        
        yPosition += 8;
      });

      doc.save(`attendance_report_${studentData.studentRollNumber}_${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      generateTextReport();
    }
  };

  const generateTextReport = () => {
    try {
      let reportContent = "ATTENDANCE REPORT\n";
      reportContent += "=================\n\n";
      reportContent += `Student Name: ${studentData.studentName}\n`;
      reportContent += `Roll Number: ${studentData.studentRollNumber}\n`;
      reportContent += `Report Generated: ${new Date().toLocaleDateString()}\n\n`;
      
      reportContent += "ATTENDANCE SUMMARY\n";
      reportContent += "------------------\n";
      attendanceStats.forEach(stat => {
        reportContent += `${stat.subject}\n`;
        reportContent += `  Professor: ${stat.professorName}\n`;
        reportContent += `  Present: ${stat.presentClasses}/${stat.totalClasses} (${stat.presentPercentage}%)\n`;
        reportContent += `  Absent: ${stat.totalClasses - stat.presentClasses}/${stat.totalClasses} (${stat.absentPercentage}%)\n\n`;
      });
      
      reportContent += "DETAILED RECORDS\n";
      reportContent += "----------------\n";
      filteredRecords.forEach(record => {
        reportContent += `${record.date} | ${record.day} | ${record.subject} | ${record.professorName} | ${record.status.toUpperCase()}\n`;
      });
      
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `attendance_report_${studentData.studentRollNumber}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert('PDF generation failed. Downloaded as text file instead.');
    } catch (textError) {
      console.error('Error generating text report:', textError);
      alert('Unable to generate report. Please check console for details.');
    }
  };

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const PIE_COLORS = ["#4ade80", "#f87171", "#00e0ff", "#facc15", "#1ecbe1"];

  const overallAttendance = useMemo(() => {
    if (!studentData?.attendanceRecord) return 0;
    const totalClasses = studentData.attendanceRecord.length;
    const presentClasses = studentData.attendanceRecord.filter(record => record.status === 'present').length;
    return totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;
  }, [studentData]);

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#eaeaea] overflow-hidden">
      {/* Floating Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 mx-4 mt-4"
      >
        <div className="bg-[#1e1e1e]/20 backdrop-blur-2xl border border-[#2d2d2d]/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <motion.div 
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#00e0ff] to-[#1ecbe1] rounded-xl flex items-center justify-center shadow-lg shadow-[#00e0ff]/20">
                  <BookOpen className="w-5 h-5 text-[#0f0f0f]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#ffffff] tracking-tight">AttendanceHub</h1>
                  <p className="text-sm text-[#999999]">Student Dashboard</p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Admin-only button to access professor dashboard */}
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate("/phome")}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-[#0f0f0f] rounded-xl font-semibold shadow-lg shadow-[#4ade80]/20 hover:shadow-[#4ade80]/40 transition-all duration-300"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </motion.button>
              )}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGetNotification}
                disabled={notifLoading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold shadow-lg shadow-[#00e0ff]/20 hover:shadow-[#00e0ff]/40 transition-all duration-300 disabled:opacity-50"
              >
                {notifLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Bell className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">AI Insights</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e]/60 backdrop-blur-sm border border-[#2d2d2d] text-[#eaeaea] rounded-xl font-medium hover:bg-[#1e1e1e]/80 hover:border-[#00e0ff]/30 transition-all duration-300"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Report</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="pt-24 px-4 pb-8">
        {/* Hero Section - Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00e0ff]/10 to-[#1ecbe1]/10 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-bold text-[#ffffff] mb-2"
              >
                Welcome back, {studentData.studentName}
              </motion.h2>
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-[#aaaaaa] text-lg mb-6"
              >
                Roll Number: {studentData.studentRollNumber}
              </motion.p>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#4ade80]" />
                  <span className="text-[#999999]">Overall Attendance</span>
                </div>
                <div className="text-3xl font-bold text-[#4ade80]">{overallAttendance}%</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 space-y-4"
          >
            <div className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Users className="w-6 h-6 text-[#00e0ff]" />
                <span className="text-2xl font-bold text-[#ffffff]">{attendanceStats.length}</span>
              </div>
              <p className="text-[#aaaaaa] text-sm">Active Subjects</p>
            </div>
            
            <div className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <Clock className="w-6 h-6 text-[#1ecbe1]" />
                <span className="text-2xl font-bold text-[#ffffff]">{filteredRecords.length}</span>
              </div>
              <p className="text-[#aaaaaa] text-sm">Total Sessions</p>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 30px rgba(138, 43, 226, 0.3)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/qr-scanner")}
              className="flex items-center justify-center gap-4 px-6 py-4 bg-gradient-to-r from-[#8a2be2] to-[#9932cc] text-[#ffffff] font-semibold rounded-xl hover:from-[#9932cc] hover:to-[#7b68ee] transition-all duration-300 shadow-lg hover:shadow-[#8a2be2]/25"
            >
              <QrCode className="h-6 w-6" />
              <div className="text-left">
                <div className="text-lg font-bold">Scan QR Code</div>
                <div className="text-sm opacity-90">Mark attendance instantly</div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ 
                scale: 1.02,
                backgroundColor: "rgba(51, 51, 51, 0.8)"
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNotifModal(true)}
              className="flex items-center justify-center gap-4 px-6 py-4 bg-[#2a2a2a]/50 backdrop-blur-sm text-[#ffffff] font-semibold rounded-xl border border-[#444444]/50 hover:border-[#00e0ff]/50 transition-all duration-300"
            >
              <Bell className="h-6 w-6 text-[#00e0ff]" />
              <div className="text-left">
                <div className="text-lg font-bold">Notifications</div>
                <div className="text-sm text-[#aaaaaa]">AI-powered insights</div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* Subject Cards - Asymmetric Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#ffffff]">Subject Performance</h3>
            <BarChart2 className="w-6 h-6 text-[#00e0ff]" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {attendanceStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-[#1e1e1e]/60 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-2xl p-6 hover:border-[#00e0ff]/30 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${stat.presentPercentage >= 75 ? 'bg-[#4ade80]' : 'bg-[#f87171]'}`}></div>
                    <h4 className="font-semibold text-[#ffffff] group-hover:text-[#00e0ff] transition-colors">{stat.subject}</h4>
                  </div>
                  {stat.presentPercentage >= 75 ? (
                    <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-[#f87171]" />
                  )}
                </div>
                
                <p className="text-sm text-[#aaaaaa] mb-3">Prof: {stat.professorName}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-[#999999]">Attendance</span>
                    <span className={`font-bold ${stat.presentPercentage >= 75 ? 'text-[#4ade80]' : 'text-[#f87171]'}`}>
                      {stat.presentPercentage}%
                    </span>
                  </div>
                  
                  <div className="relative h-2 bg-[#2d2d2d] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.presentPercentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className={`absolute inset-0 rounded-full ${
                        stat.presentPercentage >= 75 
                          ? 'bg-gradient-to-r from-[#4ade80] to-[#00ffd0]' 
                          : 'bg-gradient-to-r from-[#f87171] to-[#ff6b6b]'
                      }`}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-[#aaaaaa]">
                    <span>Present: {stat.presentClasses}</span>
                    <span>Total: {stat.totalClasses}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Analytics Section - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="lg:col-span-2 bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-3xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-[#ffffff]">Attendance Distribution</h3>
              <div className="w-2 h-2 bg-[#00e0ff] rounded-full animate-pulse"></div>
            </div>
            
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceStats}
                  dataKey="presentPercentage"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  cornerRadius={8}
                >
                  {attendanceStats.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={PIE_COLORS[idx % PIE_COLORS.length]} 
                      stroke="#1e1e1e"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    color: '#aaaaaa'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="space-y-4"
          >
            <div className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#4ade80] to-[#00ffd0] rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#0f0f0f]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#ffffff]">Above 75%</h4>
                  <p className="text-sm text-[#aaaaaa]">Good standing</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#4ade80]">
                {attendanceStats.filter(stat => stat.presentPercentage >= 75).length}
              </div>
            </div>

            <div className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#f87171] to-[#ff6b6b] rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-[#0f0f0f]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#ffffff]">Below 75%</h4>
                  <p className="text-sm text-[#aaaaaa]">Needs attention</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#f87171]">
                {attendanceStats.filter(stat => stat.presentPercentage < 75).length}
              </div>
            </div>

            <div className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00e0ff] to-[#1ecbe1] rounded-lg flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-[#0f0f0f]" />
                </div>
                <div>
                  <h4 className="font-semibold text-[#ffffff]">Average</h4>
                  <p className="text-sm text-[#aaaaaa]">Overall performance</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#00e0ff]">
                {attendanceStats.length > 0 ? 
                  (attendanceStats.reduce((sum, stat) => sum + stat.presentPercentage, 0) / attendanceStats.length).toFixed(1) : 0
                }%
              </div>
            </div>
          </motion.div>
        </div>

        {/* Detailed Records */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-3xl p-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-2xl font-bold text-[#ffffff] mb-2">Detailed Records</h3>
              <p className="text-[#aaaaaa]">Complete attendance history</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#999999] w-4 h-4" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search records..."
                  className="w-72 pl-10 pr-10 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm border border-[#2d2d2d] text-[#eaeaea] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#00e0ff] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2d2d2d]/50">
                  {["Subject", "Professor", "Date", "Day", "Status"].map((header) => (
                    <th 
                      key={header} 
                      className="text-left py-4 px-6 font-semibold text-[#aaaaaa] uppercase tracking-wider text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {currentRecords.map((record, index) => (
                    <motion.tr
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="border-b border-[#2d2d2d]/20 hover:bg-[#1e1e1e]/20 transition-all duration-200"
                    >
                      <td className="py-4 px-6 font-medium text-[#ffffff]">{record.subject}</td>
                      <td className="py-4 px-6 text-[#aaaaaa]">{record.professorName}</td>
                      <td className="py-4 px-6 text-[#aaaaaa]">{record.date}</td>
                      <td className="py-4 px-6 text-[#aaaaaa]">{record.day}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "present" 
                            ? "bg-[#4ade80]/20 text-[#4ade80] border border-[#4ade80]/30" 
                            : "bg-[#f87171]/20 text-[#f87171] border border-[#f87171]/30"
                        }`}>
                          {record.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-[#1e1e1e]/60 text-[#aaaaaa] hover:bg-[#1e1e1e]/80 hover:text-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Previous
              </motion.button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentPage === page 
                      ? "bg-[#00e0ff] text-[#0f0f0f] font-semibold shadow-lg shadow-[#00e0ff]/20" 
                      : "bg-[#1e1e1e]/60 text-[#aaaaaa] hover:bg-[#1e1e1e]/80 hover:text-[#ffffff]"
                  }`}
                >
                  {page}
                </motion.button>
              ))}
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-[#1e1e1e]/60 text-[#aaaaaa] hover:bg-[#1e1e1e]/80 hover:text-[#ffffff] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Next
              </motion.button>
            </div>
          )}
        </motion.div>
      </div>

      {/* AI Insights Modal */}
      <AnimatePresence>
        {showNotifModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#0f0f0f]/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#1e1e1e]/95 backdrop-blur-2xl border border-[#2d2d2d]/80 rounded-3xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto relative shadow-2xl"
            >
              <button
                onClick={() => setShowNotifModal(false)}
                className="absolute top-4 right-4 text-[#aaaaaa] hover:text-[#00e0ff] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-16 h-16 bg-gradient-to-br from-[#00e0ff] to-[#1ecbe1] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#00e0ff]/20"
                >
                  <Zap className="w-8 h-8 text-[#0f0f0f]" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-[#ffffff] mb-4">AI Insights</h3>
                
                <div className="bg-[#1e1e1e]/40 backdrop-blur-sm border border-[#2d2d2d]/50 rounded-2xl p-6">
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[#eaeaea] whitespace-pre-line leading-relaxed"
                  >
                    {notification}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}