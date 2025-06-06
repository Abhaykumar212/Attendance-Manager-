// import tools
import {BrowserRouter as Router , Routes, Route} from "react-router-dom"
import React from "react"

//import pages
import Register from "../pages/Register"
import VerifyMail from "../pages/VerifyMail"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Phome from "../pages/Phome"

export default function App(){
    return (
        <Router>
            <Routes>

                {/* <Route path="/home" element={<Home/>}></Route> */}
                <Route path="/students/:rollNo" element={<Home />} />
                <Route path="/phome" element={<Phome/>}></Route>
                <Route path="/register" element={<Register/>} />
                <Route path="/verifymail" element={<VerifyMail/>} />
                <Route path="/login" element={<Login/>} />
            </Routes>
        </Router>
    )
}