import React, { useMemo, useState } from "react";
import { Search, BookOpen, X, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { attendanceRecord } from "../dummyData/data.js";
import { CSVLink } from "react-csv";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

// Custom label for the PieChart to show subject name and percentage in the center
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

  const studentData = attendanceRecord[0];

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

  const csvData = [
    ["Subject", "Professor", "Date", "Day", "Status"],
    ...filteredRecords.map(r => [
      r.subject, r.professorName, r.date, r.day, r.status
    ])
  ];

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // COLORS for the pie chart segments
  const PIE_COLORS = ["#34d399", "#f87171", "#60a5fa", "#facc15", "#c084fc"];

  return (
    <div className="dark bg-[#0a0a1a] min-h-screen text-gray-100 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8 relative"
      >
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

        {/* Visual Insights & Download Button (IMPROVED) */}
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
                  innerRadius={80} // Make it a donut chart
                  outerRadius={120} // Make it a donut chart
                  paddingAngle={5} // Add padding between slices
                  cornerRadius={10} // Rounded corners for slices
                  fill="#8884d8"
                  labelLine={false}
                >
                  {attendanceStats.map((entry, idx) => (
                    <Cell 
                      key={`cell-${idx}`} 
                      fill={PIE_COLORS[idx % PIE_COLORS.length]} 
                      stroke="#1a1a2e" // Add a stroke to match the background
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                {/* A second Pie to show the absent part for each subject */}
                <Pie
                  data={attendanceStats}
                  dataKey="absentPercentage"
                  nameKey="subject"
                  cx="50%"
                  cy="50%"
                  innerRadius={115} // Outer ring
                  outerRadius={128} // Outer ring
                  fill="#82ca9d"
                  label={false}
                  paddingAngle={5}
                  cornerRadius={10}
                >
                  {attendanceStats.map((entry, idx) => (
                    <Cell 
                      key={`cell-absent-${idx}`} 
                      fill="#f87171" // Use a consistent absent color
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
            <CSVLink
              data={csvData}
              filename={`attendance_report_${studentData.studentRollNumber}.csv`}
              className="px-6 py-2 bg-[#6a7fdb] text-white rounded-lg font-semibold shadow hover:bg-[#4a5fdb] transition"
            >
              Download CSV
            </CSVLink>
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
      </motion.div>
    </div>
  );
}