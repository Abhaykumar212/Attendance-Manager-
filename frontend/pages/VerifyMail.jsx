import React, { useState } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
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
    <div className="dark bg-[#0a0a1a] min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden relative">
      {/* Starry background */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(80)].map((_, i) => (
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
            className="absolute w-1 h-1 bg-white/20 rounded-full"
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

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#6a7fdb]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-[#6a7fdb] h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-[#6a7fdb] mb-1">Verify Your Email</h1>
          <p className="text-gray-400">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="bg-[#2c2c4a] p-6 rounded-lg border border-[#3c3c5a] mb-6">
          <div className="flex justify-center space-x-3 mb-4">
            {otp.map((digit, index) => (
              <div key={index} className="w-12">
                <input
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-full h-12 text-center text-xl font-bold bg-[#1a1a2e] border border-[#3c3c5a] 
                    rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/50 
                    text-gray-100 placeholder-gray-400 transition-all"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center text-sm text-gray-400">
            <CheckCircle className="h-4 w-4 mr-2 text-[#6a7fdb]" />
            <span>The code expires in 10 minutes</span>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={verifyOTP}
            disabled={loading || otp.some(d => !d)}
            className={`w-full py-3 px-4 bg-[#6a7fdb] text-white rounded-lg font-medium 
              ${loading || otp.some(d => !d) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#5a6fdb]'} 
              focus:outline-none focus:ring-2 focus:ring-[#6a7fdb]/20 transition-all 
              flex items-center justify-center space-x-2 group`}
          >
            <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <div className="text-center text-sm text-gray-400">
            Didn't receive the code?{' '}
            <button onClick={resendOTP} className="text-[#6a7fdb] hover:underline font-medium">
              Resend OTP
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyMail;
