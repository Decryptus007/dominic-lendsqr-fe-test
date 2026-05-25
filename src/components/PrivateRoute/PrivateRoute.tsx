import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../../services/authService';

/**
 * PrivateRoute — wraps protected content.
 *
 * If the user has no valid session, they are redirected to /login.
 * The current `location` is passed as state so after login they can
 * be sent back to the page they originally tried to visit.
 */
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
