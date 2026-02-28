// ===========================================
// Login Page - Admin authentication (FIXED)
// ===========================================
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, getProfile } from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await loginUser({ email, password });

      // Store token first
      localStorage.setItem('token', res.data.token);

      // Fetch full profile to get username
      try {
        const profileRes = await getProfile();
        const userData = {
          ...res.data,
          username: profileRes.data.name || profileRes.data.username || res.data.name || res.data.username || email.split('@')[0],
        };
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (profileErr) {
        // If profile fetch fails, use login response data
        const userData = {
          ...res.data,
          username: res.data.name || res.data.username || email.split('@')[0],
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }

      window.dispatchEvent(new Event('authChange'));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to access the Admin Dashboard</p>
        </div>

        {error && (
          <div className="error-message">
            <span className="error-icon">!</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className={error && !email ? 'input-error' : ''}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className={error && !password ? 'input-error' : ''}
            />
          </div>

          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Log In'}
          </button>
        </form>

        <div className="test-accounts">
          <p className="test-title">Test Accounts:</p>
          <p>Host: john@test.com / password123</p>
          <p>Admin: jane@test.com / password321</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
