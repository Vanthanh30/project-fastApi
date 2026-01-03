import React, { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import adminService from '../service/admin/authService';

const ProtectedRoute = memo(({ children }) => {
    const location = useLocation();
    const isAuthenticated = adminService.isAuthenticated();

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    return children;
});

ProtectedRoute.displayName = 'ProtectedRoute';

export default ProtectedRoute;