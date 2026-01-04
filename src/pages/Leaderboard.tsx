import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { LeaderboardEntry } from '../context/AuthContext';
import Header from '../components/Header';
import '../styles/Leaderboard.css';

interface DisplayEntry extends LeaderboardEntry {
  rank: number;
}

const Leaderboard: React.FC = () => {
  const navigate = useNavigate();
  const { getLeaderboard } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<DisplayEntry[]>([]);

  useEffect(() => {
    const savedScores = getLeaderboard();
    const displayData: DisplayEntry[] = savedScores.map((entry, index) => ({
      ...entry,
      rank: index + 1
    }));
    setLeaderboardData(displayData);
  }, [getLeaderboard]);

  return (
    <div className="leaderboard-container">
      <Header 
        onLogoClick={() => navigate('/dashboard')}
      >
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </Header>

      <div className="leaderboard-content">
        <h2>🏆 Leaderboard</h2>
        <p className="subtitle">Top Archaeologists</p>

        <div className="leaderboard-table">
          <div className="table-header">
            <div className="col rank">Rank</div>
            <div className="col name">Name</div>
            <div className="col score">Score</div>
            <div className="col date">Date</div>
          </div>

          {leaderboardData.length === 0 ? (
            <div className="no-scores">
              <p>No scores yet. Play the game to get on the leaderboard!</p>
            </div>
          ) : (
            leaderboardData.map((entry) => (
              <div key={`${entry.name}-${entry.date}`} className={`table-row ${entry.rank <= 3 ? 'top-' + entry.rank : ''}`}>
                <div className="col rank">
                  {entry.rank <= 3 ? (
                    <span className="medal">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    entry.rank
                  )}
                </div>
                <div className="col name">{entry.name}</div>
                <div className="col score"><strong>{entry.score}</strong></div>
                <div className="col date">{entry.date}</div>
              </div>
            ))
          )}
        </div>

        <div className="stats-info">
          <h3>📊 How Scoring Works</h3>
          <ul>
            <li><strong>Memory Match:</strong> Correctly match artifact pairs to earn points</li>
            <li><strong>Scoring Formula:</strong> Base artifact points × Level multiplier (Level 1×1, Level 2×2, Level 3×3)</li>
            <li><strong>Rarity Bonus:</strong> Rare and legendary artifacts are worth more points than common ones</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
