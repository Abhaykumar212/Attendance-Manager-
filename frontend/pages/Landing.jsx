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
    Database,
    ArrowRight,
    Star,
    TrendingUp,
    Users,
    CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
    const [activeFeature, setActiveFeature] = useState(0);

    const features = [
        {
            icon: BookOpen,
            title: 'Comprehensive Tracking',
            description: 'Detailed attendance records for every class and subject.',
            details: 'Our advanced tracking system captures every academic interaction, providing unprecedented insights into your educational journey.',
            color: '#00e0ff'
        },
        {
            icon: BarChart2,
            title: 'Insightful Analytics',
            description: 'Visualize your attendance performance with intuitive charts.',
            details: 'Transform raw attendance data into actionable intelligence with our powerful visualization tools.',
            color: '#4ade80'
        },
        {
            icon: Clock,
            title: 'Real-time Updates',
            description: 'Instant attendance updates and notifications.',
            details: 'Stay informed with millisecond-precision updates directly to your dashboard.',
            color: '#1ecbe1'
        },
        {
            icon: Shield,
            title: 'Secure Access',
            description: 'Robust authentication and data protection.',
            details: 'Military-grade encryption and multi-factor authentication protect your academic data.',
            color: '#00ffd0'
        }
    ];

    const whyChooseFeatures = [
        {
            icon: TrendingUp,
            title: 'Boost Your GPA',
            description: 'Students using AttendanceHub see 23% improvement in academic performance.',
            color: '#00e0ff'
        },
        {
            icon: Clock,
            title: 'Save Time Daily',
            description: 'Spend less time tracking and more time learning with automated insights.',
            color: '#4ade80'
        },
        {
            icon: Users,
            title: 'Join 10K+ Students',
            description: 'Be part of a growing community of successful, organized students.',
            color: '#1ecbe1'
        },
        {
            icon: CheckCircle2,
            title: 'Never Miss Again',
            description: 'Smart alerts ensure you maintain the attendance you need to succeed.',
            color: '#00ffd0'
        }
    ];

    const stats = [
        { number: '99.9%', label: 'Uptime', icon: TrendingUp },
        { number: '10K+', label: 'Students', icon: BookOpen },
        { number: '500+', label: 'Institutions', icon: Shield },
        { number: '24/7', label: 'Support', icon: Clock }
    ];

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-[#eaeaea] overflow-hidden relative">
            {/* Floating Navigation */}
            <motion.nav
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed top-0 left-0 right-0 z-50 mx-4 mt-4"
            >
                <div className="bg-[#1e1e1e]/20 backdrop-blur-2xl border border-[#2d2d2d]/30 rounded-2xl p-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-10 h-10 bg-gradient-to-br from-[#00e0ff] to-[#1ecbe1] rounded-xl flex items-center justify-center shadow-lg shadow-[#00e0ff]/20">
                                <BookOpen className="w-5 h-5 text-[#0f0f0f]" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-[#ffffff] tracking-tight">AttendanceHub</h1>
                                <p className="text-sm text-[#999999]">Academic Excellence</p>
                            </div>
                        </motion.div>
                        
                        <div className="flex items-center gap-4">
                            <Link
                                to="/login"
                                className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e]/60 backdrop-blur-sm border border-[#2d2d2d] text-[#eaeaea] rounded-xl font-medium hover:bg-[#1e1e1e]/80 hover:border-[#00e0ff]/30 transition-all duration-300"
                            >
                                <LogIn className="w-4 h-4" />
                                <span className="hidden sm:inline">Login</span>
                            </Link>
                            
                            <Link
                                to="/register"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold shadow-lg shadow-[#00e0ff]/20 hover:shadow-[#00e0ff]/40 transition-all duration-300"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span className="hidden sm:inline">Register</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Floating Orbs */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: 0
                        }}
                        animate={{
                            x: Math.random() * window.innerWidth,
                            y: Math.random() * window.innerHeight,
                            scale: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                        className={`absolute w-32 h-32 rounded-full blur-3xl opacity-10 ${
                            i % 4 === 0 ? 'bg-[#00e0ff]' :
                            i % 4 === 1 ? 'bg-[#4ade80]' :
                            i % 4 === 2 ? 'bg-[#1ecbe1]' : 'bg-[#00ffd0]'
                        }`}
                    />
                ))}
                
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(45,45,45,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(45,45,45,0.1)_1px,transparent_1px)] bg-[size:50px_50px] opacity-20"></div>
            </div>

            <div className="relative z-10 pt-24">
                {/* Hero Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="text-center mb-20 px-4"
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-full mb-8"
                    >
                        {/* <Star className="w-4 h-4 text-[#00e0ff]" /> */}
                        {/* <span className="text-sm text-[#aaaaaa]">Trusted by 10,000+ students worldwide</span> */}
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold text-[#ffffff] mb-6 tracking-tight leading-tight">
                        Revolutionize Your{' '}
                        <span className="bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] bg-clip-text text-transparent">
                            Academic Tracking
                        </span>
                    </h1>
                    
                    <p className="text-xl text-[#aaaaaa] max-w-3xl mx-auto mb-12 leading-relaxed">
                        Transform attendance into actionable insights. Track smarter, learn better, 
                        and unlock your academic potential with our cutting-edge platform.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/login"
                                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold shadow-2xl shadow-[#00e0ff]/20 hover:shadow-[#00e0ff]/40 transition-all duration-300"
                            >
                                <LogIn className="h-5 w-5" />
                                Get Started
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </motion.div>

                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Link
                                to="/register"
                                className="flex items-center gap-3 px-8 py-4 bg-[#1e1e1e]/60 backdrop-blur-xl border border-[#2d2d2d] text-[#eaeaea] rounded-xl font-semibold hover:bg-[#1e1e1e]/80 hover:border-[#00e0ff]/30 transition-all duration-300"
                            >
                                <UserPlus className="h-5 w-5" />
                                Create Account
                            </Link>
                        </motion.div>
                    </div>

                    {/* Stats Section */}
                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        index % 4 === 0 ? 'bg-[#00e0ff]/10 text-[#00e0ff]' :
                                        index % 4 === 1 ? 'bg-[#4ade80]/10 text-[#4ade80]' :
                                        index % 4 === 2 ? 'bg-[#1ecbe1]/10 text-[#1ecbe1]' : 'bg-[#00ffd0]/10 text-[#00ffd0]'
                                    }`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold text-[#ffffff] mb-1">{stat.number}</div>
                                <div className="text-sm text-[#aaaaaa]">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Features Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.6 }}
                    className="px-4 mb-20"
                >
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-[#ffffff] mb-4">
                            Features That <span className="text-[#00e0ff]">Empower</span>
                        </h2>
                        <p className="text-xl text-[#aaaaaa] max-w-2xl mx-auto">
                            Discover the tools that make academic tracking effortless and insightful
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                onHoverStart={() => setActiveFeature(index)}
                                className={`bg-[#1e1e1e]/60 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-2xl p-6 hover:border-[#00e0ff]/30 transition-all duration-300 group ${
                                    activeFeature === index ? 'ring-2 ring-[#00e0ff]/20 shadow-2xl shadow-[#00e0ff]/10' : ''
                                }`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                        activeFeature === index 
                                            ? `bg-[${feature.color}]/20 text-[${feature.color}]` 
                                            : 'bg-[#2d2d2d]/50 text-[#aaaaaa] group-hover:bg-[#00e0ff]/10 group-hover:text-[#00e0ff]'
                                    }`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    {activeFeature === index && (
                                        <motion.div
                                            initial={{ scale: 0, rotate: -180 }}
                                            animate={{ scale: 1, rotate: 0 }}
                                            className="w-2 h-2 bg-[#00e0ff] rounded-full"
                                        />
                                    )}
                                </div>
                                
                                <h3 className="text-xl font-semibold text-[#ffffff] mb-3 group-hover:text-[#00e0ff] transition-colors">
                                    {feature.title}
                                </h3>
                                
                                <p className="text-[#aaaaaa] mb-4 leading-relaxed">
                                    {feature.description}
                                </p>
                                
                                <AnimatePresence>
                                    {activeFeature === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="border-t border-[#2d2d2d]/50 pt-4"
                                        >
                                            <p className="text-sm text-[#999999] leading-relaxed">
                                                {feature.details}
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Why Choose AttendanceHub Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
                    className="px-4 mb-20"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-3xl p-8 relative overflow-hidden">
                            {/* Background Pattern */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#00e0ff]/5 to-[#1ecbe1]/5 rounded-full blur-3xl"></div>
                            
                            <div className="relative z-10">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-bold text-[#ffffff] mb-4">
                                        Why Students <span className="text-[#4ade80]">Choose</span> AttendanceHub
                                    </h2>
                                    <p className="text-xl text-[#aaaaaa] max-w-2xl mx-auto">
                                        Join thousands of students who have transformed their academic journey
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {whyChooseFeatures.map((feature, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.8 + index * 0.1 }}
                                            whileHover={{ scale: 1.05, y: -5 }}
                                            className={`bg-[#1e1e1e]/60 backdrop-blur-sm border border-[#2d2d2d]/50 rounded-2xl p-6 text-center hover:border-[${feature.color}]/30 hover:shadow-2xl hover:shadow-[${feature.color}]/10 transition-all duration-300 group`}
                                        >
                                            <div className="flex justify-center mb-4">
                                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                    `bg-[${feature.color}]/10 text-[${feature.color}] group-hover:bg-[${feature.color}]/20`
                                                }`}>
                                                    <feature.icon className="w-7 h-7" />
                                                </div>
                                            </div>
                                            
                                            <h3 className={`text-xl font-semibold text-[#ffffff] mb-3 group-hover:text-[${feature.color}] transition-colors`}>
                                                {feature.title}
                                            </h3>
                                            
                                            <p className="text-[#aaaaaa] leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 1 }}
                    className="px-4 pb-20"
                >
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="bg-[#1e1e1e]/40 backdrop-blur-xl border border-[#2d2d2d]/50 rounded-3xl p-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00e0ff]/5 via-transparent to-[#1ecbe1]/5"></div>
                            
                            <div className="relative z-10">
                                <h2 className="text-4xl font-bold text-[#ffffff] mb-6">
                                    Ready to Transform Your Academic Journey?
                                </h2>
                                
                                <p className="text-xl text-[#aaaaaa] mb-8 max-w-2xl mx-auto">
                                    Join thousands of students who have already revolutionized their attendance tracking experience.
                                </p>
                                
                                <div className="flex flex-col sm:flex-row justify-center gap-4">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            to="/register"
                                            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold shadow-2xl shadow-[#00e0ff]/20 hover:shadow-[#00e0ff]/40 transition-all duration-300"
                                        >
                                            <Rocket className="h-5 w-5" />
                                            Start Your Journey
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    </motion.div>
                                    
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Link
                                            to="/login"
                                            className="flex items-center gap-3 px-8 py-4 bg-[#1e1e1e]/60 backdrop-blur-xl border border-[#2d2d2d] text-[#eaeaea] rounded-xl font-semibold hover:bg-[#1e1e1e]/80 hover:border-[#00e0ff]/30 transition-all duration-300"
                                        >
                                            <LogIn className="h-5 w-5" />
                                            Sign In
                                        </Link>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}