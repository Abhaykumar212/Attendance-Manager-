import React, { useState, useContext } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const Login = () => {
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
        toast.success('👋 Welcome back!', {
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100 p-4">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-[448px] bg-white rounded-2xl shadow-xl border border-gray-200 p-6 sm:p-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#800000]/10 rounded-full flex items-center justify-center">
            <Mail className="text-[#800000] h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#800000]">Welcome Back</h1>
            <p className="text-gray-600 text-sm sm:text-base">NIT Kurukshetra</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <button 
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-sm text-[#800000] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#800000] h-5 w-5" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 text-gray-900 placeholder-gray-500 transition-all text-sm sm:text-base"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-[#800000] text-white rounded-lg font-medium hover:bg-[#800000]/90 focus:outline-none focus:ring-2 focus:ring-[#800000]/20 transition-all flex items-center justify-center space-x-2 group text-sm sm:text-base"
          >
            <span>Sign In</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm sm:text-base">
          Don't have an account?{' '}
          <button onClick={() => navigate('/register')} className="text-[#800000] hover:underline">
            Create account
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login; 