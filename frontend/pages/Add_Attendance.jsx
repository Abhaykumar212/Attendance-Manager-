import React, { useState } from 'react';

const Add_Attendance = () => {
  const [formData, setFormData] = useState({
    year: '',
    branch: '',
    subjectName: '',
    subjectCode: '',
    initialRoll: '',
    finalRoll: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let field in formData) {
      if (!formData[field].trim()) {
        alert(`Please fill out the ${field.replace(/([A-Z])/g, ' $1')} field.`);
        return;
      }
    }
    console.log('Attendance submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-white text-red-700 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-8 text-red-800">Add Attendance</h1>
      <form 
        className="w-full max-w-2xl bg-gradient-to-br from-red-50 to-white p-8 rounded-3xl shadow-xl border border-red-200"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <select
            name="year"
            required
            value={formData.year}
            onChange={handleChange}
            className="p-3 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="" disabled>Choose Year*</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
            <option value="4th">4th</option>
          </select>

          <input 
            type="text" 
            name="branch" 
            required
            value={formData.branch} 
            onChange={handleChange}
            placeholder="Branch*" 
            className="p-3 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="text" 
            name="subjectName" 
            required
            value={formData.subjectName} 
            onChange={handleChange}
            placeholder="Subject Name*" 
            className="p-3 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="text" 
            name="subjectCode" 
            required
            value={formData.subjectCode} 
            onChange={handleChange}
            placeholder="Subject Code*" 
            className="p-3 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="text" 
            name="initialRoll" 
            required
            value={formData.initialRoll} 
            onChange={handleChange}
            placeholder="Initial Roll No.*" 
            className="p-3 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <input 
            type="text" 
            name="finalRoll" 
            required
            value={formData.finalRoll} 
            onChange={handleChange}
            placeholder="Final Roll No.*" 
            className="p-3 rounded-xl border border-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-2xl text-lg font-semibold shadow-md transition duration-300"
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default Add_Attendance;
