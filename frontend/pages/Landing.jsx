import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogIn,
    UserPlus,
    BookOpen,
    BarChart2,
    Shield,
    Clock,
    Zap,
    Cpu,
    Layers,
    Rocket,
    Compass,
    Database
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: BookOpen,
            title: 'Comprehensive Tracking',
            description: 'Detailed attendance records for every class and subject.',
            details: 'Our advanced tracking system captures every academic interaction, providing unprecedented insights into your educational journey.'
        },
        {
            icon: BarChart2,
            title: 'Insightful Analytics',
            description: 'Visualize your attendance performance with intuitive charts.',
            details: 'Transform raw attendance data into actionable intelligence with our powerful visualization tools.'
        },
        {
            icon: Clock,
            title: 'Real-time Updates',
            description: 'Instant attendance updates and notifications.',
            details: 'Stay informed with millisecond-precision updates directly to your dashboard.'
        },
        {
            icon: Shield,
            title: 'Secure Access',
            description: 'Robust authentication and data protection.',
            details: 'Military-grade encryption and multi-factor authentication protect your academic data.'
        }
    ];

    const techFeatures = [
        {
            icon: Zap,
            title: 'High Performance',
            description: 'Lightning-fast data processing and real-time synchronization.'
        },
        {
            icon: Cpu,
            title: 'Smart Technology',
            description: 'AI-powered insights and predictive analytics.'
        },
        {
            icon: Layers,
            title: 'Seamless Integration',
            description: 'Connects effortlessly with existing academic systems.'
        },
        {
            icon: Rocket,
            title: 'Future-Ready',
            description: 'Continuously evolving platform with cutting-edge features.'
        }
    ];

    return (
        <div className="dark bg-[#0a0a1a] min-h-screen text-gray-100 overflow-hidden relative">
            {/* Animated Background Gradient */}
            <motion.div
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#16213e] to-[#0f3460] opacity-50 z-0"
            />

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
                        className="absolute w-1 h-1 bg-white/50 rounded-full"
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-16 relative z-20"
            >
                {/* Hero Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-bold text-[#6a7fdb] mb-6 tracking-tight leading-tight">
                        Revolutionize Your <br />Academic Tracking
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                        Turn attendance into insight. Track smarter, learn better.
                    </p>


                    <div className="flex justify-center space-x-4">
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-8 py-4 bg-[#6a7fdb] text-white rounded-lg shadow-2xl hover:bg-[#5a6fdb] transition-all duration-300 hover:shadow-[#6a7fdb]/50 hover:scale-105"
                        >
                            <LogIn className="h-6 w-6" />
                            Login
                        </Link>

                        <Link
                            to="/register"
                            className="flex items-center gap-2 px-8 py-4 bg-[#2c2c4a] text-gray-200 rounded-lg shadow-2xl hover:bg-[#3c3c5a] transition-all duration-300 hover:shadow-[#6a7fdb]/30 hover:scale-105"
                        >
                            <UserPlus className="h-6 w-6" />
                            Register
                        </Link>
                    </div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            onHoverStart={() => setActiveFeature(index)}
                            className={`bg-[#1a1a2e] rounded-2xl border border-[#2c2c4a] p-6 text-center shadow-2xl transition-all duration-300 ${activeFeature === index ? 'ring-4 ring-[#6a7fdb]/50' : ''
                                }`}
                        >
                            <div className="mb-4 flex justify-center">
                                <feature.icon className="h-12 w-12 text-[#6a7fdb]" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#6a7fdb] mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                {feature.description}
                            </p>
                            <AnimatePresence>
                                {activeFeature === index && (
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="text-sm text-gray-300"
                                    >
                                        {feature.details}
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Technology Features */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                    className="bg-[#1a1a2e] rounded-3xl border border-[#2c2c4a] p-8 shadow-2xl"
                >
                    <h2 className="text-3xl font-bold text-[#6a7fdb] text-center mb-10">
                        Technology That Empowers Learning
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {techFeatures.map((tech, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="bg-[#2c2c4a] rounded-2xl p-6 text-center hover:shadow-[#6a7fdb]/30 transition-all duration-300"
                            >
                                <div className="mb-4 flex justify-center">
                                    <tech.icon className="h-10 w-10 text-[#6a7fdb]" />
                                </div>
                                <h3 className="text-xl font-semibold text-[#6a7fdb] mb-3">
                                    {tech.title}
                                </h3>
                                <p className="text-gray-400">
                                    {tech.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}