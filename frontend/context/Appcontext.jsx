import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import React from "react";
axios.defaults.withCredentials = true; // always provide the coookies with the request

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedIn, setIsLoggedIn] = useState(false); // logged in status
    const [userData, setUserData] = useState(null); // if yes, fetch personalized information
    axios.defaults.withCredentials = true;


    const getAuthState = async () => {
        try {
            const {data} = await axios.get(`${backend_url}/api/auth/is_authenticated`);
            if(data.success){
                setIsLoggedIn(true);
                getUserData();
            }
        } catch (error) {
            setIsLoggedIn(false); // token is not present
        }
    }

    const getUserData = async () => {
        try
        {
            const { data } = await axios.get(`${backend_url}/api/user/data`, { withCredentials: true });
            data.success ? setUserData({...data.userData}) : toast.error(data.error);
        } 
        catch (error) 
        {
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        }
    }

    // AppContext.js
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        const loggedIn = localStorage.getItem("isLoggedIn");

        if (storedUser && loggedIn === "true") {
            setUserData(JSON.parse(storedUser));
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        getAuthState();
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
