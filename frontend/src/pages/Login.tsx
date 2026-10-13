import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Local / client-side mock authentication
    navigate('/projects');
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container">
        <div className="login-card-header">
          <span className="login-subheading">Please enter your details</span>
          <h1 className="login-heading">Welcome back</h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-input-group">
            <input 
              type="email" 
              className="login-text-input" 
              placeholder="Email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="login-input-group">
            <input 
              type="password" 
              className="login-text-input" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="login-options-row">
            <label className="login-remember-label">
              <input 
                type="checkbox" 
                checked={remember} 
                onChange={(e) => setRemember(e.target.checked)} 
                className="login-checkbox"
              />
              <span>Remember for 30 days</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('Password reset placeholder'); }} className="login-forgot-link">
              Forgot password
            </a>
          </div>

          <button type="submit" className="login-btn-primary">
            Sign up
          </button>

          <button 
            type="button" 
            onClick={() => navigate('/projects')} 
            className="login-btn-google"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="google-icon">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Sign in with Google</span>
          </button>

          <div className="login-footer-text">
            <span>Don't have an account? </span>
            <Link to="/login" className="login-signup-link">Sign up</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
