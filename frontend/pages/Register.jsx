import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Register() {
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
      console.log(data);
      if (data.success) {
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
      else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
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
        className="w-full max-w-md bg-[#1a1a2e] rounded-2xl border border-[#2c2c4a] p-8 shadow-2xl relative z-20"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6a7fdb] to-[#4a5fbb] rounded-t-2xl" />
        
        <div className="flex items-center justify-center gap-4 mb-8">
          <motion.div 
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-16 h-16 bg-[#6a7fdb]/10 rounded-full flex items-center justify-center"
          >
            {isStudent ? (
              <GraduationCap className="text-[#6a7fdb] h-8 w-8" />
            ) : (
              <BookOpen className="text-[#6a7fdb] h-8 w-8" />
            )}
          </motion.div>
          <div className="text-left">
            <h1 className="text-3xl font-bold text-[#6a7fdb] tracking-tight">
              {isStudent ? 'Student' : 'Professor'} Registration
            </h1>
            <p className="text-gray-400">NIT Kurukshetra</p>
          </div>
        </div>

        {/* Role Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-2 bg-[#2c2c4a] rounded-full p-1 border border-[#3c3c5a]">
            <button
              type="button"
              onClick={() => setIsStudent(true)}
              className={`flex-1 py-2.5 px-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 
                ${isStudent 
                  ? 'bg-[#6a7fdb] text-white shadow-lg shadow-[#6a7fdb]/30' 
                  : 'text-gray-400 hover:bg-[#3c3c5a]'}`}
            >
              <GraduationCap className="h-5 w-5" />
              <span className="font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setIsStudent(false)}
              className={`flex-1 py-2.5 px-4 rounded-full transition-all duration-300 flex items-center justify-center space-x-2 
                ${!isStudent 
                  ? 'bg-[#6a7fdb] text-white shadow-lg shadow-[#6a7fdb]/30' 
                  : 'text-gray-400 hover:bg-[#3c3c5a]'}`}
            >
              <BookOpen className="h-5 w-5" />
              <span className="font-medium">Professor</span>
            </button>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {['name', 'rollNo', 'email', 'password'].map((field) => {
            if (field === 'rollNo' && !isStudent) return null;
            
            const fieldConfig = {
              name: {
                label: 'Full Name',
                icon: User,
                type: 'text',
                placeholder: 'Enter your full name',
                value: name,
                onChange: setName
              },
              rollNo: {
                label: 'Roll Number',
                icon: BookOpen,
                type: 'text',
                placeholder: 'Enter your roll number',
                value: rollNo,
                onChange: setRollNo
              },
              email: {
                label: 'College Email',
                icon: Mail,
                type: 'email',
                placeholder: 'Enter your college email',
                value: email,
                onChange: setEmail
              },
              password: {
                label: 'Password',
                icon: Lock,
                type: 'password',
                placeholder: 'Create a strong password',
                value: password,
                onChange: setPassword
              }
            }[field];

            return (
              <motion.div 
                key={field}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: field === 'name' ? 0.3 : 0.4 }}
              >
                <label htmlFor={field} className="block text-gray-400 mb-2">
                  {fieldConfig.label}
                </label>
                <div className="relative">
                  <fieldConfig.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <input
                    id={field}
                    type={fieldConfig.type}
                    value={fieldConfig.value}
                    onChange={(e) => fieldConfig.onChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50 
                      text-gray-200 placeholder-gray-500 transition-all"
                    placeholder={fieldConfig.placeholder}
                    required
                  />
                </div>
              </motion.div>
            );
          })}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3.5 bg-[#6a7fdb] text-white rounded-lg 
              font-semibold hover:bg-[#5a6fdb] focus:outline-none 
              focus:ring-2 focus:ring-[#6a7fdb]/30 transition-all 
              flex items-center justify-center space-x-2 group"
          >
            <span>Create Account</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </form>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center text-gray-400 text-sm"
        >
          Already have an account?{' '}
          <button 
            onClick={() => navigate('/login')} 
            className="text-[#6a7fdb] hover:underline font-medium"
          >
            Sign in
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}