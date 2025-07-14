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

      const response = await fetch(`${backend_url}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      console.log(data);
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        toast.success('Registration successful! Please verify your email.', {
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
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Floating Orbs Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ]
            }}
            transition={{
              duration: Math.random() * 12 + 10,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "easeInOut"
            }}
            className={`absolute w-${Math.random() > 0.5 ? '40' : '32'} h-${Math.random() > 0.5 ? '40' : '32'} rounded-full blur-xl ${
              Math.random() > 0.7 ? 'bg-[#00e0ff]/15' : 
              Math.random() > 0.4 ? 'bg-[#1ecbe1]/15' : 
              'bg-[#00ffd0]/15'
            }`}
          />
        ))}
      </div>

      {/* Glassmorphism Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-8 shadow-2xl relative overflow-hidden">
          {/* Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00e0ff] via-[#1ecbe1] to-[#00ffd0]" />
          
          {/* Subtle Glow Effects */}
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-[#00e0ff]/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-[#1ecbe1]/8 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Header with Role Icon */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <motion.div 
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-16 h-16 bg-gradient-to-br from-[#00e0ff]/20 to-[#1ecbe1]/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-[#00e0ff]/30"
              >
                {isStudent ? (
                  <GraduationCap className="text-[#00e0ff] h-8 w-8" />
                ) : (
                  <BookOpen className="text-[#1ecbe1] h-8 w-8" />
                )}
              </motion.div>
              <div className="text-left">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent tracking-tight">
                  {isStudent ? 'Student' : 'Professor'} Registration
                </h1>
                <p className="text-[#aaaaaa] text-lg">NIT Kurukshetra</p>
              </div>
            </motion.div>

            {/* Role Toggle */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-8"
            >
              <div className="flex items-center justify-center space-x-2 bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl p-1.5 border border-[#444444]/50">
                <button
                  type="button"
                  onClick={() => setIsStudent(true)}
                  className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium
                    ${isStudent 
                      ? 'bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] shadow-lg shadow-[#00e0ff]/25' 
                      : 'text-[#aaaaaa] hover:bg-[#333333]/50 hover:text-[#ffffff]'}`}
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Student</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsStudent(false)}
                  className={`flex-1 py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center space-x-2 font-medium
                    ${!isStudent 
                      ? 'bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] shadow-lg shadow-[#00e0ff]/25' 
                      : 'text-[#aaaaaa] hover:bg-[#333333]/50 hover:text-[#ffffff]'}`}
                >
                  <BookOpen className="h-5 w-5" />
                  <span>Professor</span>
                </button>
              </div>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {['name', 'rollNo', 'email', 'password'].map((field, index) => {
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
                    transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                  >
                    <label htmlFor={field} className="block text-[#aaaaaa] mb-2 font-medium">
                      {fieldConfig.label}
                    </label>
                    <div className="relative group">
                      <fieldConfig.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] h-5 w-5 transition-colors group-focus-within:text-[#00e0ff]" />
                      <input
                        id={field}
                        type={fieldConfig.type}
                        value={fieldConfig.value}
                        onChange={(e) => fieldConfig.onChange(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a]/50 border border-[#444444]/50 rounded-xl text-[#ffffff] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300 backdrop-blur-sm"
                        placeholder={fieldConfig.placeholder}
                        required
                      />
                    </div>
                  </motion.div>
                );
              })}

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 0 30px rgba(0, 224, 255, 0.3)"
                }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] font-semibold rounded-xl hover:from-[#1ecbe1] hover:to-[#00ffd0] transition-all duration-300 shadow-lg hover:shadow-[#00e0ff]/25 group"
              >
                <span>Create Account</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-center mt-8 pt-6 border-t border-[#333333]/50"
            >
              <span className="text-[#aaaaaa]">
                Already have an account?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#00e0ff] hover:text-[#1ecbe1] font-medium transition-colors duration-200"
                >
                  Sign in
                </button>
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}