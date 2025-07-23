import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, userData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        // Give some time for the context to load user data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="bg-[#0f0f0f] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-[#00e0ff] mx-auto mb-4" />
                    <p className="text-[#aaaaaa] text-lg">Checking authentication...</p>
                </div>
            </div>
        );
    }

    // If not logged in, redirect to login with the current location
    if (!isLoggedIn || !userData) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If logged in, render the protected component
    return children;
};

export default ProtectedRoute;
