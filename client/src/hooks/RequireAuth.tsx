import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { JSX } from "react";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return null;

  if (!isAuthenticated && !isLoading) {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    return <Navigate to="/signup" replace />;
  }

  return children;
};

export default RequireAuth;
