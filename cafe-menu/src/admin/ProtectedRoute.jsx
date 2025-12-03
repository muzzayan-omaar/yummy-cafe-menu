import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // Not logged in, redirect to admin login
    return <Navigate to="/admin/login" replace />;
  }

  // Token exists, render child routes
  return <Outlet />;
}

export default ProtectedRoute;
