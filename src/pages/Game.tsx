import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Game.css';

interface ArtifactData {
  id: number;
  name: string;
  emoji: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  basePoints: number;
  facts: {
    origin: string;
    siteImpact: string;
    culturalSignificance: string;
    historicalPeriod: string;
    additionalFact: string;
  };
}

interface Card {
  id: number;
  artifactId: number;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameLevel {
  level: number;
  pairs: number;
  artifacts: ArtifactData[];
}

const artifactDatabase: Record<number, ArtifactData> = {
  1: {
    id: 1,
    name: 'Well-Preserved Pottery in Stable Soil',
    emoji: '🏺',
    rarity: 'common',
    basePoints: 10,
    facts: {
      origin: 'Neolithic pottery from Mesopotamia around 7000 BCE buried in stable clay-rich soil',
      siteImpact: 'Demonstrates excellent site integrity - physical geology of stable clay soil prevents ceramic degradation and maintains stratigraphy over millennia',
      culturalSignificance: 'Pottery vessels reveal daily life and settlement patterns when preserved in good site integrity conditions',
      historicalPeriod: 'Neolithic Age (10,000 - 3000 BCE)',
      additionalFact: 'Physical geology factor: Clay-based soils with neutral pH maintain site integrity by preventing ceramic cracking and chemical weathering of pottery'
    }
  },
  2: {
    id: 2,
    name: 'Flint Tool (Weathered Surface)',
    emoji: '🔨',
    rarity: 'common',
    basePoints: 15,
    facts: {
      origin: 'Paleolithic flint tool approximately 2.6 million years old exposed to surface weathering',
      siteImpact: 'Shows poor site integrity - exposed to environmental geology (rain, wind, freeze-thaw cycles) causing physical weathering and surface alteration',
      culturalSignificance: 'Stone tools survive better than organic materials but surface exposure damages fine details needed for cultural analysis',
      historicalPeriod: 'Paleolithic Age (2.6 million - 10,000 years ago)',
      additionalFact: 'Environmental geology factor: Exposure to weathering processes (oxidation, hydration, micro-fracturing) reduces site integrity and damages archaeological information'
    }
  },
  3: {
    id: 3,
    name: 'Bone Harpoon (Waterlogged Deposit)',
    emoji: '🦴',
    rarity: 'uncommon',
    basePoints: 25,
    facts: {
      origin: 'Upper Paleolithic bone harpoon preserved in waterlogged archaeological deposit for 40,000 years',
      siteImpact: 'Exceptional site integrity maintained by anaerobic (oxygen-free) environmental geology - wet conditions prevent bacterial decomposition of bone',
      culturalSignificance: 'Waterlogged sites preserve organic materials impossible to find in dry contexts, revealing complete hunting tools and wood artifacts',
      historicalPeriod: 'Upper Paleolithic (40,000 - 10,000 years ago)',
      additionalFact: 'Environmental geology factor: Anoxic waterlogged environments create ideal preservation by preventing aerobic decay - excellent site integrity from stable hydrology'
    }
  },
  4: {
    id: 4,
    name: 'Copper Furnace Slag',
    emoji: '⚔️',
    rarity: 'uncommon',
    basePoints: 30,
    facts: {
      origin: 'Metallurgical slag from Anatolian copper furnaces around 6000 BCE showing early smelting technology',
      siteImpact: 'Industrial by-products preserve site integrity and historical geology context - slag layers create distinct stratigraphic markers for chronological dating',
      culturalSignificance: 'Evidence of technological innovation and transition from Stone Age to Metal Ages in human history',
      historicalPeriod: 'Chalcolithic (Copper-Stone Age) - Bronze Age (5000 - 1000 BCE)',
      additionalFact: 'Historical geology factor: Slag accumulations establish temporal sequences and reveal ore sources through chemical analysis, maintaining site integrity through distinctive layers'
    }
  },
  5: {
    id: 5,
    name: 'Jade Figurine (Minerologically Stable)',
    emoji: '💚',
    rarity: 'rare',
    basePoints: 50,
    facts: {
      origin: 'Jade (mineral silicate) carved figurine from Neolithic China around 5000 BCE with exceptional hardness',
      siteImpact: 'Demonstrates excellent site integrity - mineral properties of jade resist weathering, hydration, and chemical alteration over 7,000 years',
      culturalSignificance: 'Jade\'s rarity, hardness, and resistance to degradation made it spiritually valuable and ensured preservation of carved details and artistic information',
      historicalPeriod: 'Neolithic China (8000 - 2000 BCE)',
      additionalFact: 'Physical geology factor: Crystalline mineral structure of jade resists environmental weathering - monocrystalline silicate properties maintain site integrity and artifact clarity'
    }
  },
  6: {
    id: 6,
    name: 'Cuneiform Clay Tablet (Fired)',
    emoji: '📋',
    rarity: 'uncommon',
    basePoints: 35,
    facts: {
      origin: 'Fired clay tablet from Mesopotamia around 3200 BCE - intentional or accidental heat hardening dramatically improved preservation',
      siteImpact: 'Physical geology of fired clay creates durable ceramic material maintaining excellent site integrity; clay minerals undergo phase changes when heated, improving durability',
      culturalSignificance: 'Writing system invented by Sumerians - clay tablets preserve direct textual evidence of administration, laws, and beliefs',
      historicalPeriod: 'Bronze Age Mesopotamia (3200 BCE onwards)',
      additionalFact: 'Physical geology factor: Firing reorganizes clay minerals (dehydration of clay minerals) creating stronger ceramic structure with superior site integrity and resistance to decay'
    }
  },
  7: {
    id: 7,
    name: 'Sealed Royal Tomb (Valley of Kings)',
    emoji: '👑',
    rarity: 'rare',
    basePoints: 75,
    facts: {
      origin: 'Sealed royal tomb from Valley of the Kings, Egypt around 1300 BCE - geological formation in stable limestone bedrock',
      siteImpact: 'Exceptional site integrity maintained by: stable bedrock geology (limestone), sealed chamber environment, arid climate, and absence of groundwater disturbance',
      culturalSignificance: 'Sealed tombs preserve complete artifact assemblages, mummified remains, and textiles - demonstrating beliefs in afterlife and royal authority',
      historicalPeriod: 'New Kingdom Egypt (1550 - 1070 BCE)',
      additionalFact: 'Environmental and physical geology factors: Desert climate (dry), limestone bedrock (chemically stable), sealed chamber (anaerobic) combine to preserve site integrity for 3,300+ years'
    }
  },
  8: {
    id: 8,
    name: 'Preserved Papyrus in Dry Climate',
    emoji: '📜',
    rarity: 'rare',
    basePoints: 60,
    facts: {
      origin: 'Organic papyrus documents preserved in the arid Egyptian desert for over 3,000 years',
      siteImpact: 'Demonstrates excellent site integrity maintained by dry environmental geology - low moisture prevents decomposition of organic materials',
      culturalSignificance: 'Direct textual evidence of ancient laws, literature, and daily life preserved through favorable environmental geological conditions',
      historicalPeriod: 'Ancient Egypt (3000 - 300 BCE)',
      additionalFact: 'Environmental geology factor: Arid desert climate (low humidity, stable temperature) provides optimal conditions for organic preservation, ensuring site integrity'
    }
  },
  9: {
    id: 9,
    name: 'Waterlogged Bog Body',
    emoji: '🔮',
    rarity: 'legendary',
    basePoints: 100,
    facts: {
      origin: 'Exceptionally preserved human remains found in peat bogs of Northern Europe dated 2000+ years old',
      siteImpact: 'Peat bog environment provides anaerobic (oxygen-free) conditions from environmental geology - demonstrates exceptional site integrity with preservation of skin, organs, and stomach contents intact',
      culturalSignificance: 'Reveals details of ancient diet, clothing, and life circumstances impossible to obtain from skeletal remains alone',
      historicalPeriod: 'Iron Age to Roman Period (500 BCE - 500 CE)',
      additionalFact: 'Environmental geology: Acidic peat with anoxic conditions creates ideal preservation; site integrity maintained by stable groundwater and geological layering preventing microbial decay'
    }
  }
};

const Game: React.FC = () => {
  const { user, updateUserScore, addScoreToLeaderboard } = useAuth();
  const navigate = useNavigate();

  const [gameState, setGameState] = useState<'levelSelect' | 'playing' | 'levelComplete' | 'finished'>('levelSelect');
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [currentLevel, setCurrentLevel] = useState<number>(0);
  const [matchedArtifact, setMatchedArtifact] = useState<ArtifactData | null>(null);
  const [showFacts, setShowFacts] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const levelConfigs: Record<number, GameLevel> = {
    1: {
      level: 1,
      pairs: 3,
      artifacts: [artifactDatabase[1], artifactDatabase[2], artifactDatabase[3]]
    },
    2: {
      level: 2,
      pairs: 4,
      artifacts: [artifactDatabase[4], artifactDatabase[5], artifactDatabase[6], artifactDatabase[7]]
    },
    3: {
      level: 3,
      pairs: 5,
      artifacts: [artifactDatabase[5], artifactDatabase[8], artifactDatabase[9], artifactDatabase[1], artifactDatabase[4]]
    }
  };

  const moveLimit: Record<number, number> = {
    1: 8,   // Level 1: 8 moves max (6 cards, 3 pairs)
    2: 10,  // Level 2: 10 moves max (8 cards, 4 pairs)
    3: 12   // Level 3: 12 moves max (10 cards, 5 pairs)
  };

  const initializeLevel = (level: number) => {
    const config = levelConfigs[level];
    const cardArray: Card[] = [];
    
    // Create pairs of cards
    config.artifacts.forEach((artifact, index) => {
      cardArray.push({
        id: index * 2,
        artifactId: artifact.id,
        isFlipped: false,
        isMatched: false
      });
      cardArray.push({
        id: index * 2 + 1,
        artifactId: artifact.id,
        isFlipped: false,
        isMatched: false
      });
    });

    // Shuffle cards
    for (let i = cardArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardArray[i], cardArray[j]] = [cardArray[j], cardArray[i]];
    }

    setCards(cardArray);
    setFlipped([]);
    setMatched([]);
    setScore(0);
    setMoves(0);
    setCurrentLevel(level);
    setGameState('playing');
    setStartTime(Date.now());
    setShowFacts(false);
  };

  const handleCardClick = (index: number) => {
    if (flipped.includes(index) || matched.includes(index)) return;
    if (flipped.length === 2) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const newMoveCount = moves + 1;
      const currentMoveLimit = moveLimit[currentLevel] || 15;
      
      // Check if move limit exceeded
      if (newMoveCount > currentMoveLimit) {
        setMoves(newMoveCount);
        setTimeout(() => {
          setGameState('finished');
          addScoreToLeaderboard(user?.displayName || 'Anonymous', score);
        }, 1000);
        return;
      }
      
      setMoves(newMoveCount);
      
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.artifactId === secondCard.artifactId) {
        // Match found!
        const newMatched = [...matched, newFlipped[0], newFlipped[1]];
        setMatched(newMatched);
        
        const artifact = artifactDatabase[firstCard.artifactId];
        const basePoints = artifact.basePoints;
        const pointMultiplier = levelConfigs[currentLevel]?.level || 1;
        const earnedPoints = basePoints * pointMultiplier;
        
        setScore(score + earnedPoints);
        setMatchedArtifact(artifact);
        setShowFacts(true);

        setTimeout(() => {
          setFlipped([]);
          
          if (newMatched.length === cards.length) {
            setTimeout(() => completeLevel(), 500);
          }
        }, 2000);
      } else {
        // No match
        setTimeout(() => {
          setFlipped([]);
        }, 1000);
      }
    }
  };

  const completeLevel = () => {
    // Calculate time taken in seconds
    const timeTaken = (Date.now() - startTime) / 1000;
    
    // Calculate move efficiency multiplier
    const currentMoveLimit = moveLimit[currentLevel] || 8;
    const movesRatio = moves / currentMoveLimit;
    let moveMultiplier = 1;
    
    if (movesRatio <= 0.5) {
      moveMultiplier = 2.0;  // Used 50% or less of moves = 2x bonus
    } else if (movesRatio <= 0.7) {
      moveMultiplier = 1.5;  // Used 50-70% of moves = 1.5x bonus
    } else if (movesRatio <= 1.0) {
      moveMultiplier = 1.0;  // Used up to 100% of moves = no bonus
    }
    
    // Calculate time efficiency multiplier (based on level)
    let timeMultiplier = 1;
    const timeThresholds: Record<number, { excellent: number; good: number }> = {
      1: { excellent: 20, good: 35 },   // Level 1: under 20s = excellent, under 35s = good
      2: { excellent: 35, good: 60 },   // Level 2: under 35s = excellent, under 60s = good
      3: { excellent: 50, good: 90 }    // Level 3: under 50s = excellent, under 90s = good
    };
    
    const threshold = timeThresholds[currentLevel] || { excellent: 30, good: 60 };
    
    if (timeTaken <= threshold.excellent) {
      timeMultiplier = 1.5;  // Excellent speed = 1.5x bonus
    } else if (timeTaken <= threshold.good) {
      timeMultiplier = 1.2;  // Good speed = 1.2x bonus
    } else {
      timeMultiplier = 1.0;  // Slower = no bonus
    }
    
    // Apply multipliers to score
    const totalMultiplier = moveMultiplier * timeMultiplier;
    const bonusScore = Math.floor(score * (totalMultiplier - 1));
    const finalScore = score + bonusScore;
    setScore(finalScore);
    
    // Store level completion stats
    const levelStats = {
      timeTaken: Math.round(timeTaken),
      moves,
      moveLimit: currentMoveLimit,
      moveMultiplier,
      timeMultiplier,
      totalMultiplier,
      bonusScore
    };
    
    localStorage.setItem(`level${currentLevel}Stats`, JSON.stringify(levelStats));
    setGameState('levelComplete');
  };

  const nextLevel = () => {
    if (currentLevel < 3) {
      initializeLevel(currentLevel + 1);
    } else {
      setGameState('finished');
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#95a5a6';
      case 'uncommon': return '#2ecc71';
      case 'rare': return '#3498db';
      case 'legendary': return '#f39c12';
      default: return '#95a5a6';
    }
  };

  if (gameState === 'levelSelect') {
    return (
      <div className="game-container">
        <nav className="navbar">
          <div className="nav-content">
            <h1>🏛️ Relics Reimagined</h1>
            <div className="nav-right">
              <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
            </div>
          </div>
        </nav>

        <div className="game-content">
          <div className="level-select">
            <h2>🎮 Artifact Memory Challenge</h2>
            <p className="level-subtitle">Match pairs of identical artifacts and learn fascinating facts</p>

            <div className="levels-grid">
              <div className="level-card" onClick={() => initializeLevel(1)}>
                <div className="level-number">LEVEL 1</div>
                <div className="level-emoji">🏜️</div>
                <h3>Novice Archaeologist</h3>
                <p className="level-description">Match 3 pairs of ancient artifacts</p>
                <div className="level-stats">
                  <div className="stat">Cards: 6</div>
                  <div className="stat">Pairs: 3</div>
                  <div className="stat">Difficulty: Easy</div>
                </div>
                <button className="play-btn">Start Game</button>
              </div>

              <div className="level-card" onClick={() => initializeLevel(2)}>
                <div className="level-number">LEVEL 2</div>
                <div className="level-emoji">🏛️</div>
                <h3>Expert Archaeologist</h3>
                <p className="level-description">Match 4 pairs of treasures</p>
                <div className="level-stats">
                  <div className="stat">Cards: 8</div>
                  <div className="stat">Pairs: 4</div>
                  <div className="stat">Difficulty: Medium</div>
                </div>
                <button className="play-btn">Start Game</button>
              </div>

              <div className="level-card" onClick={() => initializeLevel(3)}>
                <div className="level-number">LEVEL 3</div>
                <div className="level-emoji">👑</div>
                <h3>Master Archaeologist</h3>
                <p className="level-description">Match 5 pairs of rare artifacts</p>
                <div className="level-stats">
                  <div className="stat">Cards: 10</div>
                  <div className="stat">Pairs: 5</div>
                  <div className="stat">Difficulty: Hard</div>
                </div>
                <button className="play-btn">Start Game</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    const pairsMatched = matched.length / 2;
    const totalPairs = levelConfigs[currentLevel]?.pairs || 3;
    const currentMoveLimit = moveLimit[currentLevel] || 15;
    const movesRemaining = Math.max(0, currentMoveLimit - moves);

    return (
      <div className="game-container">
        <nav className="navbar">
          <div className="nav-content">
            <h1>🎮 Memory Match - Level {currentLevel}</h1>
            <div className="nav-right">
              <span className="user-info">Score: {score} | Moves: {moves}</span>
            </div>
          </div>
        </nav>

        <div className="game-content">
          <div className="match-game">
            <div className="game-header">
              <h2>🔍 Find the Matching Pairs</h2>
              <div className="game-stats">
                <div className="stat-box">
                  <div className="stat-label">Pairs Found</div>
                  <div className="stat-value">{pairsMatched}/{totalPairs}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Moves</div>
                  <div className="stat-value">{moves}/{currentMoveLimit}</div>
                </div>
                <div className="stat-box">
                  <div className="stat-label">Score</div>
                  <div className="stat-value">{score}</div>
                </div>
              </div>
            </div>

            <div className="card-grid" style={{
              gridTemplateColumns: `repeat(${Math.ceil(Math.sqrt(cards.length))}, 1fr)`
            }}>
              {cards.map((card, index) => (
                <div
                  key={index}
                  className={`memory-card ${flipped.includes(index) || matched.includes(index) ? 'flipped' : ''} ${matched.includes(index) ? 'matched' : ''}`}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="card-inner">
                    <div className="card-front">?</div>
                    <div className="card-back">
                      {artifactDatabase[card.artifactId].emoji}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {movesRemaining <= 5 && movesRemaining > 0 && (
              <div className="warning-message" style={{ color: '#ff6b6b', marginTop: '20px', textAlign: 'center', fontSize: '18px', fontWeight: 'bold' }}>
                ⚠️ Only {movesRemaining} move{movesRemaining === 1 ? '' : 's'} remaining!
              </div>
            )}

            {showFacts && matchedArtifact && (
              <div className="facts-modal">
                <div className="facts-content">
                  <div className="facts-header">
                    <div className="facts-emoji">{matchedArtifact.emoji}</div>
                    <h3>{matchedArtifact.name}</h3>
                    <div className="rarity-badge" style={{ backgroundColor: getRarityColor(matchedArtifact.rarity) }}>
                      {matchedArtifact.rarity.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="facts-list">
                    <div className="fact-item">
                      <div className="fact-label">📍 Origin</div>
                      <div className="fact-text">{matchedArtifact.facts.origin}</div>
                    </div>
                    <div className="fact-item">
                      <div className="fact-label">🏛️ Site Impact</div>
                      <div className="fact-text">{matchedArtifact.facts.siteImpact}</div>
                    </div>
                    <div className="fact-item">
                      <div className="fact-label">🌍 Cultural Significance</div>
                      <div className="fact-text">{matchedArtifact.facts.culturalSignificance}</div>
                    </div>
                    <div className="fact-item">
                      <div className="fact-label">⏰ Time Period</div>
                      <div className="fact-text">{matchedArtifact.facts.historicalPeriod}</div>
                    </div>
                    <div className="fact-item">
                      <div className="fact-label">💡 Fun Fact</div>
                      <div className="fact-text">{matchedArtifact.facts.additionalFact}</div>
                    </div>
                  </div>

                  <button className="close-facts-btn" onClick={() => setShowFacts(false)}>
                    Continue ✓
                  </button>
                </div>
              </div>
            )}

            <div className="action-buttons">
              <button className="back-btn" onClick={() => {
                setGameState('levelSelect');
                setShowFacts(false);
              }}>← Back to Levels</button>
              <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'levelComplete') {
    const timeElapsed = Math.floor((Date.now() - startTime) / 1000);
    const totalPairs = levelConfigs[currentLevel]?.pairs || 3;
    
    // Retrieve stored stats from completeLevel calculation
    const levelStatsStr = localStorage.getItem(`level${currentLevel}Stats`);
    const levelStats = levelStatsStr ? JSON.parse(levelStatsStr) : {
      moveMultiplier: 1,
      timeMultiplier: 1,
      totalMultiplier: 1
    };

    return (
      <div className="game-container">
        <nav className="navbar">
          <div className="nav-content">
            <h1>🏛️ Relics Reimagined</h1>
            <div className="nav-right">
              <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
            </div>
          </div>
        </nav>

        <div className="game-content">
          <div className="completion-screen">
            <div className="completion-header success">
              <div className="completion-emoji">🎉</div>
              <h2>Level Complete!</h2>
              <p className="completion-subtitle">Perfect match! You've mastered this level!</p>
            </div>

            <div className="completion-stats">
              <div className="stats-row">
                <div className="completion-stat">
                  <div className="stat-label">Pairs Matched</div>
                  <div className="stat-value">{totalPairs}/{totalPairs}</div>
                </div>
                <div className="completion-stat">
                  <div className="stat-label">Total Moves</div>
                  <div className="stat-value">{moves}</div>
                </div>
                <div className="completion-stat">
                  <div className="stat-label">Time</div>
                  <div className="stat-value">{timeElapsed}s</div>
                </div>
                <div className="completion-stat">
                  <div className="stat-label">Score</div>
                  <div className="stat-value highlight">{score}</div>
                </div>
              </div>

              <div className="multiplier-breakdown">
                <h3>🎯 Scoring Breakdown</h3>
                <div className="multiplier-row">
                  <span className={`multiplier-label ${levelStats.moveMultiplier > 1 ? 'bonus' : ''}`}>
                    Moves Efficiency: {levelStats.moveMultiplier.toFixed(1)}x
                  </span>
                  <span className="multiplier-desc">
                    {levelStats.moveMultiplier === 2.0 && '⭐ Excellent! Used ≤50% of moves'}
                    {levelStats.moveMultiplier === 1.5 && '✨ Great! Used 50-70% of moves'}
                    {levelStats.moveMultiplier === 1.0 && 'Used majority of moves'}
                  </span>
                </div>
                <div className="multiplier-row">
                  <span className={`multiplier-label ${levelStats.timeMultiplier > 1 ? 'bonus' : ''}`}>
                    Speed Bonus: {levelStats.timeMultiplier.toFixed(1)}x
                  </span>
                  <span className="multiplier-desc">
                    {levelStats.timeMultiplier === 1.5 && '⚡ Lightning fast!'}
                    {levelStats.timeMultiplier === 1.2 && '🚀 Very quick!'}
                    {levelStats.timeMultiplier === 1.0 && '✓ Steady pace'}
                  </span>
                </div>
                <div className="multiplier-row total">
                  <span className="multiplier-label total-multiplier">
                    Total Multiplier: {levelStats.totalMultiplier.toFixed(2)}x
                  </span>
                </div>
              </div>
            </div>

            <div className="completion-buttons">
              {currentLevel < 3 ? (
                <>
                  <button className="continue-btn" onClick={nextLevel}>
                    Continue to Level {currentLevel + 1} →
                  </button>
                  <button className="back-btn" onClick={() => setGameState('levelSelect')}>
                    ← Back to Levels
                  </button>
                </>
              ) : (
                <>
                  <button className="continue-btn" onClick={() => setGameState('finished')}>
                    🎊 Complete All Levels!
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameState === 'finished') {
    const currentMoveLimit = moveLimit[currentLevel] || 15;
    const movedExceededLimit = moves > currentMoveLimit;

    return (
      <div className="game-container">
        <nav className="navbar">
          <div className="nav-content">
            <h1>🏛️ Relics Reimagined</h1>
            <div className="nav-right">
              <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
            </div>
          </div>
        </nav>

        <div className="game-content">
          <div className="completion-screen finish">
            {movedExceededLimit ? (
              // Game Over - Move Limit Exceeded
              <>
                <div className="completion-header failure">
                  <div className="completion-emoji large">😅</div>
                  <h2>Out of Moves!</h2>
                  <p className="completion-subtitle">You exceeded the move limit for this level.</p>
                </div>

                <div className="final-stats">
                  <div className="final-score">
                    <div className="score-label">Final Score</div>
                    <div className="score-value">{score}</div>
                  </div>
                  <div className="achievement-message">
                    You used {moves} moves but the limit was {currentMoveLimit}. Try to match pairs more carefully and use fewer moves!
                  </div>
                </div>

                <div className="action-buttons final">
                  <button className="play-again-btn" onClick={() => {
                    setGameState('levelSelect');
                    setScore(0);
                    setMoves(0);
                  }}>
                    🔄 Try Again
                  </button>
                  <button className="dashboard-btn" onClick={() => {
                    updateUserScore(score);
                    navigate('/leaderboard');
                  }}>
                    📊 View Leaderboard
                  </button>
                </div>
              </>
            ) : (
              // Game Won
              <>
                <div className="completion-header success">
                  <div className="completion-emoji large">👑</div>
                  <h2>Master Archaeologist!</h2>
                  <p className="completion-subtitle">You've completed all memory challenges!</p>
                </div>

                <div className="final-stats">
                  <div className="final-score">
                    <div className="score-label">Final Score</div>
                    <div className="score-value">{score}</div>
                  </div>
                  <div className="achievement-message">
                    🏆 Congratulations! You've matched all artifacts and learned incredible facts about ancient civilizations!
                  </div>
                </div>

                <div className="action-buttons final">
                  <button className="play-again-btn" onClick={() => {
                    setGameState('levelSelect');
                    setScore(0);
                    setMoves(0);
                  }}>
                    🔄 Play Again
                  </button>
                  <button className="dashboard-btn" onClick={() => {
                    updateUserScore(score);
                    addScoreToLeaderboard(user?.displayName || 'Anonymous', score);
                    navigate('/leaderboard');
                  }}>
                    📊 View Leaderboard
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Game;
