import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // Safely parse the stored user object
  let user = null;
  try {
    const storedUser = localStorage.getItem("user");
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch (err) {
    user = null;
  }

  // 1. Not logged in -> redirect to login/landing
  if (!token) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // 2. Route requires a specific role (e.g. 'admin') and user doesn't match
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;