import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.scss';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login submitted', { email, password });
    navigate('/users');
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

          <form onSubmit={handleSubmit}>
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
              />
              <button
                type="button"
                className="login-form__toggle-pw"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>

            <a href="#" className="login-form__forgot">
              FORGOT PASSWORD?
            </a>

            <button type="submit" className="login-form__cta">
              LOG IN
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
