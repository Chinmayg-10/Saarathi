// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { setToken } from './api';

// --- Page Imports ---
import Login from './pages/Login';
import LandingPage from './pages/LandingPage'; 
import FieldDashboard from './pages/FieldDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PublicDashboard from './pages/PublicDashboard';


const initialToken = localStorage.getItem('token');
if (initialToken) setToken(initialToken);

function Protected({ children, requiredRole }) {
    // Retrieve user and token from local storage
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    
    // Fallback in case of parsing error
    let user = null;
    try {
        if (userString) {
            user = JSON.parse(userString);
        }
    } catch (e) {
        console.error("Error parsing user data:", e);
    }
    
    // 1. Check for Authentication (Token/User presence)
    if (!token || !user) {
        // Clear potential stale token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }

    // 2. Check for Role Authorization
    if (requiredRole && user.role !== requiredRole) {
        // Logged in, but wrong role (e.g., Officer trying to access /admin)
        console.warn(`Access denied. User role: ${user.role}. Required role: ${requiredRole}`);
        // Redirect to a dashboard they *do* have access to, or back to login
        const destination = user.role === 'field' ? '/field' : user.role === 'admin' ? '/admin' : '/login';
        return <Navigate to={destination} replace />;
    }

    // Access granted
    return children;
}

export default function App() {
    return (
        <Routes>
            {/* Public/Unprotected Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<LandingPage />} /> 
            <Route path="/public" element={<PublicDashboard />} />
            
            {/* Protected Routes (Requires Authentication) */}
            
            {/* Field Officer Dashboard */}
            <Route 
                path="/field" 
                element={
                    <Protected requiredRole="officer">
                        <FieldDashboard />
                    </Protected>
                } 
            />
            
            {/* Admin Dashboard */}
            <Route 
                path="/admin" 
                element={
                    <Protected requiredRole="admin">
                        <AdminDashboard />
                    </Protected>
                } 
            />

            {/* Default Redirect for authenticated users attempting to access root, if not public */}
            <Route 
                path="*" 
                element={<Navigate to="/" />} 
            />
            
        </Routes>
    );
}
