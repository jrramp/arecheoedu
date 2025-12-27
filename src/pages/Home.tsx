import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1>🏛️ Relics Reimagined</h1>
          <div className="nav-right">
            {user ? (
              <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
            ) : (
              <>
                <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
                <button className="nav-btn primary" onClick={() => navigate('/register')}>Register</button>
              </>
            )}
            <button className="nav-btn" onClick={() => navigate('/admin/setup')}>Setup</button>
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <h1>🏺 Welcome to the Archaeological Adventure</h1>
          <p className="tagline">Discover ancient artifacts, solve historical mysteries, and become a master archaeologist</p>
          
          <div className="hero-buttons">
            {user ? (
              <button className="hero-btn primary" onClick={() => navigate('/dashboard')}>
                Continue to Game →
              </button>
            ) : (
              <>
                <button className="hero-btn primary" onClick={() => navigate('/register')}>
                  Start Your Journey →
                </button>
                <button className="hero-btn secondary" onClick={() => navigate('/login')}>
                  Already have an account? Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>What You'll Experience</h2>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-emoji">🎮</div>
            <h3>Interactive Gameplay</h3>
            <p>Engage in exciting artifact discovery games with multiple levels and challenges</p>
          </div>
          <div className="feature">
            <div className="feature-emoji">📚</div>
            <h3>Educational Content</h3>
            <p>Learn about archaeology, ancient civilizations, and historical preservation</p>
          </div>
          <div className="feature">
            <div className="feature-emoji">🏆</div>
            <h3>Competitive Leaderboard</h3>
            <p>Compete with other players and track your progress on the global leaderboard</p>
          </div>
          <div className="feature">
            <div className="feature-emoji">🔒</div>
            <h3>Secure Authentication</h3>
            <p>Safe and secure login system to protect your account and game progress</p>
          </div>
          <div className="feature">
            <div className="feature-emoji">🌍</div>
            <h3>Global Community</h3>
            <p>Join a community of archaeology enthusiasts from around the world</p>
          </div>
          <div className="feature">
            <div className="feature-emoji">⭐</div>
            <h3>Rewards System</h3>
            <p>Earn points, unlock achievements, and progress through multiple difficulty levels</p>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2024 Relics Reimagined. Explore the past, shape the future.</p>
      </footer>
    </div>
  );
};

export default Home;
