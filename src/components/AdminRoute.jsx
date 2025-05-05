// src/components/AdminRoute.jsx
import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const location = useLocation();
  const roles = user?.["https://cruise-viewer.app/roles"];
  const isAdmin =
    (Array.isArray(roles) && roles.includes("admin")) ||
    roles?.role === "admin";

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated || !isAdmin) {
    console.warn("⛔ Access denied to", location.pathname);
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;
