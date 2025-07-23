// import tools
import {BrowserRouter as Router , Routes, Route} from "react-router-dom"
import React from "react"
import { Toaster } from "react-hot-toast";

// import route protection components
import ProtectedRoute from "../components/ProtectedRoute"
import PublicRoute from "../components/PublicRoute"
import RoleProtectedRoute from "../components/RoleProtectedRoute"

//import pages
import Register from "../pages/Register"
import VerifyMail from "../pages/VerifyMail"
import Login from "../pages/Login"
import Home from "../pages/Home"
import Phome from "../pages/Phome"
import Add_Attendacee from "../pages/Add_Attendance"
import Landing from "../pages/Landing"
import ForgotPassword from "../pages/ForgotPassword"
import ResetPassword from "../pages/ResetPassword"
import QRGenerator from "../pages/QRGenerator"
import QRScanner from "../pages/QRScanner"

export default function App(){
    return (
        <Router>
            <Toaster position="top-right" reverseOrder={false} />
            <Routes>
                {/* Public routes - accessible to everyone */}
                <Route path="/" element={<Landing />} />
                <Route path="/verifymail" element={<VerifyMail/>} />
                
                {/* Public routes - only accessible when NOT logged in */}
                <Route path="/register" element={
                    <PublicRoute>
                        <Register/>
                    </PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute>
                        <Login/>
                    </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                    <PublicRoute>
                        <ForgotPassword/>
                    </PublicRoute>
                } />
                <Route path="/reset-password" element={
                    <PublicRoute>
                        <ResetPassword/>
                    </PublicRoute>
                } />
                
                {/* Professor-only routes (admin can also access) */}
                <Route path="/phome" element={
                    <RoleProtectedRoute allowedRoles={['professor', 'admin']}>
                        <Phome/>
                    </RoleProtectedRoute>
                } />
                <Route path="/add-attendance" element={
                    <RoleProtectedRoute allowedRoles={['professor', 'admin']}>
                        <Add_Attendacee/>
                    </RoleProtectedRoute>
                } />
                <Route path="/qr-generator" element={
                    <RoleProtectedRoute allowedRoles={['professor', 'admin']}>
                        <QRGenerator/>
                    </RoleProtectedRoute>
                } />
                
                {/* Student-only routes (admin can also access) */}
                <Route path="/home" element={
                    <RoleProtectedRoute allowedRoles={['student', 'admin']}>
                        <Home/>
                    </RoleProtectedRoute>
                } />
                <Route path="/qr-scanner" element={
                    <RoleProtectedRoute allowedRoles={['student', 'admin']}>
                        <QRScanner/>
                    </RoleProtectedRoute>
                } />
                
                {/* Catch all route - redirect based on role */}
                <Route path="/*" element={<Landing />} />
            </Routes>
        </Router>
    )
}