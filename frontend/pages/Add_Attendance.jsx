import React, { useState, useEffect } from 'react';
import { X, ChevronRight, AlertCircle, ArrowLeft, Loader2, User, BookOpen, Calendar, GraduationCap } from 'lucide-react';

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
    profName: "Dr. Reddy" // Added professor name
  });

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { dateString, day } = getCurrentDate();
      const selectedSubject = SUBJECTS.find(s => s.code === formData.subject);
      
      const records = attendanceData.map(student => ({
        profName: formData.profName,
        studentRoll: student.rollNumber,
        status: student.status ? "present" : "absent",
        date: dateString,
        day: day,
        subject: selectedSubject.name,
        subjectCode: selectedSubject.code,
        branch: formData.branch,
        year: parseInt(formData.year)
      }));

      console.log("Final Attendance Records:", records);
      // Here you would normally make the API call
      
      // Reset form after successful submission
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Professor Name</label>
        <input
          type="text"
          required
          value={formData.profName}
          onChange={(e) => setFormData(prev => ({ ...prev, profName: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
          placeholder="Enter professor name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
        <select
          required
          value={formData.year}
          onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
        >
          <option value="">Select Year</option>
          {YEARS.map(year => (
            <option key={year} value={year}>{year} Year</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
        <select
          required
          value={formData.branch}
          onChange={(e) => setFormData(prev => ({ ...prev, branch: e.target.value }))}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
        >
          <option value="">Select Branch</option>
          {BRANCHES.map(branch => (
            <option key={branch} value={branch}>{branch}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
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
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Initial Roll No.</label>
          <input
            type="number"
            required
            value={formData.initialRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, initialRoll: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Final Roll No.</label>
          <input
            type="number"
            required
            value={formData.finalRoll}
            onChange={(e) => setFormData(prev => ({ ...prev, finalRoll: e.target.value }))}
            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={handleStep1Submit}
        className="w-full py-2 bg-[#800000] text-white rounded-lg hover:bg-[#800000]/90 transition-colors"
      >
        Next Step
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Instructions Card */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">How to mark attendance</h4>
            <p className="text-sm text-blue-700">
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
          className="flex-1 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
        >
          Mark All Present
        </button>
        <button
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: false }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
        >
          Mark All Absent
        </button>
        <button
          onClick={() => {
            const newData = attendanceData.map(student => ({ ...student, status: null }));
            setAttendanceData(newData);
          }}
          className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Clear All
        </button>
      </div>
      {/* Class Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Professor:</span>
            <span className="font-medium">{formData.profName}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Year & Branch:</span>
            <span className="font-medium">{formData.year} {formData.branch}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Subject:</span>
            <span className="font-medium">{SUBJECTS.find(s => s.code === formData.subject)?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Date:</span>
            <span className="font-medium">{getCurrentDate().formatted}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {attendanceData.map((student) => (
          <div
            key={student.rollNumber}
            onClick={() => handleAttendanceToggle(student.rollNumber)}
            className={`p-4 rounded-lg border cursor-pointer transition-all transform hover:scale-[1.02] ${
              student.status === null
                ? 'bg-gray-50 border-gray-200'
                : student.status
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Roll No: {student.rollNumber}</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                student.status === null
                  ? 'bg-gray-200 text-gray-800'
                  : student.status
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {student.status === null ? 'Unmarked' : student.status ? 'Present' : 'Absent'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleStep2Submit}
        className="w-full py-2 bg-[#800000] text-white rounded-lg hover:bg-[#800000]/90 transition-colors"
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
        <div className="bg-gradient-to-r from-[#800000]/5 to-[#800000]/10 rounded-lg border border-[#800000]/20 p-6">
          <h3 className="text-lg font-semibold text-[#800000] mb-4">Class Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">Professor</p>
                <p className="font-medium text-gray-900">{formData.profName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">Subject</p>
                <p className="font-medium text-gray-900">{selectedSubject?.name} ({selectedSubject?.code})</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">Year & Branch</p>
                <p className="font-medium text-gray-900">{formData.year} Year - {formData.branch}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-[#800000]" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{getCurrentDate().formatted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="text-sm text-gray-600 mb-1">Total Students</h4>
            <p className="text-2xl font-bold text-[#800000]">{attendanceData.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg border border-green-200 p-4">
            <h4 className="text-sm text-gray-600 mb-1">Present</h4>
            <p className="text-2xl font-bold text-green-600">{presentCount}</p>
          </div>
          <div className="bg-red-50 rounded-lg border border-red-200 p-4">
            <h4 className="text-sm text-gray-600 mb-1">Absent</h4>
            <p className="text-2xl font-bold text-red-600">{absentCount}</p>
          </div>
        </div>

        {/* Attendance Percentage */}
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Attendance Percentage</span>
            <span className="text-lg font-bold text-[#800000]">
              {attendanceData.length > 0 ? Math.round((presentCount / attendanceData.length) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-[#800000] h-3 rounded-full transition-all duration-500"
              style={{ width: `${attendanceData.length > 0 ? (presentCount / attendanceData.length) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed Student List */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h4 className="font-medium text-gray-900">Student Attendance Details</h4>
          </div>
          <div className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
            {attendanceData.map((student) => (
              <div key={student.rollNumber} className="p-4 flex justify-between items-center">
                <span className="font-medium">Roll No: {student.rollNumber}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  student.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
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
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <button
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#800000]/90 disabled:opacity-50 flex items-center justify-center gap-2"
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
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {currentStep > 1 && !isSubmitting && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                )}
                <h1 className="text-2xl font-bold text-[#800000]">
                  {currentStep === 1 && "Add Attendance"}
                  {currentStep === 2 && "Mark Attendance"}
                  {currentStep === 3 && "Attendance Summary"}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className={currentStep >= 1 ? "text-[#800000]" : ""}>Details</span>
                <ChevronRight className="h-4 w-4" />
                <span className={currentStep >= 2 ? "text-[#800000]" : ""}>Attendance</span>
                <ChevronRight className="h-4 w-4" />
                <span className={currentStep >= 3 ? "text-[#800000]" : ""}>Summary</span>
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
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-yellow-500 h-6 w-6" />
              <h3 className="text-lg font-medium text-gray-900">Unmarked Students</h3>
            </div>
            <p className="text-gray-600 mb-6">
              {attendanceData.filter(s => s.status === null).length} students are unmarked. 
              They will be marked as present by default. Do you want to proceed?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
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
                className="flex-1 px-4 py-2 bg-[#800000] text-white rounded-lg hover:bg-[#800000]/90"
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