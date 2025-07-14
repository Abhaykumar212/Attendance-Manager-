import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { motion } from 'framer-motion';

const VerifyMail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.value && index < 5) {
      const next = element.parentElement.nextElementSibling?.querySelector('input');
      if (next) next.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prev = e.target.parentElement.previousElementSibling?.querySelector('input');
      if (prev) {
        prev.focus();
        setOtp([...otp.map((d, idx) => (idx === index - 1 ? '' : d))]);
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    if (data.length === 6 && data.every(c => !isNaN(c))) {
      setOtp(data);
      document.querySelectorAll('input')[5].focus();
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(`${backend_url}/verifyemail`, {
        otp: otp.join('')
      });

      if (!data.error) {
        toast.success('Email verified!');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      await axios.post(`${backend_url}/api/auth/resend-otp`);
      toast.success('New OTP sent!');
    } catch {
      toast.error('Could not resend OTP. Try again.');
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Floating orbs animation */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(12)].map((_, i) => (
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
              duration: Math.random() * 8 + 6,
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
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`
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
        className="w-full max-w-md relative z-20"
      >
        {/* Main card with glassmorphism */}
        <div className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle gradient border */}
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#00e0ff] via-[#1ecbe1] to-[#4ade80]" />
          
          {/* Floating decoration */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#00e0ff]/10 rounded-full blur-xl" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#4ade80]/10 rounded-full blur-xl" />

          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="w-20 h-20 bg-gradient-to-br from-[#00e0ff]/20 to-[#1ecbe1]/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10"
            >
              <Mail className="text-[#00e0ff] h-10 w-10" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-3xl font-bold bg-gradient-to-r from-[#ffffff] to-[#eaeaea] bg-clip-text text-transparent mb-2"
            >
              Verify Your Email
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-[#aaaaaa] text-sm leading-relaxed"
            >
              Enter the 6-digit code sent to your email address
            </motion.p>
          </div>

          {/* OTP Input Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="bg-[#1e1e1e]/60 backdrop-blur-sm rounded-xl border border-white/5 p-6 mb-6"
          >
            <div className="flex justify-center space-x-3 mb-4">
              {otp.map((digit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  className="w-12"
                >
                  <input
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-full h-14 text-center text-xl font-bold bg-[#0f0f0f]/60 border border-white/10 
                      rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 focus:border-[#00e0ff]/50
                      text-[#ffffff] placeholder-[#666666] transition-all duration-300
                      hover:border-white/20 hover:bg-[#0f0f0f]/80 hover:shadow-lg hover:shadow-[#00e0ff]/10"
                  />
                </motion.div>
              ))}
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex items-center justify-center text-sm text-[#999999]"
            >
              <CheckCircle className="h-4 w-4 mr-2 text-[#4ade80]" />
              <span>The code expires in 10 minutes</span>
            </motion.div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-4"
          >
            <button
              onClick={verifyOTP}
              disabled={loading || otp.some(d => !d)}
              className={`w-full py-4 px-6 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold text-sm
                ${loading || otp.some(d => !d) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:from-[#00e0ff]/90 hover:to-[#1ecbe1]/90 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#00e0ff]/25'
                } 
                focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50 transition-all duration-300
                flex items-center justify-center space-x-3 group relative overflow-hidden`}
            >
              <span className="relative z-10">
                {loading ? 'Verifying...' : 'Verify Email'}
              </span>
              {!loading && (
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 relative z-10" />
              )}
              {loading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="relative z-10"
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              )}
            </button>

            <div className="text-center text-sm text-[#999999]">
              Didn't receive the code?{' '}
              <button 
                onClick={resendOTP} 
                className="text-[#00e0ff] hover:text-[#1ecbe1] font-medium transition-colors duration-200 hover:underline"
              >
                Resend OTP
              </button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyMail;