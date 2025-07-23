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
            const { data } = await axios.get(`${backend_url}/profile`);
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

    const logout = async () => {
        try {
            // Call logout endpoint to clear server-side cookie
            await axios.post(`${backend_url}/logout`);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            // Clear client-side state regardless of server response
            setIsLoggedIn(false);
            setUserData(null);
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
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
