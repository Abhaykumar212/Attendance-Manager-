import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { Loader2, AlertTriangle } from 'lucide-react';

const RoleProtectedRoute = ({ children, allowedRoles = [], requireAdmin = false }) => {
    const { isLoggedIn, userData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    // Admin email
    const ADMIN_EMAIL = '123105080@nitkkr.ac.in';

    useEffect(() => {
        // Give some time for the context to load user data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Helper function to check if user is admin
    const isAdmin = userData?.email === ADMIN_EMAIL;

    // Helper function to check if user is student (email starts with numbers)
    const isStudent = userData?.email && /^\d+@nitkkr\.ac\.in$/.test(userData.email);

    // Helper function to check if user is professor (email doesn't start with numbers but ends with nitkkr.ac.in)
    const isProfessor = userData?.email && /^[a-zA-Z][^@]*@nitkkr\.ac\.in$/.test(userData.email);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#00e0ff] mx-auto mb-4" />
                    <p className="text-[#aaaaaa] text-lg">Checking permissions...</p>
                </div>
            </div>
        );
    }

    // If not logged in, redirect to login with the current location
    if (!isLoggedIn || !userData) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Admin can access everything
    if (isAdmin) {
        return children;
    }

    // If admin is required and user is not admin
    if (requireAdmin && !isAdmin) {
        return (
            <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertTriangle className="h-16 w-16 text-[#ff4444] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Access Denied</h2>
                    <p className="text-[#aaaaaa] mb-6">
                        This page is restricted to administrators only.
                    </p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    // Check role-based access
    if (allowedRoles.length > 0) {
        const userRole = isStudent ? 'student' : isProfessor ? 'professor' : userData.role;
        
        if (!allowedRoles.includes(userRole)) {
            return (
                <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
                    <div className="text-center max-w-md mx-auto p-8">
                        <AlertTriangle className="h-16 w-16 text-[#ff4444] mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-[#ffffff] mb-4">Access Restricted</h2>
                        <p className="text-[#aaaaaa] mb-6">
                            You don't have permission to access this page.
                            {isStudent && " This page is for professors only."}
                            {isProfessor && " This page is for students only."}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => window.history.back()}
                                className="px-6 py-3 bg-[#1e1e1e]/60 border border-[#2d2d2d] text-[#eaeaea] rounded-xl font-semibold hover:bg-[#1e1e1e]/80 transition-all duration-300"
                            >
                                Go Back
                            </button>
                            <button
                                onClick={() => window.location.href = isStudent ? '/home' : '/phome'}
                                className="px-6 py-3 bg-gradient-to-r from-[#00e0ff] to-[#1ecbe1] text-[#0f0f0f] rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                            >
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // If all checks pass, render the protected component
    return children;
};

export default RoleProtectedRoute;
