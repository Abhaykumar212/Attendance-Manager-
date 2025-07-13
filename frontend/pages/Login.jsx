import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setIsLoggedIn, getUserData } = useContext(AppContext);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(`${backend_url}/login`, { email, password });

      if (!data.error) {
        setIsLoggedIn(true);
        getUserData();
        toast.success('Welcome back!');
        navigate('/home');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
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

        <h2 className="text-4xl font-bold text-[#6a7fdb] mb-6 text-center">
          Welcome Back
        </h2>
        <p className="text-gray-400 text-center mb-8">
          Sign in to access your student dashboard
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-400 mb-2">
              College Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your college email"
                className="w-full pl-10 pr-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="password" className="block text-gray-400">
                Password
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-[#6a7fdb] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 bg-[#2c2c4a] border border-[#3c3c5a] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50 transition-all"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#6a7fdb] text-white rounded-lg hover:bg-[#5a6fdb] transition-colors"
          >
            Sign In
            <ArrowRight className="h-5 w-5" />
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <span className="text-gray-400">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-[#6a7fdb] hover:underline"
            >
              Register here
            </button>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
