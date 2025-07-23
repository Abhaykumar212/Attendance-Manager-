import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, Clock, Users, MapPin, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

export default function QRGenerator() {
  const [qrData, setQrData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sessionStats, setSessionStats] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [classLocation, setClassLocation] = useState(null);
  const [formData, setFormData] = useState({
    subjectCode: '',
    className: '',
    duration: 60
  });

  // Get current location for geofencing
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setClassLocation(location);
        },
        (error) => {
          console.error('Location access denied:', error);
          toast.error('Location access is required for QR attendance');
        }
      );
    }
  }, []);

  // Timer for countdown
  useEffect(() => {
    let interval;
    if (qrData && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setQrData(null);
            setSessionStats(null);
            toast.error('QR code has expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [qrData, timeRemaining]);

  // Fetch session stats
  useEffect(() => {
    let interval;
    if (qrData?.sessionId) {
      interval = setInterval(async () => {
        try {
          const backend_url = import.meta.env.VITE_BACKEND_URL;
          const { data } = await axios.get(`${backend_url}/api/qr-attendance/session/${qrData.sessionId}`, {
            withCredentials: true
          });
          setSessionStats(data.sessionInfo);
        } catch (error) {
          console.error('Failed to fetch session stats:', error);
        }
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [qrData?.sessionId]);

  const generateQR = async () => {
    if (!classLocation) {
      toast.error('Please allow location access to generate QR code');
      return;
    }

    if (!formData.subjectCode || !formData.className) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    try {
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(`${backend_url}/api/qr-attendance/generate`, {
        ...formData,
        classLocation: JSON.stringify(classLocation)
      }, {
        withCredentials: true
      });

      if (data.success) {
        setQrData(data);
        setTimeRemaining(data.duration);
        toast.success('QR code generated successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyQRCode = async () => {
    try {
      await navigator.clipboard.writeText(qrData.qrCode);
      toast.success('QR code copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy QR code');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] bg-clip-text text-transparent mb-4">
            QR Code Attendance
          </h1>
          <p className="text-[#aaaaaa] text-lg">Generate secure, time-limited QR codes for attendance</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Generation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-6"
          >
            <h2 className="text-2xl font-bold text-[#ffffff] mb-6 flex items-center gap-3">
              <QrCode className="h-6 w-6 text-[#00e0ff]" />
              Generate QR Code
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[#aaaaaa] mb-2 font-medium">Subject Code</label>
                <input
                  type="text"
                  value={formData.subjectCode}
                  onChange={(e) => setFormData(prev => ({...prev, subjectCode: e.target.value}))}
                  placeholder="e.g., CS301"
                  className="w-full px-4 py-3 bg-[#2a2a2a]/50 border border-[#444444]/50 rounded-xl text-[#ffffff] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50"
                />
              </div>

              <div>
                <label className="block text-[#aaaaaa] mb-2 font-medium">Class Name</label>
                <input
                  type="text"
                  value={formData.className}
                  onChange={(e) => setFormData(prev => ({...prev, className: e.target.value}))}
                  placeholder="e.g., Database Management Systems"
                  className="w-full px-4 py-3 bg-[#2a2a2a]/50 border border-[#444444]/50 rounded-xl text-[#ffffff] placeholder-[#666666] focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50"
                />
              </div>

              <div>
                <label className="block text-[#aaaaaa] mb-2 font-medium">Duration (seconds)</label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({...prev, duration: parseInt(e.target.value)}))}
                  className="w-full px-4 py-3 bg-[#2a2a2a]/50 border border-[#444444]/50 rounded-xl text-[#ffffff] focus:outline-none focus:ring-2 focus:ring-[#00e0ff]/50"
                >
                  <option value={30}>30 seconds</option>
                  <option value={60}>1 minute</option>
                  <option value={120}>2 minutes</option>
                  <option value={300}>5 minutes</option>
                </select>
              </div>

              {classLocation && (
                <div className="flex items-center gap-2 text-[#00e0ff] text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Location: {classLocation.latitude.toFixed(4)}, {classLocation.longitude.toFixed(4)}</span>
                </div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={generateQR}
                disabled={isGenerating || !classLocation}
                className={`w-full flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                  isGenerating || !classLocation
                    ? 'bg-[#666666] text-[#cccccc] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] hover:shadow-lg'
                }`}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="h-5 w-5" />
                    Generate QR Code
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* QR Display */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-6"
          >
            {qrData ? (
              <div className="text-center">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#ffffff]">Active QR Code</h3>
                  <div className="flex items-center gap-2 text-[#00e0ff]">
                    <Clock className="h-4 w-4" />
                    <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl mb-4 inline-block">
                  <img src={qrData.qrCode} alt="QR Code" className="w-64 h-64" />
                </div>

                <div className="space-y-2 text-[#aaaaaa] text-sm mb-4">
                  <p><strong>Subject:</strong> {formData.subjectCode}</p>
                  <p><strong>Class:</strong> {formData.className}</p>
                  <p><strong>Session ID:</strong> {qrData.sessionId}</p>
                </div>

                <button
                  onClick={copyQRCode}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-[#2a2a2a] border border-[#444444] rounded-lg text-[#ffffff] hover:bg-[#333333] transition-colors"
                >
                  <Copy className="h-4 w-4" />
                  Copy QR Code
                </button>
              </div>
            ) : (
              <div className="text-center py-16">
                <QrCode className="h-16 w-16 text-[#666666] mx-auto mb-4" />
                <p className="text-[#666666] text-lg">No active QR code</p>
                <p className="text-[#888888] text-sm">Generate a QR code to get started</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Session Statistics */}
        {sessionStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-6"
          >
            <h3 className="text-xl font-bold text-[#ffffff] mb-4 flex items-center gap-3">
              <Users className="h-6 w-6 text-[#00e0ff]" />
              Live Session Stats
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#2a2a2a]/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#00e0ff]">{sessionStats.totalPresent}</div>
                <div className="text-[#aaaaaa] text-sm">Students Present</div>
              </div>
              <div className="bg-[#2a2a2a]/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#1ecbe1]">{formatTime(sessionStats.timeRemaining)}</div>
                <div className="text-[#aaaaaa] text-sm">Time Remaining</div>
              </div>
              <div className="bg-[#2a2a2a]/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#00ffd0]">
                  {sessionStats.isExpired ? 'Expired' : 'Active'}
                </div>
                <div className="text-[#aaaaaa] text-sm">Status</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
