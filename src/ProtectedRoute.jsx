// src/components/ProtectedRoute.js
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './context/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, login } = useContext(UserContext);

    useEffect(() => {
        // Check if there's a stored user in localStorage and login the user if available
        const storedUser = localStorage.getItem('user');
        if (storedUser && !user) {
            login(JSON.parse(storedUser)); // Re-authenticate using localStorage data
        }
    }, [user, login]);

    if (!user && !localStorage.getItem('user')) {
        return <Navigate to="/login" />;
    }

    return children;
};

export default ProtectedRoute;
