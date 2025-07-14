import React, { useState, useEffect } from 'react';
import { X, ChevronRight, AlertCircle, ArrowLeft, Loader2, User, BookOpen, Calendar, GraduationCap, Sparkles } from 'lucide-react';
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
      toast.error('Please fill in all fields');
      return;
    }

    const start = parseInt(formData.initialRoll);
    const end = parseInt(formData.finalRoll);

    if (start > end) {
      toast.error('Initial roll number cannot be greater than final roll number');
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
        <label className="block text-sm font-medium text-[#aaaaaa] mb-2">Professor Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] h-5 w-5" />
          <input
            type="text"
            required
            value={formData.profName}
            onChange={(e) => setFormData(prev => ({ ...prev, profName: e.target.value }))}
            className="w-full pl-10 pr-4 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm border border-white/10 rounded-xl text-[#ffffff] 
              focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300
              hover:border-white/20 hover:bg-[#1e1e1e]/80 placeholder-[#666666]"
            placeholder="Enter professor name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#aaaaaa] mb-2">Year</label>
        <select
          required
          value={formData.year}
          onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
          className="w-full px-4 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm border border-white/10 rounded-xl text-[#ffffff] 
            focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300
            hover:border-white/20 hover:bg-[#1e1e1e]/80"
        >
          <option value="" className="bg-[#1e1e1e] text-[#ffffff]">Select Year</option>
          {YEARS.map(year => (
            <option key={year} value={year} className="bg-[#1e1e1e] text-[#ffffff]">{year} Year</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#aaaaaa] mb-2">Branch</label>
        <select
          required
          value={formData.branch}
          onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
          className="w-full px-4 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm border border-white/10 rounded-xl text-[#ffffff] 
            focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300
            hover:border-white/20 hover:bg-[#1e1e1e]/80"
        >
          <option value="" className="bg-[#1e1e1e] text-[#ffffff]">Select Branch</option>
          {BRANCHES.map(branch => (
            <option key={branch} value={branch} className="bg-[#1e1e1e] text-[#ffffff]">{branch}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#aaaaaa] mb-2">Subject</label>
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
          className="w-full px-4 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm border border-white/10 rounded-xl text-[#ffffff] 
            focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300
            hover:border-white/20 hover:bg-[#1e1e1e]/80"
        >
          <option value="" className="bg-[#1e1e1e] text-[#ffffff]">Select Subject</option>
          {SUBJECTS.map(subject => (
            <option key={subject.code} value={subject.code} className="bg-[#1e1e1e] text-[#ffffff]">
              {subject.name} ({subject.code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#aaaaaa] mb-2">Initial Roll No.</label>
          <input
            type="number"
            required
            value={formData.initialRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, initialRoll: e.target.value }))}
            className="w-full px-4 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm border border-white/10 rounded-xl text-[#ffffff] 
              focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300
              hover:border-white/20 hover:bg-[#1e1e1e]/80 placeholder-[#666666]"
            placeholder="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#aaaaaa] mb-2">Final Roll No.</label>
          <input
            type="number"
            required
            value={formData.finalRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, finalRoll: e.target.value }))}
            className="w-full px-4 py-3 bg-[#1e1e1e]/60 backdrop-blur-sm border border-white/10 rounded-xl text-[#ffffff] 
              focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300
              hover:border-white/20 hover:bg-[#1e1e1e]/80 placeholder-[#666666]"
            placeholder="60"
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="button"
        onClick={handleStep1Submit}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] 
          text-[#0f0f0f] rounded-xl font-semibold text-sm hover:from-[#00e0ff]/90 hover:to-[#1ecbe1]/90 
          hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00e0ff]/25 focus:outline-none focus:ring-2 
          focus:ring-[#00e0ff]/50 transition-all duration-300 group relative overflow-hidden"
      >
        <span className="relative z-10">Next Step</span>
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
      </motion.button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Instructions Card */}
      <div className="bg-[#1e1e1e]/60 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#00e0ff] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-[#ffffff] mb-1">How to mark attendance</h4>
            <p className="text-sm text-[#aaaaaa]">
              Click on each student's card to toggle between Present and Absent status.
              Unmarked students will be marked as Present by default when submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: true }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-[#4ade80]/20 text-[#4ade80] rounded-xl hover:bg-[#4ade80]/30 
            transition-all duration-300 text-sm font-medium border border-[#4ade80]/30 backdrop-blur-sm
            hover:shadow-lg hover:shadow-[#4ade80]/10"
        >
          Mark All Present
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: false }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500/30 
            transition-all duration-300 text-sm font-medium border border-red-500/30 backdrop-blur-sm
            hover:shadow-lg hover:shadow-red-500/10"
        >
          Mark All Absent
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: null }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-[#666666]/20 text-[#aaaaaa] rounded-xl hover:bg-[#666666]/30 
            transition-all duration-300 text-sm font-medium border border-[#666666]/30 backdrop-blur-sm
            hover:shadow-lg hover:shadow-[#666666]/10"
        >
          Clear All
        </motion.button>
      </div>

      {/* Class Info Summary */}
      <div className="bg-[#1e1e1e]/60 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#00e0ff]" />
            <span className="text-[#aaaaaa]">Professor:</span>
            <span className="font-medium text-[#ffffff]">{formData.profName}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#1ecbe1]" />
            <span className="text-[#aaaaaa]">Year & Branch:</span>
            <span className="font-medium text-[#ffffff]">{formData.year} {formData.branch}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#4ade80]" />
            <span className="text-[#aaaaaa]">Subject:</span>
            <span className="font-medium text-[#ffffff]">{SUBJECTS.find(s => s.code === formData.subject)?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#00ffd0]" />
            <span className="text-[#aaaaaa]">Date:</span>
            <span className="font-medium text-[#ffffff]">{getCurrentDate().formatted}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {attendanceData.map((student) => (
          <motion.div
            key={student.rollNumber}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAttendanceToggle(student.rollNumber)}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 backdrop-blur-sm ${
              student.status === null
                ? 'bg-[#1e1e1e]/60 border-white/10 hover:border-white/20'
                : student.status
                ? 'bg-[#4ade80]/20 border-[#4ade80]/30 hover:bg-[#4ade80]/30 hover:shadow-lg hover:shadow-[#4ade80]/10'
                : 'bg-red-500/20 border-red-500/30 hover:bg-red-500/30 hover:shadow-lg hover:shadow-red-500/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-[#ffffff]">Roll No: {student.rollNumber}</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                student.status === null
                  ? 'bg-[#666666]/30 text-[#aaaaaa] border border-[#666666]/30'
                  : student.status
                  ? 'bg-[#4ade80]/30 text-[#4ade80] border border-[#4ade80]/30'
                  : 'bg-red-500/30 text-red-400 border border-red-500/30'
              }`}>
                {student.status === null ? 'Unmarked' : student.status ? 'Present' : 'Absent'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStep2Submit}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] 
          text-[#0f0f0f] rounded-xl font-semibold text-sm hover:from-[#00e0ff]/90 hover:to-[#1ecbe1]/90 
          hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00e0ff]/25 focus:outline-none focus:ring-2 
          focus:ring-[#00e0ff]/50 transition-all duration-300 group relative overflow-hidden"
      >
        <span className="relative z-10">Submit Attendance</span>
        <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
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
        <div className="bg-gradient-to-r from-[#00e0ff]/10 to-[#1ecbe1]/10 rounded-xl border border-[#00e0ff]/30 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-[#00e0ff] mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Class Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#00e0ff]" />
              <div>
                <p className="text-sm text-[#aaaaaa]">Professor</p>
                <p className="font-medium text-[#ffffff]">{formData.profName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#1ecbe1]" />
              <div>
                <p className="text-sm text-[#aaaaaa]">Subject</p>
                <p className="font-medium text-[#ffffff]">{selectedSubject?.name} ({selectedSubject?.code})</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-[#4ade80]" />
              <div>
                <p className="text-sm text-[#aaaaaa]">Year & Branch</p>
                <p className="font-medium text-[#ffffff]">{formData.year} Year - {formData.branch}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#00ffd0]" />
              <div>
                <p className="text-sm text-[#aaaaaa]">Date</p>
                <p className="font-medium text-[#ffffff]">{getCurrentDate().formatted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1e1e1e]/60 backdrop-blur-sm rounded-xl border border-white/10 p-4">
            <h4 className="text-sm text-[#aaaaaa] mb-1">Total Students</h4>
            <p className="text-2xl font-bold text-[#00e0ff]">{attendanceData.length}</p>
          </div>
          <div className="bg-[#4ade80]/20 backdrop-blur-sm rounded-xl border border-[#4ade80]/30 p-4">
            <h4 className="text-sm text-[#aaaaaa] mb-1">Present</h4>
            <p className="text-2xl font-bold text-[#4ade80]">{presentCount}</p>
          </div>
          <div className="bg-red-500/20 backdrop-blur-sm rounded-xl border border-red-500/30 p-4">
            <h4 className="text-sm text-[#aaaaaa] mb-1">Absent</h4>
            <p className="text-2xl font-bold text-red-400">{absentCount}</p>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="bg-[#1e1e1e]/60 backdrop-blur-sm rounded-xl border border-white/10 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-[#aaaaaa]">Attendance Percentage</span>
            <span className="text-lg font-bold text-[#00e0ff]">
              {attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-[#666666]/30 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ 
                width: `${attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0}%` 
              }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] h-3 rounded-full"
            />
          </div>
        </div>

        {/* Detailed Student List */}
        <div className="bg-[#1e1e1e]/60 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h4 className="font-medium text-[#ffffff]">Student Attendance Details</h4>
          </div>
          <div className="divide-y divide-white/10 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {attendanceData.map((student) => (
              <div key={student.rollNumber} className="p-4 flex justify-between items-center hover:bg-white/5 transition-colors">
                <span className="font-medium text-[#ffffff]">Roll No: {student.rollNumber}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm ${
                  student.status 
                    ? 'bg-[#4ade80]/30 text-[#4ade80] border border-[#4ade80]/30' 
                    : 'bg-red-500/30 text-red-400 border border-red-500/30'
                }`}>
                  {student.status ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleBack}
            className="flex-1 px-4 py-3 border border-white/20 rounded-xl text-[#aaaaaa] hover:bg-[#1e1e1e]/60 
              backdrop-blur-sm flex items-center justify-center gap-2 transition-all duration-300 
              hover:border-white/30 hover:text-[#ffffff]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl 
              hover:from-[#00e0ff]/90 hover:to-[#1ecbe1]/90 disabled:opacity-50 flex items-center justify-center gap-2 
              font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-[#00e0ff]/25 
              focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 relative overflow-hidden group"
          >
            {isSubmitting ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="relative z-10"
                >
                  <Loader2 className="h-4 w-4" />
                </motion.div>
                <span className="relative z-10">Submitting...</span>
              </>
            ) : (
              <>
                <span className="relative z-10">Submit Attendance</span>
                <Sparkles className="h-4 w-4 transition-transform group-hover:scale-110 relative z-10" />
              </>
            )}
          </motion.button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Floating orbs animation */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.3, 0],
              scale: [0, 1, 0],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className={`absolute rounded-full blur-xl ${
              i % 4 === 0 ? 'bg-[#00e0ff]/20' : 
              i % 4 === 1 ? 'bg-[#1ecbe1]/20' : 
              i % 4 === 2 ? 'bg-[#4ade80]/20' : 
              'bg-[#00ffd0]/20'
            }`}
            style={{
              width: `${Math.random() * 300 + 150}px`,
              height: `${Math.random() * 300 + 150}px`
            }}
          />
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00e0ff]/5 via-transparent to-[#4ade80]/5 z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-20"
      >
        {/* Main card with glassmorphism */}
        <div className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient border */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00e0ff] via-[#1ecbe1] to-[#4ade80]" />
          
          {/* Floating decoration */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#00e0ff]/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#4ade80]/10 rounded-full blur-xl" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              {currentStep > 1 && !isSubmitting && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleBack}
                  className="p-2 hover:bg-white/10 rounded-full transition-all duration-300 backdrop-blur-sm"
                >
                  <ArrowLeft className="h-5 w-5 text-[#aaaaaa] hover:text-[#ffffff]" />
                </motion.button>
              )}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent">
                {currentStep === 1 && "Add Attendance"}
                {currentStep === 2 && "Mark Attendance"}
                {currentStep === 3 && "Attendance Summary"}
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#999999]">
              <span className={currentStep >= 1 ? "text-[#00e0ff]" : ""}>Details</span>
              <ChevronRight className="h-4 w-4" />
              <span className={currentStep >= 2 ? "text-[#00e0ff]" : ""}>Attendance</span>
              <ChevronRight className="h-4 w-4" />
              <span className={currentStep >= 3 ? "text-[#00e0ff]" : ""}>Summary</span>
            </div>
          </div>

          {/* Content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </motion.div>
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#1e1e1e]/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
          >
            {/* Subtle gradient border */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00e0ff] via-[#1ecbe1] to-[#4ade80]" />
            
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-[#00e0ff] h-6 w-6" />
              <h3 className="text-lg font-medium text-[#ffffff]">Unmarked Students</h3>
            </div>
            <p className="text-[#aaaaaa] mb-6">
              {attendanceData.filter(s => s.status === null).length} students are unmarked.
              They will be marked as present by default. Do you want to proceed?
            </p>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-3 border border-white/20 rounded-xl text-[#aaaaaa] hover:bg-white/10 
                  backdrop-blur-sm transition-all duration-300 hover:border-white/30 hover:text-[#ffffff]"
              >
                Go Back
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const newData = attendanceData.map(student => ({
                    ...student,
                    status: student.status === null ? true : student.status
                  }));
                  setAttendanceData(newData);
                  proceedToStep3();
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl 
                  hover:from-[#00e0ff]/90 hover:to-[#1ecbe1]/90 font-semibold transition-all duration-300 
                  hover:shadow-lg hover:shadow-[#00e0ff]/25"
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