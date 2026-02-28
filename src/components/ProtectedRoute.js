// ===========================================
// ProtectedRoute - Redirects to login if not authenticated
// ===========================================
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // If no token, redirect to login page
  if (!token) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child component
  return children;
}

export default ProtectedRoute;
