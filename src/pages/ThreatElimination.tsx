import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/ThreatElimination.css';

interface Threat {
  id: number;
  x: number;
  y: number;
  type: 'looting' | 'erosion' | 'pollution' | 'construction' | 'weather';
  eliminated: boolean;
}

interface Artifact {
  id: number;
  x: number;
  y: number;
  name: string;
  icon: string;
  clicked: boolean;
}

interface SiteLevel {
  id: number;
  name: string;
  image: string;
  emoji: string;
  threatCount: number;
  timeLimit: number;
  description: string;
}

interface ThreatEliminationProps {
  onScoreSubmit?: (score: number) => void;
  onBack?: () => void;
}

const ThreatElimination: React.FC<ThreatEliminationProps> = ({ onScoreSubmit }) => {
  const navigate = useNavigate();
  const { user, addScoreToLeaderboard, updateUserScore } = useAuth();

  const [gameState, setGameState] = useState<'levelSelect' | 'playing' | 'gameOver' | 'levelComplete'>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [score, setScore] = useState(0);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [eliminatedCount, setEliminatedCount] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [nextItemId, setNextItemId] = useState(0);
  const [totalThreatsToSpawn, setTotalThreatsToSpawn] = useState(0);

  const siteLevels: SiteLevel[] = [
    {
      id: 1,
      name: 'Desert Ruins',
      emoji: '🏜️',
      image: 'url("/desert-ruins.jpg")',
      threatCount: 5,
      timeLimit: 45,
      description: 'Protect ancient desert structures from erosion and looting'
    },

    {
      id: 2,
      name: 'Jungle Temple',
      emoji: '🌴',
      image: 'url("/archaeologyedu/jungle-temple.jpg")',
      threatCount: 7,
      timeLimit: 50,
      description: 'Stop threats from damaging hidden jungle archaeological sites'
    },
    {
      id: 3,
      name: 'Coastal Cave',
      emoji: '🏖️',
      image: 'url("/coastal-cave.jpg")',
      threatCount: 9,
      timeLimit: 55,
      description: 'Defend coastal caves from erosion and pollution'
    }
  ];

  const threatTypes = [
    { type: 'looting' as const, icon: '🎯', label: 'Looting', color: '#FF6B6B' },
    { type: 'erosion' as const, icon: '💨', label: 'Erosion', color: '#FFA500' },
    { type: 'pollution' as const, icon: '☠️', label: 'Pollution', color: '#9B59B6' },
    { type: 'construction' as const, icon: '🏗️', label: 'Construction', color: '#E74C3C' },
    { type: 'weather' as const, icon: '⛈️', label: 'Weather', color: '#3498DB' }
  ];

  const artifactTypes = [
    { name: 'Ancient Pottery', icon: '🏺' },
    { name: 'Golden Coin', icon: '🪙' },
    { name: 'Scrolls', icon: '📜' },
    { name: 'Stone Tablet', icon: '⬜' },
    { name: 'Statue', icon: '🗿' }
  ];

  // Initialize level
  const initializeLevel = (levelId: number) => {
    const level = siteLevels.find(l => l.id === levelId);
    if (!level) return;

    setSelectedLevel(levelId);
    setGameState('playing');
    setScore(0);
    setEliminatedCount(0);
    setTimeRemaining(level.timeLimit);
    setTotalThreatsToSpawn(level.threatCount);
    setNextItemId(0);
    setThreats([]);
    setArtifacts([]);
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameState('gameOver');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Spawning effect - spawn threats and artifacts one at a time
  useEffect(() => {
    if (gameState !== 'playing' || !selectedLevel) return;

    let itemCounter = nextItemId;

    const spawnInterval = setInterval(() => {
      // Randomly decide if we spawn a threat or artifact
      const spawnThreat = Math.random() > 0.4; // 60% chance threat, 40% artifact
      
      if (spawnThreat) {
        setThreats(prev => {
          if (prev.length < totalThreatsToSpawn) {
            const newThreat: Threat = {
              id: itemCounter,
              x: Math.random() * 80 + 10,
              y: Math.random() * 70 + 15,
              type: threatTypes[Math.floor(Math.random() * threatTypes.length)].type,
              eliminated: false
            };
            itemCounter++;
            setNextItemId(itemCounter);
            return [...prev, newThreat];
          }
          return prev;
        });
      } else {
        setArtifacts(prev => {
          const artifact = artifactTypes[Math.floor(Math.random() * artifactTypes.length)];
          const newArtifact: Artifact = {
            id: itemCounter,
            x: Math.random() * 80 + 10,
            y: Math.random() * 70 + 15,
            name: artifact.name,
            icon: artifact.icon,
            clicked: false
          };
          itemCounter++;
          setNextItemId(itemCounter);
          return [...prev, newArtifact];
        });
      }
    }, 1500); // Spawn every 1.5 seconds

    return () => clearInterval(spawnInterval);
  }, [gameState, selectedLevel, totalThreatsToSpawn]);

  // Check win condition
  useEffect(() => {
    if (gameState === 'playing' && threats.length > 0 && eliminatedCount === threats.length && threats.length >= totalThreatsToSpawn) {
      setGameState('levelComplete');
      const levelScore = 100 + (timeRemaining * 10);
      setScore(levelScore);
      if (selectedLevel) {
        setCompletedLevels([...completedLevels, selectedLevel]);
      }
    }
  }, [eliminatedCount, threats, gameState, timeRemaining, selectedLevel, completedLevels, totalThreatsToSpawn]);

  const handleThreatClick = (threatId: number) => {
    if (gameState !== 'playing') return;

    const updated = threats.map(t => 
      t.id === threatId ? { ...t, eliminated: true } : t
    );
    setThreats(updated);
    setEliminatedCount(updated.filter(t => t.eliminated).length);
    setScore(score + 50);
  };

  const handleArtifactClick = (artifactId: number) => {
    if (gameState !== 'playing') return;

    // Clicking an artifact is bad - lose points!
    const updated = artifacts.map(a =>
      a.id === artifactId ? { ...a, clicked: true } : a
    );
    setArtifacts(updated);
    setScore(Math.max(0, score - 100)); // Lose 100 points, min 0
  };

  const getThreatIcon = (type: string) => {
    const threat = threatTypes.find(t => t.type === type);
    return threat?.icon || '⚠️';
  };

  const getThreatColor = (type: string) => {
    const threat = threatTypes.find(t => t.type === type);
    return threat?.color || '#999';
  };

  if (gameState === 'levelSelect') {
    return (
      <div className="threat-container">

        <div className="threat-content">
          <div className="level-selection">
            <h2>🛡️ Threat Elimination Challenge</h2>
            <p className="level-subtitle">Protect archaeological sites from various threats within the time limit!</p>

            <div className="levels-grid">
              {siteLevels.map(level => (
                <div
                  key={level.id}
                  className={`level-card ${completedLevels.includes(level.id) ? 'completed' : ''}`}
                  onClick={() => initializeLevel(level.id)}
                >
                  <div className="level-emoji">{level.emoji}</div>
                  <h3>Phase 3: Level {level.id} - {level.name}</h3>
                  <p className="level-description">{level.description}</p>
                  <div className="level-stats">
                    <span>⏱️ {level.timeLimit}s</span>
                    <span>⚠️ {level.threatCount} threats</span>
                  </div>
                  {completedLevels.includes(level.id) && <div className="completed-badge">✓ Completed</div>}
                  <button className="play-btn">Play Level {level.id}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing' && selectedLevel) {
    const level = siteLevels.find(l => l.id === selectedLevel);
    if (!level) return null;

    return (
      <div className="threat-container">
        <div className="game-navbar">
          <h2>🛡️ {level.name} - Threat Elimination</h2>
          <div className="game-stats">
            <span>⏱️ Time: {timeRemaining}s</span>
            <span>✓ Eliminated: {eliminatedCount}/{threats.length}</span>
            <span>📍 Spawned: {threats.length}/{level.threatCount}</span>
            <span>⭐ Score: {score}</span>
          </div>
        </div>

        <div className="game-area" style={{ backgroundImage: level.image }}>
          {threats.map(threat => (
            <button
              key={`threat-${threat.id}`}
              className={`threat-marker ${threat.eliminated ? 'eliminated' : ''}`}
              style={{
                left: `${threat.x}%`,
                top: `${threat.y}%`,
                borderColor: getThreatColor(threat.type)
              }}
              onClick={() => handleThreatClick(threat.id)}
              title={threat.type}
            >
              {!threat.eliminated && <span className="threat-icon">{getThreatIcon(threat.type)}</span>}
              {threat.eliminated && <span className="eliminated-icon">✓</span>}
            </button>
          ))}

          {artifacts.map(artifact => (
            <button
              key={`artifact-${artifact.id}`}
              className={`artifact-marker ${artifact.clicked ? 'clicked' : ''}`}
              style={{
                left: `${artifact.x}%`,
                top: `${artifact.y}%`
              }}
              onClick={() => handleArtifactClick(artifact.id)}
              title={`${artifact.name} - Don't click!`}
            >
              {!artifact.clicked && <span className="artifact-icon">{artifact.icon}</span>}
              {artifact.clicked && <span className="artifact-penalty">-100</span>}
            </button>
          ))}
          
          <div className="threat-timer">
            <div className={`timer ${timeRemaining < 10 ? 'danger' : ''}`}>
              {timeRemaining}s
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'levelComplete' && selectedLevel) {
    const nextLevel = siteLevels.find(l => l.id === selectedLevel + 1);

    return (
      <div className="threat-container">

        <div className="threat-content">
          <div className="completion-screen">
            <div className="completion-header success">
              <div className="completion-emoji">🎉</div>
              <h2>Level Complete!</h2>
              <p>Threats eliminated: {eliminatedCount}/{threats.length}</p>
            </div>

            <div className="final-stats">
              <div className="score-display">
                <h3>Level Score</h3>
                <div className="score-value">{score}</div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="play-again-btn" onClick={() => setGameState('levelSelect')}>
                🔄 Return to Levels
              </button>
              {nextLevel && (
                <button className="next-btn" onClick={() => initializeLevel(nextLevel.id)}>
                  ➜ Next Level: {nextLevel.name}
                </button>
              )}
              {!nextLevel && (
                <button className="leaderboard-btn" onClick={() => {
                  const totalScore = score + (completedLevels.length * 100);
                  if (onScoreSubmit) {
                    onScoreSubmit(totalScore);
                  } else {
                    updateUserScore(totalScore);
                    addScoreToLeaderboard(user?.displayName || 'Anonymous', totalScore);
                    navigate('/leaderboard');
                  }
                }}>
                  🏆 Submit Score to Leaderboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver' && selectedLevel) {
    return (
      <div className="threat-container">


        <div className="threat-content">
          <div className="completion-screen">
            <div className="completion-header failure">
              <div className="completion-emoji">⏰</div>
              <h2>Time's Up!</h2>
              <p>Threats eliminated: {eliminatedCount}/{threats.length}</p>
            </div>

            <div className="final-stats">
              <div className="score-display">
                <h3>Score Earned</h3>
                <div className="score-value">{score}</div>
              </div>
              <p className="try-again-message">Eliminate all threats before time runs out!</p>
            </div>

            <div className="action-buttons">
              <button className="play-again-btn" onClick={() => initializeLevel(selectedLevel)}>
                🔄 Try Again
              </button>
              <button className="back-menu-btn" onClick={() => setGameState('levelSelect')}>
                ← Back to Levels
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default ThreatElimination;
