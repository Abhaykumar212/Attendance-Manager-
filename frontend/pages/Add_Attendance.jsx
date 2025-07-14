import React, { useState, useEffect } from 'react';
import { X, ChevronRight, AlertCircle, ArrowLeft, Loader2, User, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';


const YEARS = [1, 2, 3, 4];
const BRANCHES = ["CSE", "ECE", "ME", "EE", "CE"];
const SUBJECTS = [
  { code: "M101", name: "Mathematics I" },
  { code: "CS203", name: "Data Structures" },
  { code: "CS205", name: "Database Systems" },
  { code: "EC201", name: "Digital Electronics" },
];

export default function Add_Attendance() {
  // Step tracking
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1 form data
  const [formData, setFormData] = useState({
    year: "",
    branch: "",
    subject: "",
    subjectName: "",
    initialRoll: "",
    finalRoll: "",
    profName: "Dr. Reddy"
  });

  const navigate = useNavigate();

  // Previous form data to track changes
  const [previousFormData, setPreviousFormData] = useState(null);

  // Step 2 attendance data
  const [attendanceData, setAttendanceData] = useState([]);

  // Step 3 confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle Step 1 form submission
  const handleStep1Submit = () => {
    // Basic validation
    if (!formData.profName || !formData.year || !formData.branch || !formData.subject || !formData.initialRoll || !formData.finalRoll) {
      alert('Please fill in all fields');
      return;
    }

    const start = parseInt(formData.initialRoll);
    const end = parseInt(formData.finalRoll);

    if (start > end) {
      alert('Initial roll number cannot be greater than final roll number');
      return;
    }

    // Check if we need to update attendance data based on changes
    const shouldUpdateAttendance = !previousFormData ||
      previousFormData.initialRoll !== formData.initialRoll ||
      previousFormData.finalRoll !== formData.finalRoll;

    const shouldClearAttendance = !previousFormData ||
      previousFormData.year !== formData.year ||
      previousFormData.branch !== formData.branch ||
      previousFormData.subject !== formData.subject;

    if (shouldClearAttendance) {
      // Clear all attendance data for non-roll changes
      const attendance = [];
      for (let roll = start; roll <= end; roll++) {
        attendance.push({
          rollNumber: roll,
          status: null
        });
      }
      setAttendanceData(attendance);
    } else if (shouldUpdateAttendance) {
      // Update attendance data for roll range changes
      const currentRolls = attendanceData.map(s => s.rollNumber);
      const newAttendance = [];

      for (let roll = start; roll <= end; roll++) {
        const existingStudent = attendanceData.find(s => s.rollNumber === roll);
        newAttendance.push({
          rollNumber: roll,
          status: existingStudent ? existingStudent.status : null
        });
      }
      setAttendanceData(newAttendance);
    }

    setPreviousFormData({ ...formData });
    setCurrentStep(2);
  };

  // Handle attendance toggle
  const handleAttendanceToggle = (rollNumber) => {
    const newData = attendanceData.map(student =>
      student.rollNumber === rollNumber
        ? { ...student, status: !student.status }
        : student
    );
    setAttendanceData(newData);
  };

  // Handle Step 2 submission
  const handleStep2Submit = () => {
    const unmarkedCount = attendanceData.filter(student => student.status === null).length;

    if (unmarkedCount > 0) {
      setShowConfirmation(true);
    } else {
      proceedToStep3();
    }
  };

  // Proceed to step 3
  const proceedToStep3 = () => {
    setShowConfirmation(false);
    setCurrentStep(3);
  };

  // Handle final submission
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { dateString, day } = getCurrentDate();
      const selectedSubject = SUBJECTS.find(s => s.code === formData.subject);

      const records = attendanceData.map(student => ({
        professorName: formData.profName,
        studentRollNumber: Number(student.rollNumber ?? student.studentRoll),
        status: student.status ? 'present' : 'absent',
        date: new Date(dateString),
        subjectName: selectedSubject?.name ?? formData.subject,
        subjectCode: selectedSubject?.code ?? formData.subjectCode,
        day,
        branch: formData.branch,
        year: parseInt(formData.year)
      }));

      console.log("Final Attendance Records:", records);

      const backend_url = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backend_url}/attendance`,
        records,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );

      if (response) {
        toast.success(response.data.message || 'Attendance recorded successfully!');
        navigate('/phome');

        // Reset form
        setFormData({
          year: "",
          branch: "",
          subject: "",
          subjectName: "",
          initialRoll: "",
          finalRoll: "",
          profName: "Dr. Reddy"
        });
        setPreviousFormData(null);
        setAttendanceData([]);
        setCurrentStep(1);
      } else {
        toast.error(response.data.message || 'Failed to save attendance');
      }

    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast.error('Something went wrong while saving attendance');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  // Get current date and day
  const getCurrentDate = () => {
    const date = new Date();
    return {
      formatted: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      day: date.toLocaleDateString('en-US', { weekday: 'long' }),
      dateString: date.toISOString().split('T')[0]
    };
  };

  // Render different steps
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Professor Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
          <input
            type="text"
            required
            value={formData.profName}
            onChange={(e) => setFormData(prev => ({ ...prev, profName: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50 transition-all"
            placeholder="Enter professor name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Year</label>
        <select
          required
          value={formData.year}
          onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50"
        >
          <option value="">Select Year</option>
          {YEARS.map(year => (
            <option key={year} value={year}>{year} Year</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Branch</label>
        <select
          required
          value={formData.branch}
          onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
          className="w-full px-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50"
        >
          <option value="">Select Branch</option>
          {BRANCHES.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Subject</label>
        <select
          required
          value={formData.subject}
          onChange={(e) => {
            const selectedSubject = SUBJECTS.find(s => s.code === e.target.value);
            setFormData(prev => ({
              ...prev,
              subject: e.target.value,
              subjectName: selectedSubject?.name || ""
            }));
          }}
          className="w-full px-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50"
        >
          <option value="">Select Subject</option>
          {SUBJECTS.map(subject => (
            <option key={subject.code} value={subject.code}>
              {subject.name} ({subject.code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Initial Roll No.</label>
          <input
            type="number"
            required
            value={formData.initialRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, initialRoll: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Final Roll No.</label>
          <input
            type="number"
            required
            value={formData.finalRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, finalRoll: e.target.value }))}
            className="w-full px-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        type="button"
        onClick={handleStep1Submit}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6a7fdb] text-white rounded-lg hover:bg-[#5a6fdb] transition-colors"
      >
        Next Step
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Instructions Card */}
      <div className="bg-[#2c2c4a] rounded-lg p-4 border border-[#3c3c5a]">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#6a7fdb] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-gray-200 mb-1">How to mark attendance</h4>
            <p className="text-sm text-gray-400">
              Click on each student's card to toggle between Present and Absent status.
              Unmarked students will be marked as Present by default when submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: true }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-green-900/30 text-green-400 rounded-lg hover:bg-green-900/40 transition-colors text-sm font-medium border border-green-900/50"
        >
          Mark All Present
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: false }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/40 transition-colors text-sm font-medium border border-red-900/50"
        >
          Mark All Absent
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: null }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-gray-900/30 text-gray-400 rounded-lg hover:bg-gray-900/40 transition-colors text-sm font-medium border border-gray-900/50"
        >
          Clear All
        </motion.button>
      </div>

      {/* Class Info Summary */}
      <div className="bg-[#2c2c4a] rounded-lg p-4 border border-[#3c3c5a]">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">Professor:</span>
            <span className="font-medium text-gray-200">{formData.profName}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">Year & Branch:</span>
            <span className="font-medium text-gray-200">{formData.year} {formData.branch}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">Subject:</span>
            <span className="font-medium text-gray-200">{SUBJECTS.find(s => s.code === formData.subject)?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-400">Date:</span>
            <span className="font-medium text-gray-200">{getCurrentDate().formatted}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
        {attendanceData.map((student) => (
          <motion.div
            key={student.rollNumber}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAttendanceToggle(student.rollNumber)}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${student.status === null
              ? 'bg-[#2c2c4a] border-[#3c3c5a]'
              : student.status
                ? 'bg-green-900/20 border-green-800/50'
                : 'bg-red-900/20 border-red-800/50'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-200">Roll No: {student.rollNumber}</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${student.status === null
                ? 'bg-[#3c3c5a] text-gray-400'
                : student.status
                  ? 'bg-green-900/30 text-green-400'
                  : 'bg-red-900/30 text-red-400'
                }`}>
                {student.status === null ? 'Unmarked' : student.status ? 'Present' : 'Absent'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleStep2Submit}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6a7fdb] text-white rounded-lg hover:bg-[#5a6fdb] transition-colors"
      >
        Submit Attendance
        <ChevronRight className="h-5 w-5" />
      </motion.button>
    </div>
  );

  const renderStep3 = () => {
    const presentCount = attendanceData.filter(s => s.status === true).length;
    const absentCount = attendanceData.length - presentCount;
    const selectedSubject = SUBJECTS.find(s => s.code === formData.subject);

    return (
      <div className="space-y-6">
        {/* Class Details Card */}
        <div className="bg-gradient-to-r from-[#6a7fdb]/10 to-[#6a7fdb]/20 rounded-lg border border-[#6a7fdb]/30 p-6">
          <h3 className="text-lg font-semibold text-[#6a7fdb] mb-4">Class Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-400">Professor</p>
                <p className="font-medium text-gray-200">{formData.profName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-400">Subject</p>
                <p className="font-medium text-gray-200">{selectedSubject?.name} ({selectedSubject?.code})</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-400">Year & Branch</p>
                <p className="font-medium text-gray-200">{formData.year} Year - {formData.branch}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-400">Date</p>
                <p className="font-medium text-gray-200">{getCurrentDate().formatted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#2c2c4a] rounded-lg border border-[#3c3c5a] p-4">
            <h4 className="text-sm text-gray-400 mb-1">Total Students</h4>
            <p className="text-2xl font-bold text-[#6a7fdb]">{attendanceData.length}</p>
          </div>
          <div className="bg-green-900/20 rounded-lg border border-green-800/50 p-4">
            <h4 className="text-sm text-gray-400 mb-1">Present</h4>
            <p className="text-2xl font-bold text-green-400">{presentCount}</p>
          </div>
          <div className="bg-red-900/20 rounded-lg border border-red-800/50 p-4">
            <h4 className="text-sm text-gray-400 mb-1">Absent</h4>
            <p className="text-2xl font-bold text-red-400">{absentCount}</p>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="bg-[#2c2c4a] rounded-lg border border-[#3c3c5a] p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-400">Attendance Percentage</span>
            <span className="text-lg font-bold text-[#6a7fdb]">
              {attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-[#3c3c5a] rounded-full h-3">
            <div
              className="bg-[#6a7fdb] h-3 rounded-full transition-all duration-500"
              style={{ width: `${attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed Student List */}
        <div className="bg-[#2c2c4a] rounded-lg border border-[#3c3c5a]">
          <div className="p-4 border-b border-[#3c3c5a]">
            <h4 className="font-medium text-gray-200">Student Attendance Details</h4>
          </div>
          <div className="divide-y divide-[#3c3c5a] max-h-64 overflow-y-auto">
            {attendanceData.map((student) => (
              <div key={student.rollNumber} className="p-4 flex justify-between items-center">
                <span className="font-medium text-gray-200">Roll No: {student.rollNumber}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${student.status ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                  {student.status ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBack}
            className="flex-1 px-4 py-2 border border-[#3c3c5a] rounded-lg text-gray-400 hover:bg-[#2c2c4a] flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-[#6a7fdb] text-white rounded-lg hover:bg-[#5a6fdb] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Attendance'
            )}
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="dark bg-[#0a0a1a] min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Starry Background Effect */}
      <div className="absolute inset-0 bg-[#0a0a1a] opacity-80 z-10 pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
            className="absolute w-1 h-1 bg-white/30 rounded-full"
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl bg-[#1a1a2e] rounded-2xl border border-[#2c2c4a] p-8 shadow-2xl relative z-20"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fbb] rounded-t-2xl" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {currentStep > 1 && !isSubmitting && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="p-2 hover:bg-[#2c2c4a] rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-400" />
              </motion.button>
            )}
            <h1 className="text-2xl font-bold text-[#6a7fdb]">
              {currentStep === 1 && "Add Attendance"}
              {currentStep === 2 && "Mark Attendance"}
              {currentStep === 3 && "Attendance Summary"}
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className={currentStep >= 1 ? "text-[#6a7fdb]" : ""}>Details</span>
            <ChevronRight className="h-4 w-4" />
            <span className={currentStep >= 2 ? "text-[#6a7fdb]" : ""}>Attendance</span>
            <ChevronRight className="h-4 w-4" />
            <span className={currentStep >= 3 ? "text-[#6a7fdb]" : ""}>Summary</span>
          </div>
        </div>

        {/* Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </motion.div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1a1a2e] rounded-2xl border border-[#2c2c4a] shadow-xl max-w-md w-full p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-yellow-500 h-6 w-6" />
              <h3 className="text-lg font-medium text-gray-200">Unmarked Students</h3>
            </div>
            <p className="text-gray-400 mb-6">
              {attendanceData.filter(s => s.status === null).length} students are unmarked.
              They will be marked as present by default. Do you want to proceed?
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-[#3c3c5a] rounded-lg text-gray-400 hover:bg-[#2c2c4a]"
              >
                Go Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const newData = attendanceData.map(student => ({
                    ...student,
                    status: student.status === null ? true : student.status
                  }));
                  setAttendanceData(newData);
                  proceedToStep3();
                }}
                className="flex-1 px-4 py-2 bg-[#6a7fdb] text-white rounded-lg hover:bg-[#5a6fdb]"
              >
                Proceed
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}