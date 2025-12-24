import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1>🏛️ Relics Reimagined</h1>
          <div className="nav-right">
            <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h2>Welcome to the Archaeological Adventure!</h2>
          <p>Explore ancient ruins, discover hidden artifacts, and become a master archaeologist.</p>
        </div>

        <div className="game-options">
          <div className="option-card">
            <div className="option-emoji">🎮</div>
            <h3>Play Game</h3>
            <p>Start your archaeological expedition and discover ancient artifacts.</p>
            <button 
              className="option-btn"
              onClick={() => navigate('/game')}
            >
              Start Game
            </button>
          </div>

          <div className="option-card">
            <div className="option-emoji">�</div>
            <h3>Curriculum</h3>
            <p>Access educational materials and PowerPoint presentations.</p>
            <button 
              className="option-btn"
              onClick={() => navigate('/curriculum')}
            >
              View Curriculum
            </button>
          </div>

          <div className="option-card">
            <div className="option-emoji">�📊</div>
            <h3>Leaderboard</h3>
            <p>See how you compare with other archaeologists.</p>
            <button 
              className="option-btn"
              onClick={() => navigate('/leaderboard')}
            >
              View Scores
            </button>
          </div>

          <div className="option-card">
            <div className="option-emoji">ℹ️</div>
            <h3>About</h3>
            <p>Learn more about archaeology and this game.</p>
            <button 
              className="option-btn"
              onClick={() => navigate('/about')}
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="info-section">
          <h3>🌍 About Archaeology</h3>
          <p>
            Archaeology is the study of past human societies through physical remains. 
            In this game, you'll search for artifacts, decode ancient mysteries, and 
            contribute to our understanding of ancient civilizations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
