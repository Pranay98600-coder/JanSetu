
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../services/authService';

function ProtectedRoute({ allowedRoles }) {

  // Check whether the user has a valid login session
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authService.getUser();

  // Check the user's role
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
