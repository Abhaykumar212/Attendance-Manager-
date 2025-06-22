// import tools
import {BrowserRouter as Router , Routes, Route} from "react-router-dom"
import React from "react"
import { Toaster } from "react-hot-toast";

//import pages
import Register from "../pages/Register"
import VerifyMail from "../pages/VerifyMail"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Phome from "../pages/Phome"
import Add_Attendacee from "../pages/Add_Attendance"
import Landing from "../pages/Landing"

export default function App(){
    return (
        <Router>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>

                {/* <Route path="/home" element={<Home/>}></Route> */}
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Home />} />
                <Route path="/phome" element={<Phome/>}></Route>
                <Route path="/register" element={<Register/>} />
                <Route path="/verifymail" element={<VerifyMail/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/add-attendance" element={<Add_Attendacee/>} />
            </Routes>
        </Router>
    )
}