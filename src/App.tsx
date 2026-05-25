import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/Login/Login';
import DashboardLayout from './layouts/DashboardLayout/DashboardLayout';
import Users from './pages/Users/Users';
import UserDetails from './pages/UserDetails/UserDetails';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import { isAuthenticated } from './services/authService';

/** Scrolls to the top on every route transition. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * PublicOnlyRoute — wraps the Login page.
 *
 * If the user is already authenticated, bounce them straight
 * to the dashboard so they never see the login form again.
 */
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  if (isAuthenticated()) {
    return <Navigate to="/users" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public — Login (redirects to /users if already logged in) */}
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />

        {/* Protected — Dashboard shell + sub-pages */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/users" replace />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetails />} />
          {/* Any unknown path inside the dashboard → /users */}
          <Route path="*" element={<Navigate to="/users" replace />} />
        </Route>

        {/* Root catch-all — unauthenticated → /login, authenticated → /users */}
        <Route
          path="*"
          element={
            isAuthenticated()
              ? <Navigate to="/users" replace />
              : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
