import React, { useState,useEffect } from 'react';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const VerifyMail = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);

  // Handle OTP input change
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.value !== '' && index < 5) {
      const nextInput = element.parentElement.nextElementSibling?.querySelector('input');
      if (nextInput) nextInput.focus();
    }
  };

  // Handle key event for backspace
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = e.target.parentElement.previousElementSibling?.querySelector('input');
      if (prevInput) {
        prevInput.focus();
        setOtp([...otp.map((d, idx) => (idx === index - 1 ? '' : d))]);
      }
    }
  };

  // Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.length === 6 && pastedData.every(char => !isNaN(char))) {
      setOtp(pastedData);
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

      // console.log(data);

      if (!data.error) {
        toast.success('✅ Email verified successfully!', {
          duration: 3000
        });
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      await axios.post(`${backend_url}/api/auth/resend-otp`);
      toast.success('🔄 New OTP sent to your email!');
    } catch (error) {
      toast.error('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-[#800000]/5 blur-3xl pointer-events-none" />
      
      <div className="w-[448px] bg-white rounded-2xl shadow-xl border border-gray-200">
        <div className="p-8">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-[#800000]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="text-[#800000] h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-[#800000] mb-2">Verify Your Email</h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-center space-x-3 mb-6">
              {otp.map((digit, index) => (
                <div key={index} className="w-12">
                  <input
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    className="w-full h-12 text-center text-xl font-bold bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#800000]/20 text-gray-900 placeholder-gray-500 transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-2 text-[#800000]" />
              <span>The code will expire in 10 minutes</span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              onClick={verifyOTP}
              disabled={loading || otp.some(digit => !digit)}
              className={`w-full py-3 px-4 bg-[#800000] text-white rounded-lg font-medium 
                ${loading || otp.some(digit => !digit) 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-[#800000]/90'} 
                focus:outline-none focus:ring-2 focus:ring-[#800000]/20 transition-all 
                flex items-center justify-center space-x-2 group`}
            >
              <span>{loading ? 'Verifying...' : 'Verify Email'}</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Didn't receive the code?{' '}
                <button 
                  onClick={resendOTP}
                  className="text-[#800000] hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyMail;
