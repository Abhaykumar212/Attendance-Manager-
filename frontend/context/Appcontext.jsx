import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { debugProdIssues, logApiCall, logApiResponse } from "../src/utils/debugProduction";

// Configure axios for credentials and production
axios.defaults.withCredentials = true;
axios.defaults.timeout = 10000; // 10 second timeout

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Debug production issues on mount (only in development)
    useEffect(() => {
        if (import.meta.env.DEV) {
            debugProdIssues();
        }
    }, []);

    const getUserData = async () => {
        try {
            setIsLoading(true);
            logApiCall(`${backend_url}/profile`, 'GET');
            
            const { data } = await axios.get(`${backend_url}/profile`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            logApiResponse(`${backend_url}/profile`, 200, data);
            
            if (data.success) {
                setUserData(data.user);
                setIsLoggedIn(true);
                if (import.meta.env.DEV) {
                    console.log('User data fetched successfully:', data.user.role);
                }
            } else {
                setIsLoggedIn(false);
                setUserData(null);
                if (import.meta.env.DEV) {
                    console.log('No user data returned');
                }
            }
        } catch (error) {
            logApiResponse(`${backend_url}/profile`, error?.response?.status || 'ERROR', error?.response?.data);
            setIsLoggedIn(false);
            setUserData(null);
            if (import.meta.env.DEV) {
                console.error("Error fetching user:", {
                    message: error.message,
                    status: error?.response?.status,
                    data: error?.response?.data,
                    url: error?.config?.url
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            logApiCall(`${backend_url}/logout`, 'POST');
            
            // Call logout endpoint to clear server-side cookie
            const response = await axios.post(`${backend_url}/logout`, {}, {
                withCredentials: true
            });
            
            logApiResponse(`${backend_url}/logout`, response.status, response.data);
        } catch (error) {
            if (import.meta.env.DEV) {
                console.error("Logout error:", error);
            }
        } finally {
            // Clear client-side state regardless of server response
            setIsLoggedIn(false);
            setUserData(null);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUserData(); 
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const value = {
        backend_url,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
        logout,
        isLoading
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
