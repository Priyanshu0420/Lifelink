import { Navigate } from "react-router-dom";
import { isLoggedIn, hasRole } from "../services/auth";


function ProtectedRoute({ children, allowedRoles }) {

  // User is not logged in
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }


  // Check role
  if (allowedRoles && allowedRoles.length > 0) {

    const hasAllowedRole = allowedRoles.some((role) =>
      hasRole(role)
    );

    if (!hasAllowedRole) {
      return <Navigate to="/" replace />;
    }
  }


  return children;
}


export default ProtectedRoute;