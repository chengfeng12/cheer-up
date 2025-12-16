import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useHybridStore } from "../../store/useHybridStore";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { isAuthenticated, validateAuth } = useHybridStore();
  const location = useLocation();

  useEffect(() => {
    // Optionally validate token on mount?
    // For now we trust the store state,
    // but typically we might want to check if token is expired.
    validateAuth();
  }, [validateAuth]);

  if (!isAuthenticated) {
    // Redirect to login page but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
