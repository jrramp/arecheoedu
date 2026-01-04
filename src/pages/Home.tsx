import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import '../styles/Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      emoji: '🎮',
      title: 'Interactive Gameplay',
      description: 'Engage in exciting artifact discovery games with multiple levels and challenges'
    },
    {
      emoji: '📚',
      title: 'Educational Content',
      description: 'Learn about archaeology, ancient civilizations, and historical preservation'
    },
    {
      emoji: '🏆',
      title: 'Competitive Leaderboard',
      description: 'Compete with other players and track your progress on the global leaderboard'
    },
    {
      emoji: '🌍',
      title: 'Global Community',
      description: 'Join a community of archaeology enthusiasts from around the world'
    }
  ];

  return (
    <div className="home-container">
      <Header 
        onLogoClick={() => navigate('/')}
      >
        {user ? (
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
        ) : (
          <>
            <button className="nav-btn" onClick={() => navigate('/login')}>Login</button>
            <button className="nav-btn primary" onClick={() => navigate('/register')}>Register</button>
          </>
        )}
        <button className="nav-btn" onClick={() => navigate('/admin/setup')}>Setup</button>
      </Header>

      <div className="hero-section">
        <div className="hero-content">
          <h1>🏺 Welcome to the Archaeological Adventure</h1>
          <p className="tagline">Discover ancient artifacts, solve historical mysteries, and become a master archaeologist</p>
          
          <div className="hero-buttons">
            {user ? (
              <button className="hero-btn primary" onClick={() => navigate('/dashboard')}>
                Explore →
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

      <div className="section-header">
        <h2>What You'll Experience</h2>
        <p className="features-subtitle">Explore interactive features and engaging content designed for archaeology enthusiasts</p>
      </div>

      <div className="features-section">
        <div className="features-tabs">
          <div className="tab-buttons">
            {features.map((feature, index) => (
              <button
                key={index}
                className={`tab-btn ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                <span className="tab-emoji">{feature.emoji}</span>
                <span className="tab-label">{feature.title}</span>
              </button>
            ))}
          </div>
          <div className="tab-content">
            <div className="feature-display">
              <div className="feature-emoji">{features[activeTab].emoji}</div>
              <h3>{features[activeTab].title}</h3>
              <p>{features[activeTab].description}</p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>&copy; 2026 Relics Reimagined. Explore the past, shape the future.</p>
      </footer>
    </div>
  );
};

export default Home;
