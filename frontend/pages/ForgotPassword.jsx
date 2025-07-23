import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(`${backend_url}/forgot-password`, { email });

      if (data.success) {
        toast.success('Password reset OTP sent to your email!');
        navigate('/reset-password', { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Floating Orbs Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            className={`absolute w-${Math.random() > 0.5 ? '32' : '24'} h-${Math.random() > 0.5 ? '32' : '24'} rounded-full blur-xl ${
              Math.random() > 0.7 ? 'bg-[#00e0ff]/20' : 
              Math.random() > 0.4 ? 'bg-[#1ecbe1]/20' : 
              'bg-[#00ffd0]/20'
            }`}
          />
        ))}
      </div>

      {/* Glassmorphism Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-8 shadow-2xl relative overflow-hidden">
          {/* Gradient Border Top */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00e0ff] via-[#1ecbe1] to-[#00ffd0]" />
          
          {/* Subtle Glow Effect */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00e0ff]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#1ecbe1]/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Back Button */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              onClick={() => navigate('/login')}
              className="mb-6 flex items-center gap-2 text-[#aaaaaa] hover:text-[#00e0ff] transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent mb-3">
                Forgot Password?
              </h1>
              <p className="text-[#aaaaaa] text-lg">
                Enter your email to receive a password reset OTP
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <label htmlFor="email" className="block text-[#aaaaaa] mb-2 font-medium">
                  College Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#666666] h-5 w-5 transition-colors group-focus-within:text-[#00e0ff]" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your college email"
                    className="w-full pl-12 pr-4 py-4 bg-[#2a2a2a]/50 border border-[#444444]/50 rounded-xl text-[#ffffff] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50 transition-all duration-300 backdrop-blur-sm"
                  />
                </div>
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                whileHover={{ 
                  scale: isLoading ? 1 : 1.02,
                  boxShadow: isLoading ? "none" : "0 0 30px rgba(0, 224, 255, 0.3)"
                }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 px-6 py-4 font-semibold rounded-xl transition-all duration-300 shadow-lg ${
                  isLoading 
                    ? 'bg-gradient-to-r from-[#666666] to-[#888888] text-[#cccccc] cursor-not-allowed' 
                    : 'bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] hover:from-[#1ecbe1] hover:to-[#00ffd0] hover:shadow-[#00e0ff]/25 group'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Reset OTP</span>
                    <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-center mt-8 pt-6 border-t border-[#333333]/50"
            >
              <p className="text-[#aaaaaa] text-sm">
                Remember your password?{' '}
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#00e0ff] hover:text-[#1ecbe1] font-medium transition-colors duration-200"
                >
                  Sign in here
                </button>
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
