import React, { useMemo, useState, useContext } from "react";
import { attendanceRecord } from "../dummyData/data.js";
import { AppContext } from "../context/Appcontext";
import { Search, BookOpen } from "lucide-react";

export default function Home() {
  const { userData } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Get current student's data
  const studentData = useMemo(() => {
    return attendanceRecord.find(
      (student) => student.studentRollNumber === 123105087
    );
  }, []);

  // Calculate attendance statistics
  const attendanceStats = useMemo(() => {
    if (!studentData) return [];

    const subjects = [...new Set(studentData.attendanceRecord.map((record) => record.subject))];
    
    return subjects.map((subject) => {
      const subjectRecords = studentData.attendanceRecord.filter((record) => record.subject === subject);
      const totalClasses = subjectRecords.length;
      const presentClasses = subjectRecords.filter((record) => record.status === "present").length;
      const presentPercentage = ((presentClasses / totalClasses) * 100).toFixed(1);
      const absentPercentage = (100 - presentPercentage).toFixed(1);
      
      return {
        subject,
        presentPercentage,
        absentPercentage,
        professorName: subjectRecords[0]?.professorName || "Not Assigned",
      };
    });
  }, [studentData]);

  // Filter by search across subject, day, date, status, and professor
  const filteredRecords = useMemo(() => {
    if (!studentData) return [];
    const searchLower = searchTerm.toLowerCase();

    return studentData.attendanceRecord.filter((record) =>
      record.subject.toLowerCase().includes(searchLower) ||
      record.day.toLowerCase().includes(searchLower) ||
      record.date.includes(searchLower) ||
      record.status.toLowerCase().includes(searchLower) ||
      record.professorName.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, studentData]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-[#800000]">Student Not Found</h1>
          <p className="text-gray-600 mt-2">Please check your credentials and try again.</p>
        </div>
      </div>
    );
  }

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
                Welcome, {studentData.studentName}
              </h1>
              <p className="text-gray-600">Roll Number: {studentData.studentRollNumber}</p>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {attendanceStats.map((stat, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg border border-gray-200 p-4"
              >
                <h3 className="text-lg font-semibold text-[#800000] mb-2">{stat.subject}</h3>
                <p className="text-sm text-gray-600 mb-3">Prof: {stat.professorName}</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Present:</span>
                    <span className="text-sm font-medium text-green-600">
                      {stat.presentPercentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Absent:</span>
                    <span className="text-sm font-medium text-red-600">
                      {stat.absentPercentage}%
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

        {/* Detailed Attendance Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Detailed Attendance</h2>

            {/* Search Only */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Professor
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentRecords.map((record, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.professorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.day}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === page
                      ? "bg-[#800000] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md bg-gray-100 text-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
