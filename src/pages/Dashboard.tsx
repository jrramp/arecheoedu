import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserActivityLogs, exportActivityLogs } from '../utils/activityTracker';
import '../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showActivityLog, setShowActivityLog] = useState(false);
  
  // Get user's activity logs
  const userActivityLogs = user?.uid ? getUserActivityLogs(user.uid) : [];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleExportLogs = () => {
    const filename = `activity_logs_${new Date().toISOString().split('T')[0]}.json`;
    exportActivityLogs(filename);
  };

  const getActivityIcon = (activity: string) => {
    switch (activity) {
      case 'presentation_entered': return '📊';
      case 'pre_quiz_started': return '📝';
      case 'post_quiz_started': return '✅';
      default: return '📌';
    }
  };

  const getActivityLabel = (activity: string) => {
    switch (activity) {
      case 'presentation_entered': return 'Entered Presentation';
      case 'pre_quiz_started': return 'Started Pre-Quiz';
      case 'post_quiz_started': return 'Started Post-Quiz';
      default: return 'Activity';
    }
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="nav-content">
          <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>🏛️ Relics Reimagined</h1>
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

        {/* Activity Log Section */}
        <div className="activity-section">
          <div className="activity-header">
            <h3>📋 Your Activity Log</h3>
            <button className="view-log-btn" onClick={() => setShowActivityLog(!showActivityLog)}>
              {showActivityLog ? '✕ Hide' : '👁️ View'}
            </button>
          </div>
          
          {/* Activity Statistics */}
          <div className="activity-stats">
            <div className="stat-box">
              <h4>Total Activities</h4>
              <p className="stat-value">{userActivityLogs.length}</p>
            </div>
            <div className="stat-box">
              <h4>Presentations</h4>
              <p className="stat-value">{userActivityLogs.filter(log => log.activity === 'presentation_entered').length}</p>
            </div>
            <div className="stat-box">
              <h4>Pre-Quizzes</h4>
              <p className="stat-value">{userActivityLogs.filter(log => log.activity === 'pre_quiz_started').length}</p>
            </div>
            <div className="stat-box">
              <h4>Post-Quizzes</h4>
              <p className="stat-value">{userActivityLogs.filter(log => log.activity === 'post_quiz_started').length}</p>
            </div>
          </div>

          {/* Activity Log Display */}
          {showActivityLog && userActivityLogs.length > 0 ? (
            <div className="activity-log-container">
              <div className="activity-log-header">
                <button className="export-btn" onClick={handleExportLogs}>
                  📥 Export as JSON
                </button>
              </div>
              <div className="activity-log-list">
                {userActivityLogs.slice().reverse().map((log) => (
                  <div key={log.id} className={`activity-log-item ${log.activity}`}>
                    <div className="activity-icon">{getActivityIcon(log.activity)}</div>
                    <div className="activity-details">
                      <div className="activity-name">{getActivityLabel(log.activity)}</div>
                      <div className="activity-presentation">{log.presentationName}</div>
                      <div className="activity-timestamp">{log.date} at {log.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : showActivityLog && userActivityLogs.length === 0 ? (
            <div className="no-activity">
              <p>No activities recorded yet. Start exploring presentations and taking quizzes!</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
