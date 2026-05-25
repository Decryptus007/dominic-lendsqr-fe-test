import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/authService';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // If the user was redirected here from a protected route, send them
  // back there after login. Otherwise fall back to /users.
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/users';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* ── Left Panel ── */}
      <div className="login-left">
        <div className="login-left__logo">
          <img src="/auth/logo.svg" alt="lendsqr" />
        </div>
        <div className="login-left__illustration">
          <img
            src="/auth/login-thumbnail.svg"
            alt="Sign in illustration"
          />
        </div>
      </div>

      {/* ── Right Panel (Form) ── */}
      <div className="login-right">
        <div className="login-right__logo-mobile">
          <img src="/auth/logo.svg" alt="lendsqr" />
        </div>
        <div className="login-form">
          <h1 className="login-form__title">Welcome!</h1>
          <p className="login-form__subtitle">Enter details to login.</p>

          {error && (
            <div className="login-form__error" role="alert">
              <i className="fa-solid fa-circle-exclamation" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="login-form__input-group">
              <input
                id="email"
                type="email"
                className="login-form__input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div className="login-form__input-group">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-form__input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="login-form__toggle-pw"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <a href="#" className="login-form__forgot">
              FORGOT PASSWORD?
            </a>

            <button
              type="submit"
              className={`login-form__cta${isLoading ? ' login-form__cta--loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  <span>Logging in…</span>
                </>
              ) : (
                'LOG IN'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
