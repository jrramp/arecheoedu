import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockSignIn } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import '../styles/Auth.css';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If user is already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedInUser = await mockSignIn(email, password);
      localStorage.setItem('mockAuthUser', JSON.stringify(loggedInUser));
      // Wait a moment for AuthContext to update
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      if (errorMessage.includes('user-not-found')) {
        setError('User not found. Please register first or use: cyber@example.com');
      } else if (errorMessage.includes('wrong-password')) {
        setError('Incorrect password. Default: turtle2025');
      } else {
        setError(errorMessage);
      }
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>🏺 Relics Reimagined</h1>
        <h2>Login</h2>
        <div style={{ fontSize: '12px', color: '#666', backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          ℹ️ <strong>Demo Mode</strong>: Using test authentication (no Firebase needed)
        </div>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '5px', fontSize: '12px', color: '#004085' }}>
          <strong>Test Account:</strong><br />
          Email: cyber@example.com<br />
          Password: turtle2025
        </div>
        <p className="auth-link">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
