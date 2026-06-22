import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  allowedRoles,
  userRole,
}) => {

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;