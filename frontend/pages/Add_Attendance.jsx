import React, { useState, useEffect } from 'react';
import { X, ChevronRight, AlertCircle, ArrowLeft, Loader2, User, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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

  // Previous form data to track changes
  const [previousFormData, setPreviousFormData] = useState(null);

  // Step 2 attendance data
  const [attendanceData, setAttendanceData] = useState([]);

  // Step 3 confirmation
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle Step 1 form submission
  const handleStep1Submit = () => {
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
    if(end-start > 100){
      alert('Roll number gap must be less than 100');
      return;
    }

    const shouldUpdateAttendance = !previousFormData ||
      previousFormData.initialRoll !== formData.initialRoll ||
      previousFormData.finalRoll !== formData.finalRoll;

    const shouldClearAttendance = !previousFormData ||
      previousFormData.year !== formData.year ||
      previousFormData.branch !== formData.branch ||
      previousFormData.subject !== formData.subject;

    if (shouldClearAttendance) {
      const attendance = [];
      for (let roll = start; roll <= end; roll++) {
        attendance.push({
          rollNumber: roll,
          status: null
        });
      }
      setAttendanceData(attendance);
    } else if (shouldUpdateAttendance) {
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
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { dateString, day } = getCurrentDate();
      const selectedSubject = SUBJECTS.find(s => s.code === formData.subject);

      const records = attendanceData.map(student => ({
        professorName: formData.profName, 
        studentRollNumber: student.rollNumber,
        status: student.status ? "present" : "absent",
        date: dateString,
        day: day,
        subjectName: selectedSubject.name, 
        subjectCode: selectedSubject.code,
        branch: formData.branch,
        year: parseInt(formData.year)
      }));

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/attendance`, records);
      console.log("API Response:", response.data);

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
      toast.success("Attendance submitted successfully!");
      navigate('/phome');

    } catch (error) {
      console.error("Error submitting attendance:", error);
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
        <label className="block text-sm font-medium text-gray-300 mb-2">Professor Name</label>
        <input
          type="text"
          required
          value={formData.profName}
          onChange={(e) => setFormData(prev => ({ ...prev, profName: e.target.value }))}
          className="w-full px-4 py-3 bg-[#1a1a2e]/70 backdrop-blur-sm border border-[#6a7fdb]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb] text-white placeholder-gray-400 transition-all duration-200"
          placeholder="Enter professor name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Year</label>
        <select
          required
          value={formData.year}
          onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
          className="w-full px-4 py-3 bg-[#1a1a2e]/70 backdrop-blur-sm border border-[#6a7fdb]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb] text-white transition-all duration-200"
        >
          <option value="" className="bg-[#0a0a1a]">Select Year</option>
          {YEARS.map(year => (
            <option key={year} value={year} className="bg-[#0a0a1a]">{year} Year</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
        <select
          required
          value={formData.branch}
          onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
          className="w-full px-4 py-3 bg-[#1a1a2e]/70 backdrop-blur-sm border border-[#6a7fdb]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb] text-white transition-all duration-200"
        >
          <option value="" className="bg-[#0a0a1a]">Select Branch</option>
          {BRANCHES.map(branch => (
            <option key={branch} value={branch} className="bg-[#0a0a1a]">{branch}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
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
          className="w-full px-4 py-3 bg-[#1a1a2e]/70 backdrop-blur-sm border border-[#6a7fdb]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb] text-white transition-all duration-200"
        >
          <option value="" className="bg-[#0a0a1a]">Select Subject</option>
          {SUBJECTS.map(subject => (
            <option key={subject.code} value={subject.code} className="bg-[#0a0a1a]">
              {subject.name} ({subject.code})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Initial Roll No.</label>
          <input
            type="number"
            required
            value={formData.initialRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, initialRoll: e.target.value }))}
            className="w-full px-4 py-3 bg-[#1a1a2e]/70 backdrop-blur-sm border border-[#6a7fdb]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb] text-white transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Final Roll No.</label>
          <input
            type="number"
            required
            value={formData.finalRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, finalRoll: e.target.value }))}
            className="w-full px-4 py-3 bg-[#1a1a2e]/70 backdrop-blur-sm border border-[#6a7fdb]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb] text-white transition-all duration-200"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleStep1Submit}
        className="w-full py-3 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fc1] text-white rounded-lg hover:from-[#6a7fdb]/90 hover:to-[#4a5fc1]/90 transition-all duration-300 shadow-lg hover:shadow-[#6a7fdb]/30 font-medium"
      >
        Next Step
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Instructions Card */}
      <div className="bg-[#1a1a2e]/70 backdrop-blur-sm rounded-lg p-4 border border-[#6a7fdb]/30">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-[#6a7fdb] mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-white mb-1">How to mark attendance</h4>
            <p className="text-sm text-gray-300">
              Click on each student's card to toggle between Present and Absent status.
              Unmarked students will be marked as Present by default when submitting.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: true }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-[#6a7fdb]/10 border border-[#6a7fdb]/30 text-[#6a7fdb] rounded-lg hover:bg-[#6a7fdb]/20 transition-all duration-200 text-sm font-medium"
        >
          Mark All Present
        </button>
        <button
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: false }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-[#ff4d4d]/10 border border-[#ff4d4d]/30 text-[#ff4d4d] rounded-lg hover:bg-[#ff4d4d]/20 transition-all duration-200 text-sm font-medium"
        >
          Mark All Absent
        </button>
        <button
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: null }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-gray-500/10 border border-gray-500/30 text-gray-300 rounded-lg hover:bg-gray-500/20 transition-all duration-200 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Class Info Summary */}
      <div className="bg-[#1a1a2e]/70 backdrop-blur-sm rounded-lg p-4 border border-[#6a7fdb]/30">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-[#6a7fdb]" />
            <span className="text-gray-300">Professor:</span>
            <span className="font-medium text-white">{formData.profName}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#6a7fdb]" />
            <span className="text-gray-300">Year & Branch:</span>
            <span className="font-medium text-white">{formData.year} {formData.branch}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#6a7fdb]" />
            <span className="text-gray-300">Subject:</span>
            <span className="font-medium text-white">{SUBJECTS.find(s => s.code === formData.subject)?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#6a7fdb]" />
            <span className="text-gray-300">Date:</span>
            <span className="font-medium text-white">{getCurrentDate().formatted}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {attendanceData.map((student) => (
          <div
            key={student.rollNumber}
            onClick={() => handleAttendanceToggle(student.rollNumber)}
            className={`p-4 rounded-lg border cursor-pointer transition-all transform hover:scale-[1.01] backdrop-blur-sm ${student.status === null
                ? 'bg-[#1a1a2e]/50 border-[#6a7fdb]/20 hover:border-[#6a7fdb]/40'
                : student.status
                  ? 'bg-[#6a7fdb]/10 border-[#6a7fdb]/30 hover:border-[#6a7fdb]/50'
                  : 'bg-[#ff4d4d]/10 border-[#ff4d4d]/30 hover:border-[#ff4d4d]/50'
              }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-white">Roll No: {student.rollNumber}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status === null
                  ? 'bg-[#6a7fdb]/20 text-[#6a7fdb]'
                  : student.status
                    ? 'bg-[#6a7fdb]/20 text-[#60f67b]'
                    : 'bg-[#ff4d4d]/20 text-[#ff4d4d]'
                }`}>
                {student.status === null ? 'Unmarked' : student.status ? 'Present' : 'Absent'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleStep2Submit}
        className="w-full py-3 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fc1] text-white rounded-lg hover:from-[#6a7fdb]/90 hover:to-[#4a5fc1]/90 transition-all duration-300 shadow-lg hover:shadow-[#6a7fdb]/30 font-medium"
      >
        Submit Attendance
      </button>
    </div>
  );

  const renderStep3 = () => {
    const presentCount = attendanceData.filter(s => s.status === true).length;
    const absentCount = attendanceData.length - presentCount;
    const selectedSubject = SUBJECTS.find(s => s.code === formData.subject);

    return (
      <div className="space-y-6">
        {/* Class Details Card */}
        <div className="bg-gradient-to-r from-[#6a7fdb]/10 to-[#4a5fc1]/10 rounded-lg border border-[#6a7fdb]/30 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-[#6a7fdb] mb-4">Class Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-300">Professor</p>
                <p className="font-medium text-white">{formData.profName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-300">Subject</p>
                <p className="font-medium text-white">{selectedSubject?.name} ({selectedSubject?.code})</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-300">Year & Branch</p>
                <p className="font-medium text-white">{formData.year} Year - {formData.branch}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#6a7fdb]" />
              <div>
                <p className="text-sm text-gray-300">Date</p>
                <p className="font-medium text-white">{getCurrentDate().formatted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-[#1a1a2e]/70 backdrop-blur-sm rounded-lg border border-[#6a7fdb]/30 p-4">
            <h4 className="text-sm text-gray-300 mb-1">Total Students</h4>
            <p className="text-2xl font-bold text-[#6a7fdb]">{attendanceData.length}</p>
          </div>
          <div className="bg-[#6a7fdb]/10 backdrop-blur-sm rounded-lg border border-[#60f67b]/30 p-4">
            <h4 className="text-sm text-gray-300 mb-1">Present</h4>
            <p className="text-2xl font-bold text-[#6a7fdb]">{presentCount}</p>
          </div>
          <div className="bg-[#ff4d4d]/10 backdrop-blur-sm rounded-lg border border-[#ff4d4d]/30 p-4">
            <h4 className="text-sm text-gray-300 mb-1">Absent</h4>
            <p className="text-2xl font-bold text-[#ff4d4d]">{absentCount}</p>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="bg-[#1a1a2e]/70 backdrop-blur-sm rounded-lg border border-[#6a7fdb]/30 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Attendance Percentage</span>
            <span className="text-lg font-bold text-[#6a7fdb]">
              {attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-[#0a0a1a] rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-[#6a7fdb] to-[#4a5fc1] h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed Student List */}
        <div className="bg-[#1a1a2e]/70 backdrop-blur-sm rounded-lg border border-[#6a7fdb]/30">
          <div className="p-4 border-b border-[#6a7fdb]/30">
            <h4 className="font-medium text-white">Student Attendance Details</h4>
          </div>
          <div className="divide-y divide-[#6a7fdb]/30 max-h-64 overflow-y-auto">
            {attendanceData.map((student) => (
              <div key={student.rollNumber} className="p-4 flex justify-between items-center hover:bg-[#6a7fdb]/5 transition-colors duration-200">
                <span className="font-medium text-white">Roll No: {student.rollNumber}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${student.status ? 'bg-[#6a7fdb]/20 text-[#6a7fdb]' : 'bg-[#ff4d4d]/20 text-[#ff4d4d]'
                  }`}>
                  {student.status ? 'Present' : 'Absent'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleBack}
            className="flex-1 px-4 py-2 border border-[#6a7fdb]/30 rounded-lg text-[#6a7fdb] hover:bg-[#6a7fdb]/10 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fc1] text-white rounded-lg hover:from-[#6a7fdb]/90 hover:to-[#4a5fc1]/90 disabled:opacity-50 transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Attendance'
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] to-[#1a1a2e] relative overflow-hidden">
      {/* Starry background effect */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: `${Math.random() * 3}px`,
              height: `${Math.random() * 3}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          />
        ))}
      </div>

      {/* Animated gradient background elements */}
      <div className="absolute top-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-[#6a7fdb]/10 blur-3xl animate-[pulse_15s_infinite]" />
      <div className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-[#4a5fc1]/10 blur-3xl animate-[pulse_20s_infinite]" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1a1a2e]/70 backdrop-blur-lg rounded-2xl shadow-xl border border-[#6a7fdb]/20 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {currentStep > 1 && !isSubmitting && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-[#6a7fdb]/10 rounded-full transition-colors duration-200"
                  >
                    <ArrowLeft className="h-5 w-5 text-[#6a7fdb]" />
                  </button>
                )}
                <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#6a7fdb] to-[#4a5fc1]">
                  {currentStep === 1 && "Add Attendance"}
                  {currentStep === 2 && "Mark Attendance"}
                  {currentStep === 3 && "Attendance Summary"}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
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
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1a2e] rounded-2xl shadow-xl max-w-md w-full p-6 border border-[#6a7fdb]/30">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-[#6a7fdb] h-6 w-6" />
              <h3 className="text-lg font-medium text-white">Unmarked Students</h3>
            </div>
            <p className="text-gray-300 mb-6">
              {attendanceData.filter(s => s.status === null).length} students are unmarked.
              They will be marked as present by default. Do you want to proceed?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-[#6a7fdb]/30 rounded-lg text-[#6a7fdb] hover:bg-[#6a7fdb]/10 transition-colors duration-200"
              >
                Go Back
              </button>
              <button
                onClick={() => {
                  const newData = attendanceData.map(student => ({
                    ...student,
                    status: student.status === null ? true : student.status
                  }));
                  setAttendanceData(newData);
                  proceedToStep3();
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fc1] text-white rounded-lg hover:from-[#6a7fdb]/90 hover:to-[#4a5fc1]/90 transition-all duration-200"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}