import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Game.css';
import '../styles/Game-lesson-styles.css';

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
  const [selectedGame, setSelectedGame] = useState<'memory' | 'siteIntegrity' | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Excavation game state
  const [excavationGrid, setExcavationGrid] = useState<boolean[]>([]);
  const [siteIntegrity, setSiteIntegrity] = useState<number>(100);
  const [excavatedCount, setExcavatedCount] = useState<number>(0);
  const [currentChallenge, setCurrentChallenge] = useState<{ id: number; type: string; description: string } | null>(null);

  // Site Integrity Questions Database (deprecated - using excavation game instead)

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
    setCurrentLevel(level);
    setScore(0);
    setMoves(0);
    setStartTime(Date.now());
    setShowFacts(false);

    if (selectedGame === 'memory') {
      // Memory game initialization
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
      setGameState('playing');
    } else if (selectedGame === 'siteIntegrity') {
      // Site Integrity game initialization (Excavation Challenge)
      initializeExcavationGame();
      setGameState('playing');
    }
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

  // Excavation game functions with educational content
  const excavationChallenges = [
    { 
      id: 1, 
      type: 'careful', 
      description: '⚠️ Fragile artifact detected! Excavate carefully?',
      lesson: "Site integrity means keeping the dig site whole and safe. Delicate things like pottery need to be dug up slowly and gently, like how you'd carefully unwrap a gift!",
      careAnswer: 'Excellent! Your careful digging kept the artifact safe and whole.',
      quickAnswer: 'Oops! Your digging was too rough and broke the artifact.'
    },
    { 
      id: 2, 
      type: 'careful', 
      description: '🏺 Ancient pottery layer. Document before removal?',
      lesson: 'Before you move something, write it down and take pictures! This helps us understand how ancient people lived and organized their things.',
      careAnswer: 'Perfect! Your notes show how people arranged things a long time ago.',
      quickAnswer: "Oh no! Without notes, we lost clues about how ancient people lived."
    },
    { 
      id: 3, 
      type: 'quick', 
      description: '⚡ Clear loose soil quickly?',
      lesson: 'Sometimes soil has no special artifacts in it. You can move this quickly to find the interesting stuff faster!',
      careAnswer: "Slow. While careful, you're spending too much time on empty soil.",
      quickAnswer: 'Great job! You cleared the unimportant soil and found the real treasures faster!'
    },
    { 
      id: 4, 
      type: 'careful', 
      description: '📜 Organic remains found. Preserve context?',
      lesson: 'Bones, wood, and seeds tell us what people ate and where they lived. We need to handle them extra carefully to keep them whole and safe.',
      careAnswer: 'Excellent! Your careful work saved important clues about ancient diets and homes.',
      quickAnswer: 'Uh-oh! Rough handling destroyed clues about what ancient people ate.'
    },
    { 
      id: 5, 
      type: 'careful', 
      description: '🦴 Bone layer discovered. Sample preservation?',
      lesson: "Bones are like history books! Scientists can learn about ancient people from bones if we keep them safe and clean.",
      careAnswer: "Great! Your careful excavation kept the bones clean for scientists to study.",
      quickAnswer: "Oops! Careless digging damaged the bones so scientists can't study them anymore."
    }
  ];

  const initializeExcavationGame = () => {
    const gridSize = currentLevel === 1 ? 12 : currentLevel === 2 ? 16 : 20;
    setExcavationGrid(new Array(gridSize).fill(false));
    setSiteIntegrity(100);
    setExcavatedCount(0);
    setCurrentChallenge(null);
  };

  const handleExcavate = (index: number) => {
    if (excavationGrid[index]) return;
    const newGrid = [...excavationGrid];
    newGrid[index] = true;
    setExcavationGrid(newGrid);
    setExcavatedCount(excavatedCount + 1);
    if (Math.random() < 0.4 && currentChallenge === null) {
      const randomChallenge = excavationChallenges[Math.floor(Math.random() * excavationChallenges.length)];
      setCurrentChallenge(randomChallenge);
    }
  };

  const handleChallengeResponse = (chooseCareful: boolean) => {
    if (!currentChallenge) return;
    let integrityChange = 0;
    let isCorrect = false;
    let feedbackMessage = '';
    
    if (currentChallenge.type === 'careful' && chooseCareful) {
      integrityChange = 10;
      setScore(score + 100);
      isCorrect = true;
      feedbackMessage = (currentChallenge as any).careAnswer || 'Good decision!';
    } else if (currentChallenge.type === 'quick' && !chooseCareful) {
      integrityChange = 10;
      setScore(score + 100);
      isCorrect = true;
      feedbackMessage = (currentChallenge as any).quickAnswer || 'Efficient choice!';
    } else {
      integrityChange = -15;
      setScore(Math.max(0, score - 25));
      isCorrect = false;
      feedbackMessage = chooseCareful ? ((currentChallenge as any).quickAnswer || 'Poor decision') : ((currentChallenge as any).careAnswer || 'Poor decision');
    }
    const newIntegrity = Math.max(0, Math.min(100, siteIntegrity + integrityChange));
    setSiteIntegrity(newIntegrity);
    setCurrentChallenge({ ...(currentChallenge as any), feedback: feedbackMessage, isCorrect });
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
            <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>🏛️ Relics Reimagined</h1>
            <div className="nav-right">
              <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
            </div>
          </div>
        </nav>

        <div className="game-content">
          {selectedGame === null ? (
            <div className="game-selection">
              <div className="selection-header">
                <h2>🎮 Choose Your Archaeological Adventure</h2>
                <button className="instructions-btn" onClick={() => setShowInstructions(true)}>
                  📖 How to Play
                </button>
              </div>
              <p>Learn archaeology through interactive games and master the key concepts of archaeological preservation</p>
              
              <div className="games-grid">
                <div className="game-card" onClick={() => setSelectedGame('memory')}>
                  <div className="game-card-subtitle">Memory Game</div>
                  <div className="game-icon">🧩</div>
                  <h3>Artifact Memory Challenge</h3>
                  <p>Test your memory and learn about ancient artifacts. Match pairs of identical artifacts while discovering fascinating facts about archaeological preservation, site integrity, and historical context.</p>
                  <ul className="game-features">
                    <li>🏜️ 3 Progressive Difficulty Levels</li>
                    <li>📚 Learn facts about 9 different artifacts</li>
                    <li>⏱️ Timed challenges with scoring</li>
                    <li>🏆 Compete on the leaderboard</li>
                  </ul>
                  <button className="select-game-btn">Play Now →</button>
                </div>

                <div className="game-card site-integrity" onClick={() => setSelectedGame('siteIntegrity')}>
                  <div className="game-card-subtitle">Learning Game</div>
                  <div className="game-icon">🏗️</div>
                  <h3>Site Integrity Challenge</h3>
                  <p>Understand what site integrity means and why it's crucial in archaeology. Site integrity is the preservation and wholeness of an archaeological site. Master excavation practices and environmental factors that protect artifacts.</p>
                  <ul className="game-features">
                    <li>🌍 Learn about environmental preservation</li>
                    <li>🔬 Master excavation protocols</li>
                    <li>⚙️ Expert-level site management</li>
                    <li>📊 Immediate feedback on answers</li>
                  </ul>
                  <button className="select-game-btn">Play Now →</button>
                </div>
              </div>
            </div>
          ) : selectedGame === 'memory' ? (
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

              <button className="back-selection-btn" onClick={() => setSelectedGame(null)}>
                ← Back to Game Selection
              </button>
            </div>
          ) : (
            <div className="level-select">
              <h2>🏗️ Site Integrity Challenge</h2>
              <p className="level-subtitle">Master the preservation and wholeness of archaeological sites</p>

              <div className="levels-grid">
                <div className="level-card" onClick={() => initializeLevel(1)}>
                  <div className="level-number">LEVEL 1</div>
                  <div className="level-emoji">🌍</div>
                  <h3>Site Preservation Basics</h3>
                  <p className="level-description">Learn environmental factors that protect artifacts</p>
                  <div className="level-stats">
                    <div className="stat">Questions: 5</div>
                    <div className="stat">Difficulty: Easy</div>
                    <div className="stat">Focus: Climate & Soil</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>

                <div className="level-card" onClick={() => initializeLevel(2)}>
                  <div className="level-number">LEVEL 2</div>
                  <div className="level-emoji">🔬</div>
                  <h3>Excavation Protocols</h3>
                  <p className="level-description">Master correct digging and documentation methods</p>
                  <div className="level-stats">
                    <div className="stat">Questions: 8</div>
                    <div className="stat">Difficulty: Medium</div>
                    <div className="stat">Focus: Techniques</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>

                <div className="level-card" onClick={() => initializeLevel(3)}>
                  <div className="level-number">LEVEL 3</div>
                  <div className="level-emoji">🏛️</div>
                  <h3>Expert Site Management</h3>
                  <p className="level-description">Handle complex preservation challenges</p>
                  <div className="level-stats">
                    <div className="stat">Questions: 10</div>
                    <div className="stat">Difficulty: Hard</div>
                    <div className="stat">Focus: All Topics</div>
                  </div>
                  <button className="play-btn">Start Game</button>
                </div>
              </div>

              <button className="back-selection-btn" onClick={() => setSelectedGame(null)}>
                ← Back to Game Selection
              </button>
            </div>
          )}

          {/* Instructions Modal Overlay */}
          {showInstructions && (
            <div className="instructions-modal">
              <div className="instructions-content">
                <button className="close-instructions-btn" onClick={() => setShowInstructions(false)}>✕</button>
                <h2>📖 How to Play</h2>
                
                <div className="instructions-section">
                  <h3>🎮 Game Selection</h3>
                  <p>Choose between two exciting archaeological games:</p>
                  <ul>
                    <li><strong>Artifact Memory Challenge:</strong> Test your memory by matching pairs of artifacts and learning fascinating facts about ancient civilizations.</li>
                    <li><strong>Site Integrity Challenge:</strong> Make excavation decisions that test your understanding of archaeological preservation and site integrity.</li>
                  </ul>
                </div>

                <div className="instructions-section">
                  <h3>🧩 Artifact Memory Challenge - How to Play</h3>
                  <ol>
                    <li><strong>Choose a Level:</strong> Start with Level 1 (Novice) for 6 cards, Level 2 (Expert) for 8 cards, or Level 3 (Master) for 10 cards.</li>
                    <li><strong>Click to Flip:</strong> Click on cards to flip them over and reveal the artifacts.</li>
                    <li><strong>Match Pairs:</strong> Find two identical artifacts. When you match a pair, they stay flipped!</li>
                    <li><strong>Learn Facts:</strong> After matching all pairs, you'll see fascinating facts about each artifact.</li>
                    <li><strong>Watch Your Moves:</strong> You have a limited number of moves. Use them wisely! More efficient matching = higher score!</li>
                    <li><strong>Progress to Next Level:</strong> Complete all 3 levels to become a Master Archaeologist!</li>
                  </ol>
                </div>

                <div className="instructions-section">
                  <h3>🏗️ Site Integrity Challenge - How to Play</h3>
                  <ol>
                    <li><strong>Choose a Level:</strong> Progress through 3 levels with increasing complexity.</li>
                    <li><strong>Excavate the Site:</strong> Click on grid squares to excavate them.</li>
                    <li><strong>Answer Challenges:</strong> When you uncover a challenge, decide whether to excavate CAREFULLY (slow, preserves artifacts) or QUICKLY (fast but risky).</li>
                    <li><strong>Understand Site Integrity:</strong> Site Integrity is the preservation and wholeness of an archaeological site. Keep your Site Integrity score high!</li>
                    <li><strong>Careful = Green:</strong> Making the right careful excavation choices adds to your Site Integrity (green status = 70%+).</li>
                    <li><strong>Risky = Red:</strong> Making quick, careless decisions reduces your Site Integrity (red status = below 40%).</li>
                    <li><strong>Complete the Challenge:</strong> Finish all 3 levels to become an Excavation Expert!</li>
                  </ol>
                </div>

                <div className="instructions-section">
                  <h3>🏆 Scoring & Leaderboard</h3>
                  <ul>
                    <li><strong>Memory Game Scoring:</strong> Earn points based on moves used and time taken. More efficient = higher score!</li>
                    <li><strong>Site Integrity Scoring:</strong> Earn points for correct excavation decisions and maintaining high site integrity.</li>
                    <li><strong>Complete All Levels:</strong> Finish all 3 levels in a game to earn bonus points and compete on the leaderboard!</li>
                    <li><strong>View Leaderboard:</strong> After completing a game, check the leaderboard to see how you rank!</li>
                  </ul>
                </div>

                <div className="instructions-section">
                  <h3>💡 Tips for Success</h3>
                  <ul>
                    <li>📚 <strong>Memory Game:</strong> Remember the positions of cards! Try to notice patterns and recall what you've seen.</li>
                    <li>⚡ <strong>Memory Game:</strong> Work quickly but carefully - speed AND accuracy earn bonuses!</li>
                    <li>🏗️ <strong>Site Integrity:</strong> Think about each choice carefully - rushing damages irreplaceable artifacts!</li>
                    <li>📖 <strong>Site Integrity:</strong> Read the lesson for each challenge to understand WHY careful choices matter.</li>
                    <li>🎯 <strong>Both Games:</strong> Higher accuracy = higher score = better leaderboard ranking!</li>
                  </ul>
                </div>

                <button className="close-instructions-btn-large" onClick={() => setShowInstructions(false)}>
                  Got It! Start Playing →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'playing') {
    // Memory Game
    if (selectedGame === 'memory') {
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

    // Site Integrity Game (Excavation Challenge)
    if (selectedGame === 'siteIntegrity') {
      const totalSpots = excavationGrid.length;
      const gridCols = currentLevel === 1 ? 3 : currentLevel === 2 ? 4 : 5;
      const progressPercentage = totalSpots > 0 ? (excavatedCount / totalSpots) * 100 : 0;

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏗️ Excavation Challenge - Level {currentLevel}</h1>
              <div className="nav-right">
                <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="match-game">
              <div className="excavation-game">
                <div className="game-header">
                  <h2>Preserve the Site Integrity</h2>
                  <div className="site-integrity-definition">
                    <p><strong>What is Site Integrity?</strong> It means keeping an archaeological dig site whole, safe, and undamaged - just like how you'd carefully protect something important that you want to keep forever!</p>
                  </div>
                  <div className="game-stats">
                    <div className="stat-box">
                      <div className="stat-label">Site Integrity</div>
                      <div className="stat-value" style={{ 
                        color: siteIntegrity >= 70 ? '#4CAF50' : siteIntegrity >= 40 ? '#FFC107' : '#f44336'
                      }}>
                        {Math.round(siteIntegrity)}%
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Progress</div>
                      <div className="stat-value">{excavatedCount}/{totalSpots}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Score</div>
                      <div className="stat-value" style={{ color: '#ffd700' }}>{score}</div>
                    </div>
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>

              {/* Excavation Grid */}
              <div className="excavation-grid" style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}>
                {excavationGrid.map((excavated, index) => (
                  <button
                    key={index}
                    className={`excavation-square ${excavated ? 'excavated' : ''}`}
                    onClick={() => handleExcavate(index)}
                    disabled={excavated}
                  >
                    {excavated ? '✓' : ''}
                  </button>
                ))}
              </div>

              {/* Challenge Modal with Education */}
              {currentChallenge && !(currentChallenge as any).feedback && (
                <div className="challenge-modal">
                  <div className="challenge-content">
                    <div className="challenge-text">{currentChallenge.description}</div>
                    <div className="lesson-box">
                      <strong>💡 Site Integrity Lesson:</strong>
                      <p>{(currentChallenge as any).lesson}</p>
                    </div>
                    <div className="challenge-buttons">
                      <button
                        className="decision-btn careful"
                        onClick={() => {
                          handleChallengeResponse(true);
                        }}
                      >
                        ⚖️ Excavate Carefully
                      </button>
                      <button
                        className="decision-btn quick"
                        onClick={() => {
                          handleChallengeResponse(false);
                        }}
                      >
                        ⚡ Excavate Quickly
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Challenge Feedback Message */}
              {currentChallenge && (currentChallenge as any).feedback && (
                <div className={`challenge-result ${(currentChallenge as any).isCorrect ? 'correct' : 'incorrect'}`}>
                  <div className="feedback-header">
                    {(currentChallenge as any).isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </div>
                  <div className="feedback-message">
                    {(currentChallenge as any).feedback}
                  </div>
                  <button 
                    className="continue-btn"
                    onClick={() => setCurrentChallenge(null)}
                  >
                    Continue Excavating
                  </button>
                </div>
              )}

              <div className="action-buttons">
                <button className="back-btn" onClick={() => {
                  setGameState('levelSelect');
                }}>← Back to Levels</button>
                <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Dashboard</button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }

  if (gameState === 'levelComplete') {
    if (selectedGame === 'memory') {
      // Memory game completion screen
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
              <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>🏛️ Relics Reimagined</h1>
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
    } else if (selectedGame === 'siteIntegrity') {
      // Site Integrity game completion screen
      const siteIntegrityStatsStr = localStorage.getItem(`siteIntegrityLevel${currentLevel}Stats`);
      const siteIntegrityStats = siteIntegrityStatsStr ? JSON.parse(siteIntegrityStatsStr) : {
        correctAnswers: 0,
        totalQuestions: 5,
        accuracy: 0
      };

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏗️ Site Integrity Challenge</h1>
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
                <p className="completion-subtitle">Great job mastering the concepts!</p>
              </div>

              <div className="completion-stats">
                <div className="stats-row">
                  <div className="completion-stat">
                    <div className="stat-label">Correct Answers</div>
                    <div className="stat-value">{siteIntegrityStats.correctAnswers}/{siteIntegrityStats.totalQuestions}</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Accuracy</div>
                    <div className="stat-value">{siteIntegrityStats.accuracy}%</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Questions</div>
                    <div className="stat-value">{siteIntegrityStats.totalQuestions}</div>
                  </div>
                  <div className="completion-stat">
                    <div className="stat-label">Score</div>
                    <div className="stat-value highlight">{score}</div>
                  </div>
                </div>

                <div className="multiplier-breakdown">
                  <h3>📊 Performance Summary</h3>
                  <div className="multiplier-row">
                    <span className={`multiplier-label ${siteIntegrityStats.accuracy >= 90 ? 'bonus' : ''}`}>
                      Accuracy Rating
                    </span>
                    <span className="multiplier-desc">
                      {siteIntegrityStats.accuracy >= 90 && '⭐ Excellent - Mastered the concepts!'}
                      {siteIntegrityStats.accuracy >= 70 && siteIntegrityStats.accuracy < 90 && '✨ Great - Strong understanding'}
                      {siteIntegrityStats.accuracy >= 50 && siteIntegrityStats.accuracy < 70 && '✓ Good - Basic understanding'}
                      {siteIntegrityStats.accuracy < 50 && '📚 Review - Consider reviewing the material'}
                    </span>
                  </div>
                  <div className="multiplier-row">
                    <span className="multiplier-label">
                      Correct Answers: {siteIntegrityStats.correctAnswers}/{siteIntegrityStats.totalQuestions}
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
  }

  if (gameState === 'finished') {
    if (selectedGame === 'memory') {
      // Memory game finished screen
      const currentMoveLimit = moveLimit[currentLevel] || 15;
      const movedExceededLimit = moves > currentMoveLimit;

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/dashboard')}>🏛️ Relics Reimagined</h1>
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
    } else if (selectedGame === 'siteIntegrity') {
      // Site Integrity finished screen
      const performance = siteIntegrity >= 80 ? 'Expert' : siteIntegrity >= 50 ? 'Competent' : 'Novice';

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏗️ Excavation Challenge - Complete!</h1>
              <div className="nav-right">
                <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="completion-screen finish">
              <div className="completion-header success">
                <div className="completion-emoji large">👑</div>
                <h2>Excavation {performance}!</h2>
                <p className="completion-subtitle">You've completed the Site Integrity Excavation Challenge!</p>
              </div>

              <div className="final-stats">
                <div className="final-score">
                  <div className="score-label">Final Score</div>
                  <div className="score-value">{score}</div>
                </div>
                <div className="achievement-message">
                  🏆 Excellent work! You've demonstrated understanding of archaeological site preservation through practical excavation decisions!
                </div>
                <div className="achievement-detail">
                  Site Integrity Maintained: {Math.round(siteIntegrity)}% | Excavations Completed: {excavatedCount}
                </div>
              </div>

              <div className="action-buttons final">
                <button className="play-again-btn" onClick={() => {
                  setGameState('levelSelect');
                  setScore(0);
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
            </div>
          </div>
        </div>
      );
    }
  }

  return null;
};

export default Game;
