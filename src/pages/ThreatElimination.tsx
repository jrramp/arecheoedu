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

const ThreatElimination: React.FC<ThreatEliminationProps> = ({ onScoreSubmit, onBack }) => {
  const navigate = useNavigate();
  const { user, addScoreToLeaderboard, updateUserScore } = useAuth();

  const [gameState, setGameState] = useState<'levelSelect' | 'playing' | 'gameOver' | 'levelComplete'>('levelSelect');
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(60);
  const [score, setScore] = useState(0);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [eliminatedCount, setEliminatedCount] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [nextItemId, setNextItemId] = useState(0);
  const [totalThreatsToSpawn, setTotalThreatsToSpawn] = useState(0);

  const siteLevels: SiteLevel[] = [
    {
      id: 1,
      name: 'Desert Ruins',
      emoji: '🏜️',
      image: 'linear-gradient(135deg, rgba(232, 213, 196, 0.95) 0%, rgba(210, 180, 140, 0.95) 50%, rgba(196, 165, 123, 0.95) 100%), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 600%27%3E%3Crect width=%271200%27 height=%27600%27 fill=%27%23E8D5C4%27/%3E%3Crect y=%27350%27 width=%271200%27 height=%27250%27 fill=%27%23DEB887%27/%3E%3Cg fill=%27%23966633%27%3E%3Cpolygon points=%27300,350 400,200 500,350%27/%3E%3Cpolygon points=%27600,350 750,150 900,350%27/%3E%3Cpolygon points=%27150,380 200,300 250,380%27/%3E%3Crect x=%27350%27 y=%27280%27 width=%2760%27 height=%2770%27 fill=%27%23704020%27/%3E%3Crect x=%27750%27 y=%27200%27 width=%2750%27 height=%27150%27 fill=%27%23704020%27/%3E%3C/g%3E%3Cellipse cx=%27100%27 cy=%27100%27 rx=%2750%27 ry=%2760%27 fill=%27%23FFD89B%27 opacity=%270.8%27/%3E%3C/svg%3E")',
      threatCount: 5,
      timeLimit: 45,
      description: 'Protect ancient desert structures from erosion and looting'
    },
    {
      id: 2,
      name: 'Jungle Temple',
      emoji: '🌴',
      image: 'linear-gradient(135deg, rgba(102, 187, 106, 0.95) 0%, rgba(34, 139, 34, 0.95) 50%, rgba(18, 68, 18, 0.95) 100%), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 600%27%3E%3Crect width=%271200%27 height=%27600%27 fill=%27%2366BB6A%27/%3E%3Crect y=%27350%27 width=%271200%27 height=%27250%27 fill=%27%231a5c1a%27/%3E%3Cg fill=%27%237cb342%27%3E%3Ccircle cx=%27200%27 cy=%27300%27 r=%2780%27/%3E%3Ccircle cx=%27250%27 cy=%27250%27 r=%2770%27/%3E%3Ccircle cx=%27350%27 cy=%27280%27 r=%2785%27/%3E%3Ccircle cx=%27900%27 cy=%27320%27 r=%2790%27/%3E%3Ccircle cx=%27950%27 cy=%27260%27 r=%2775%27/%3E%3C/g%3E%3Cg fill=%27%23556B2F%27%3E%3Crect x=%27180%27 y=%27380%27 width=%2740%27 height=%27120%27/%3E%3Crect x=%27320%27 y=%27400%27 width=%2735%27 height=%27100%27/%3E%3Crect x=%27880%27 y=%27390%27 width=%2745%27 height=%27110%27/%3E%3C/g%3E%3Cpolygon points=%27500,200 650,400 350,400%27 fill=%27%23704020%27/%3E%3Crect x=%27480%27 y=%27250%27 width=%2740%27 height=%27150%27 fill=%27%23704020%27/%3E%3C/svg%3E")',
      threatCount: 7,
      timeLimit: 50,
      description: 'Stop threats from damaging hidden jungle archaeological sites'
    },
    {
      id: 3,
      name: 'Coastal Cave',
      emoji: '🏖️',
      image: 'linear-gradient(135deg, rgba(224, 246, 255, 0.95) 0%, rgba(168, 216, 234, 0.95) 50%, rgba(41, 128, 185, 0.95) 100%), url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 1200 600%27%3E%3Crect width=%271200%27 height=%27600%27 fill=%27%23E0F6FF%27/%3E%3Cellipse cx=%27600%27 cy=%27200%27 rx=%27150%27 ry=%27100%27 fill=%27%23FFD89B%27 opacity=%270.7%27/%3E%3Crect y=%27300%27 width=%271200%27 height=%27300%27 fill=%27%235BB3D5%27/%3E%3Cg fill=%27%238B4513%27%3E%3Cpolygon points=%270,300 150,200 300,300%27/%3E%3Cpolygon points=%27300,300 500,180 700,300%27/%3E%3Ccircle cx=%27100%27 cy=%27320%27 r=%2740%27 fill=%27%23704020%27/%3E%3Ccircle cx=%27600%27 cy=%27340%27 r=%2750%27 fill=%27%23704020%27/%3E%3C/g%3E%3Cellipse cx=%27500%27 cy=%27320%27 rx=%27150%27 ry=%27100%27 fill=%27%23A0522D%27 opacity=%270.6%27/%3E%3Cg stroke=%27%23FFFFFF%27 stroke-width=%272%27 fill=%27none%27%3E%3Cpath d=%27M 200 350 Q 220 330 240 350%27/%3E%3Cpath d=%27M 450 370 Q 470 350 490 370%27/%3E%3Cpath d=%27M 900 360 Q 920 340 940 360%27/%3E%3C/g%3E%3C/svg%3E")',
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
            <button className="instructions-btn" onClick={() => setShowInstructions(!showInstructions)}>
              📖 How to Play
            </button>
            <p className="level-subtitle">Protect archaeological sites from various threats within the time limit!</p>

            {showInstructions && (
              <div className="instructions-box">
                <h3>How to Play</h3>
                <ol>
                  <li>Select a difficulty level and archaeological site</li>
                  <li>Identify the threats (🎯 Looting, 💨 Erosion, ☠️ Pollution, 🏗️ Construction, ⛈️ Weather)</li>
                  <li>Click ONLY on threats to eliminate them - avoid artifacts!</li>
                  <li>Artifacts (golden glow) are valuable discoveries - clicking them costs you -100 points!</li>
                  <li>Each threat eliminated: +50 points</li>
                  <li>Eliminate all threats before time runs out</li>
                  <li>Earn bonus time points for remaining seconds</li>
                  <li>Complete all 3 levels to maximize your score</li>
                </ol>
                <p className="threat-legend">
                  <strong>Threats (RED borders):</strong> 🎯 Looting | 💨 Erosion | ☠️ Pollution | 🏗️ Construction | ⛈️ Weather<br/>
                  <strong>Artifacts (GOLD glow):</strong> Don't click! 🏺 Pottery | 🪙 Coins | 📜 Scrolls | ⬜ Tablets | 🗿 Statues
                </p>
              </div>
            )}

            <div className="levels-grid">
              {siteLevels.map(level => (
                <div
                  key={level.id}
                  className={`level-card ${completedLevels.includes(level.id) ? 'completed' : ''}`}
                  onClick={() => initializeLevel(level.id)}
                >
                  <div className="level-emoji">{level.emoji}</div>
                  <h3>{level.name}</h3>
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

        <div className="game-area" style={{ background: level.image }}>
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
        {onBack && (
          <Header onLogoClick={onBack}>
            <button className="back-btn" onClick={onBack}>← Back</button>
          </Header>
        )}
        {!onBack && (
          <Header onLogoClick={() => navigate('/dashboard')}>
            <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
          </Header>
        )}

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
