import React, { useMemo, useState } from "react";
import { Search, BookOpen, X, BarChart2, Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { attendanceRecord } from "../dummyData/data.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

// Custom tooltip component for the PieChart
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#2c2c4a] p-4 rounded-xl shadow-lg border border-[#3c3c5a] backdrop-blur-md"
      >
        <p className="text-lg font-bold text-[#6a7fdb]">{data.subject}</p>
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-green-400">Present:</span> {data.presentPercentage}% ({data.presentClasses} classes)
        </p>
        <p className="text-sm text-gray-300">
          <span className="font-semibold text-red-400">Absent:</span> {data.absentPercentage}% ({data.totalClasses - data.presentClasses} classes)
        </p>
      </motion.div>
    );
  }
  return null;
};

const CustomPieLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index, subject }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx;
  const y = cy;

  return (
    <text x={x} y={y} fill="#e0e0e0" textAnchor="middle" dominantBaseline="central">
      <tspan x={x} dy="-0.5em" fontWeight="bold" fontSize="16px" fill="#6a7fdb">{subject}</tspan>
      <tspan x={x} dy="1.5em" fontSize="12px" fill="#a0a0a0">
        {value}%
      </tspan>
    </text>
  );
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [notification, setNotification] = useState("");
  const [notifLoading, setNotifLoading] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const studentData = attendanceRecord[0];

  const handleGetNotification = async () => {
    setNotifLoading(true);
    setNotification("");
    setShowNotifModal(false);
    try {
      const response = await axios.post("http://localhost:3000/api/notifications/personalized", {
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
      doc.setTextColor(106, 127, 219);
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
      doc.setTextColor(106, 127, 219);
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
      doc.setTextColor(106, 127, 219);
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

  const PIE_COLORS = ["#34d399", "#f87171", "#60a5fa", "#facc15", "#c084fc"];

  return (
    <div className="dark bg-[#0a0a1a] min-h-screen text-gray-100 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 relative"
      >
        {/* Enhanced Notification Banner */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="sticky top-4 z-40 mx-auto mb-8 w-full max-w-4xl px-4"
        >
          <div className="relative">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fdb] rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
            
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="relative bg-[#1a1a2e] rounded-xl border border-[#2c2c4a] p-4 shadow-lg overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 2 
                    }}
                    className="bg-gradient-to-br from-[#6a7fdb] to-[#4a5fdb] p-3 rounded-lg"
                  >
                    <Bell className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#6a7fdb]">AI-Powered Insights</h3>
                    <p className="text-sm text-gray-400">Get personalized attendance recommendations</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleGetNotification}
                  disabled={notifLoading}
                  className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                    notifLoading 
                      ? "bg-[#4a5fdb] text-gray-300 cursor-not-allowed" 
                      : "bg-gradient-to-r from-[#6a7fdb] to-[#4a5fdb] text-white shadow-md hover:shadow-[#6a7fdb]/40"
                  }`}
                >
                  {notifLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating...
                    </>
                  ) : (
                    <>
                      <span>Get Insights</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

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
                Welcome, {studentData.studentName}
              </h1>
              <p className="text-gray-400 text-lg">Roll Number: {studentData.studentRollNumber}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="bg-[#1a1a2e] rounded-3xl border border-[#2c2c4a] p-6 mb-8 shadow-2xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-wide text-[#6a7fdb]">Attendance Summary</h2>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-[#2c2c4a] p-2 rounded-full"
            >
              <BarChart2 className="text-[#6a7fdb] h-6 w-6" />
            </motion.div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {attendanceStats.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 300, 
                    damping: 20,
                    delay: index * 0.1 
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#2c2c4a] rounded-2xl border border-[#3c3c5a] p-5 shadow-lg hover:shadow-[#6a7fdb]/30 transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold tracking-wide text-[#6a7fdb] mb-2">{stat.subject}</h3>
                  <p className="text-sm text-gray-400 mb-3">Prof: {stat.professorName}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Present:</span>
                      <span className="font-semibold text-green-400">{stat.presentPercentage}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Absent:</span>
                      <span className="font-semibold text-red-400">{stat.absentPercentage}%</span>
                    </div>
                    <div className="relative h-3 bg-rose-500/20 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.presentPercentage}%` }}
                        transition={{ 
                          duration: 0.7, 
                          type: "tween" 
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)] animate-pulse"
                      />
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {stat.presentClasses} / {stat.totalClasses} classes
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Visual Insights & Download Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="bg-[#1a1a2e] rounded-3xl border border-[#2c2c4a] p-6 mb-8 shadow-2xl flex flex-col lg:flex-row gap-8 items-center"
        >
          <div className="flex-1 w-full flex flex-col ">
            <h2 className="text-2xl font-semibold tracking-wide text-[#6a7fdb] mb-4">Visual Insights</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={attendanceStats}
                  dataKey="presentPercentage"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  cornerRadius={10}
                  fill="#8884d8"
                  labelLine={false}
                >
                  {attendanceStats.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={PIE_COLORS[idx % PIE_COLORS.length]} 
                      stroke="#1a1a2e"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Pie
                  data={attendanceStats}
                  dataKey="absentPercentage"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  innerRadius={115}
                  outerRadius={128}
                  fill="#82ca9d"
                  label={false}
                  paddingAngle={5}
                  cornerRadius={10}
                >
                  {attendanceStats.map((entry, idx) => (
                    <Cell 
                      key={`cell-absent-${idx}`} 
                      fill="#f87171"
                      stroke="#1a1a2e"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-lg font-semibold text-[#6a7fdb]">Download Attendance Report</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadPDF}
              className="px-6 py-3 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fdb] text-white rounded-lg font-semibold shadow-lg hover:shadow-[#6a7fdb]/30 transition-all duration-300"
            >
              📄 Download PDF Report
            </motion.button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
          className="bg-[#1a1a2e] rounded-3xl border border-[#2c2c4a] p-6 shadow-2xl"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold tracking-wide text-[#6a7fdb]">Detailed Attendance</h2>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-full sm:w-64"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search records..."
                className="w-full pl-10 pr-10 py-2.5 bg-[#2c2c4a] border border-[#3c3c5a] text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50 transition-all duration-300"
              />
              {searchTerm && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                >
                  <X 
                    onClick={() => setSearchTerm("")} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer h-5 w-5 hover:text-[#6a7fdb] transition-colors" 
                  />
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#3c3c5a]">
              <thead>
                <tr>
                  {["Subject", "Professor", "Date", "Day", "Status"].map((header) => (
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
                <AnimatePresence>
                  {currentRecords.map((record, index) => (
                    <motion.tr 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 20,
                        delay: index * 0.05 
                      }}
                      className="hover:bg-[#2c2c4a] transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-200">{record.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{record.professorName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{record.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{record.day}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${record.status === "present" ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                          {record.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex justify-center items-center space-x-2 mt-6"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-full bg-[#2c2c4a] text-gray-400 hover:bg-[#3c3c5a] disabled:opacity-50 transition-all"
              >
                Previous
              </motion.button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <motion.button
                  key={page}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-full transition ${currentPage === page ? "bg-[#6a7fdb] text-white" : "bg-[#2c2c4a] text-gray-400 hover:bg-[#3c3c5a]"}`}
                >
                  {page}
                </motion.button>
              ))}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-full bg-[#2c2c4a] text-gray-400 hover:bg-[#3c3c5a] disabled:opacity-50 transition-all"
              >
                Next
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        {/* Animated Modal Popup for Notification */}
        <AnimatePresence>
          {showNotifModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 100 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 100 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="bg-[#1a1a2e] rounded-2xl p-8 border-2 border-[#6a7fdb] shadow-2xl max-w-lg w-full min-h-[300px] max-h-[80vh] overflow-y-auto relative"
              >
                <button
                  onClick={() => setShowNotifModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-[#6a7fdb] text-2xl font-bold"
                  aria-label="Close"
                >
                  &times;
                </button>
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    initial={{ scale: 0.7, rotate: -10 }}
                    animate={{ scale: 1.1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 10 }}
                    className="bg-[#6a7fdb]/20 rounded-full p-4 mb-2 shadow-lg"
                  >
                    <BarChart2 className="text-[#6a7fdb] h-10 w-10 animate-bounce" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-[#6a7fdb] mb-2 text-center">
                    🎉 AI Personalized Insight
                  </h2>
                  <div className="text-gray-200 text-lg text-center min-h-[80px]">
                    {notifLoading ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[#6a7fdb] animate-pulse"
                      >
                        Generating your insight...
                      </motion.div>
                    ) : (
                      <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="whitespace-pre-line"
                      >
                        {notification}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}