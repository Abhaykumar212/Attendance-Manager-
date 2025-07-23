import React, { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { Loader2 } from 'lucide-react';

const PublicRoute = ({ children, redirectTo = "/home" }) => {
    const { isLoggedIn, userData } = useContext(AppContext);
    const [isLoading, setIsLoading] = useState(true);

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
                    <p className="text-[#aaaaaa] text-lg">Loading...</p>
                </div>
            </div>
        );
    }

    // If logged in, redirect to home or specified route
    if (isLoggedIn && userData) {
        return <Navigate to={redirectTo} replace />;
    }

    // If not logged in, render the public component (login/register)
    return children;
};

export default PublicRoute;
