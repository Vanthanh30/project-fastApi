// src/components/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import adminService from '../service/adminService';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const isAuthenticated = adminService.isAuthenticated();

    useEffect(() => {
        // Optional: Log khi user cố gắng truy cập protected route
        if (!isAuthenticated) {
            console.log('Unauthorized access attempt to:', location.pathname);
        }
    }, [isAuthenticated, location]);

    if (!isAuthenticated) {
        // Redirect to login và lưu location để redirect về sau khi login
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute;