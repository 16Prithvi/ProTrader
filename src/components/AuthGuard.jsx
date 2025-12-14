import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard({ children }) {
    const { currentUser, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="h-screen w-full flex items-center justify-center bg-background text-primary">Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}
