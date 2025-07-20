import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to login with admin hint
  if (!user) {
    return <Navigate to="/login?admin=true" replace />;
  }

  // If logged in and is admin, redirect to admin dashboard
  if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // If logged in but not admin, redirect to regular listings
  return <Navigate to="/listings" replace />;
};

export default AdminRedirect;
