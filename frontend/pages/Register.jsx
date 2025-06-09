import React, { useState, useContext } from 'react';
import { Mail, Lock, User, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [isStudent, setIsStudent] = useState(true);
  const navigate = useNavigate();

  const { setIsLoggedIn, getUserData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const userData = {
        name,
        email,
        password,
        role: isStudent ? 'student' : 'professor',
        ...(isStudent && { rollNo })
      };
      
      const { data } = await axios.post(`${backend_url}/register`, userData);
      // console.log(data);
      if (!data.error) {
        setIsLoggedIn(true);
        getUserData();
        toast.success('🎉 Registration successful! Please verify your email.', {
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate('/verifymail');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[448px] bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#800000]/10 rounded-full flex items-center justify-center">
            {isStudent ? (
              <GraduationCap className="text-[#800000] h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
              <BookOpen className="text-[#800000] h-6 w-6 sm:h-7 sm:w-7" />
            )}
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#800000]">Student Registration</h1>
            <p className="text-gray-600 text-sm sm:text-base">NIT Kurukshetra</p>
          </div>
        </div>

        {/* Custom Role Toggle */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 p-1 bg-gray-50 rounded-lg border border-gray-200">
            <button
              type="button"
              onClick={() => setIsStudent(true)}
              className={`flex-1 py-2 px-3 rounded-md transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base
                ${isStudent ? 'bg-[#800000] text-white' : 'text-gray-600 hover:text-[#800000]'}`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => setIsStudent(false)}
              className={`flex-1 py-2 px-3 rounded-md transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base
                ${!isStudent ? 'bg-[#800000] text-white' : 'text-gray-600 hover:text-[#800000]'}`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Professor</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000] h-5 w-5" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 text-gray-900 placeholder-gray-500 transition-all text-sm sm:text-base"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {isStudent && (
            <div>
              <label htmlFor="rollNo" className="block text-sm font-medium text-gray-700 mb-1">
                Roll Number
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000] h-5 w-5" />
                <input
                  id="rollNo"
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 text-gray-900 placeholder-gray-500 transition-all text-sm sm:text-base"
                  placeholder="Enter your roll number"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              College Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000] h-5 w-5" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 text-gray-900 placeholder-gray-500 transition-all text-sm sm:text-base"
                placeholder="Enter your college email"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000] h-5 w-5" />
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 text-gray-900 placeholder-gray-500 transition-all text-sm sm:text-base"
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#800000] text-white rounded-lg font-medium hover:bg-[#800000]/90 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 transition-all flex items-center justify-center space-x-2 group text-sm sm:text-base"
          >
            <span>Create Account</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-[#800000] hover:underline">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
