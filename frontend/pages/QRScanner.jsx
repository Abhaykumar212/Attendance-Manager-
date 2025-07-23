import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Scan, MapPin, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import QrScanner from 'qr-scanner';

export default function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  // Get user location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
        },
        (error) => {
          console.error('Location access denied:', error);
          toast.error('Location access is required for QR attendance');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // Initialize QR Scanner
  const startScanning = async () => {
    if (!userLocation) {
      toast.error('Please allow location access to scan QR codes');
      return;
    }

    try {
      setIsScanning(true);
      
      const qrScanner = new QrScanner(
        videoRef.current,
        (result) => {
          console.log('QR Code detected:', result.data);
          setScanResult(result.data);
          stopScanning();
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      qrScannerRef.current = qrScanner;
      await qrScanner.start();
      toast.success('Scanner started! Point camera at QR code');
    } catch (error) {
      console.error('Scanner error:', error);
      toast.error('Failed to start camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setIsScanning(false);
  };

  // Mark attendance with scanned QR code
  const markAttendance = async () => {
    if (!scanResult || !userLocation) {
      toast.error('QR code or location missing');
      return;
    }

    setIsMarkingAttendance(true);
    try {
      const backend_url = import.meta.env.VITE_BACKEND_URL;
      const { data } = await axios.post(`${backend_url}/api/qr-attendance/mark`, {
        qrData: scanResult,
        studentLocation: JSON.stringify(userLocation)
      }, {
        withCredentials: true
      });

      if (data.success) {
        toast.success(`Attendance marked successfully! Welcome ${data.student}`);
        setScanResult(null);
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to mark attendance');
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  // Parse QR code data for display
  const parseQRData = (qrString) => {
    try {
      return JSON.parse(qrString);
    } catch (error) {
      return null;
    }
  };

  const qrData = scanResult ? parseQRData(scanResult) : null;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <div className="bg-[#0f0f0f] min-h-screen p-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] bg-clip-text text-transparent mb-4">
            QR Attendance Scanner
          </h1>
          <p className="text-[#aaaaaa] text-lg">Scan the QR code displayed by your professor</p>
        </motion.div>

        {/* Location Status */}
        {userLocation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-4 mb-6"
          >
            <div className="flex items-center gap-3 text-[#00e0ff]">
              <MapPin className="h-5 w-5" />
              <span className="text-sm">
                Location detected: {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
              </span>
            </div>
          </motion.div>
        )}

        {/* Camera Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-6 mb-6"
        >
          <div className="text-center">
            {!isScanning && !scanResult && (
              <div className="py-16">
                <Camera className="h-16 w-16 text-[#666666] mx-auto mb-4" />
                <p className="text-[#666666] text-lg mb-4">Ready to scan QR code</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={startScanning}
                  disabled={!userLocation}
                  className={`flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-300 mx-auto ${
                    !userLocation
                      ? 'bg-[#666666] text-[#cccccc] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] hover:shadow-lg'
                  }`}
                >
                  <Scan className="h-5 w-5" />
                  Start Scanning
                </motion.button>
              </div>
            )}

            {isScanning && (
              <div>
                <video
                  ref={videoRef}
                  className="w-full max-w-md mx-auto rounded-xl mb-4"
                  playsInline
                />
                <p className="text-[#aaaaaa] mb-4">Point your camera at the QR code</p>
                <button
                  onClick={stopScanning}
                  className="px-6 py-2 bg-[#ff4444] text-white rounded-xl font-semibold hover:bg-[#ff3333] transition-colors"
                >
                  Stop Scanning
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Scan Result */}
        {scanResult && qrData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#333333]/50 p-6"
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-[#00ff88]" />
                <h3 className="text-xl font-bold text-[#ffffff]">QR Code Detected</h3>
              </div>

              <div className="bg-[#2a2a2a]/50 rounded-xl p-4 mb-6">
                <div className="space-y-2 text-[#aaaaaa]">
                  <p><strong className="text-[#ffffff]">Subject:</strong> {qrData.subjectCode}</p>
                  <p><strong className="text-[#ffffff]">Class:</strong> {qrData.className}</p>
                  <p><strong className="text-[#ffffff]">Professor:</strong> {qrData.professorEmail}</p>
                  <p><strong className="text-[#ffffff]">Time:</strong> {new Date(qrData.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>

              {/* Check if QR is expired */}
              {Date.now() > qrData.expiryTime ? (
                <div className="flex items-center justify-center gap-3 mb-4 text-[#ff4444]">
                  <AlertCircle className="h-5 w-5" />
                  <span>This QR code has expired</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3 mb-4 text-[#00ff88]">
                  <CheckCircle className="h-5 w-5" />
                  <span>QR code is valid</span>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={markAttendance}
                  disabled={isMarkingAttendance || Date.now() > qrData.expiryTime}
                  className={`flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-xl transition-all duration-300 ${
                    isMarkingAttendance || Date.now() > qrData.expiryTime
                      ? 'bg-[#666666] text-[#cccccc] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#00ff88] to-[#00cc66] text-[#0f0f0f] hover:shadow-lg'
                  }`}
                >
                  {isMarkingAttendance ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      Marking...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Mark Attendance
                    </>
                  )}
                </motion.button>

                <button
                  onClick={() => {
                    setScanResult(null);
                    startScanning();
                  }}
                  className="px-6 py-3 bg-[#2a2a2a] border border-[#444444] text-[#ffffff] rounded-xl font-semibold hover:bg-[#333333] transition-colors"
                >
                  Scan Again
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {scanResult && !qrData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#1e1e1e]/80 backdrop-blur-xl rounded-2xl border border-[#ff4444]/50 p-6"
          >
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-[#ff4444] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#ffffff] mb-2">Invalid QR Code</h3>
              <p className="text-[#aaaaaa] mb-4">This doesn't appear to be a valid attendance QR code</p>
              <button
                onClick={() => {
                  setScanResult(null);
                  startScanning();
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
