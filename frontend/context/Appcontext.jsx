import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${backend_url}/api/students/me`);
            if (data.success) {
                setUserData(data.user);
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                setUserData(null);
            }
        } catch (error) {
            setIsLoggedIn(false);
            setUserData(null);
            console.error("Error fetching user:", error?.response?.data?.error || error.message);
        }
    };

    useEffect(() => {
        getUserData(); 
    }, []);

    const value = {
        backend_url,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
