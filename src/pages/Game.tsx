import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import '../styles/Game.css';
import '../styles/Game-lesson-styles.css';
import '../styles/Game-scenario.css';
import ThreatElimination from './ThreatElimination';

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
  const [selectedGame, setSelectedGame] = useState<'memory' | 'siteIntegrity' | 'threatElimination' | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  // Excavation game state
  const [siteIntegrity, setSiteIntegrity] = useState<number>(100);
  const [excavatedCount, setExcavatedCount] = useState<number>(0);
  const [currentChallenge, setCurrentChallenge] = useState<any | null>(null);

  // Combined game scoring
  const [gameScores, setGameScores] = useState<{ memory: number; siteIntegrity: number; threatElimination: number }>({ memory: 0, siteIntegrity: 0, threatElimination: 0 });

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
      // Site Integrity game finished - auto-progress to Memory Match game
      if (selectedGame === 'siteIntegrity') {
        setSelectedGame('memory');
        setGameState('levelSelect');
        setCurrentLevel(0);
      } else {
        // Memory Match game finished - go to combined leaderboard
        setGameState('finished');
      }
    }
  };

  // Interactive Excavation Scenarios organized by level
  // Level 1: Basic scenarios (easier, focus on artifact preservation)
  const level1Scenarios = [
    {
      id: 1,
      artifact: '🏺',
      name: 'Ancient Pottery',
      description: 'Delicate ceramic vessel found at layer 3',
      correctApproach: 'careful',
      carefulResult: { points: 100, integrity: 15, message: '✅ Pottery intact! Preserved in perfect condition.' },
      quickResult: { points: 0, integrity: -30, message: '💔 Pottery shattered from rough handling!' }
    },
    {
      id: 2,
      artifact: '🪨',
      name: 'Loose Rubble Layer',
      description: 'Sterile rock and soil with no artifacts',
      correctApproach: 'quick',
      carefulResult: { points: 30, integrity: 5, message: '✓ Removed carefully, but wasted time.' },
      quickResult: { points: 80, integrity: 10, message: '✅ Efficiently cleared sterile layer!' }
    },
    {
      id: 3,
      artifact: '💧',
      name: 'Clay Layer',
      description: 'Unmarked clay foundation layer',
      correctApproach: 'careful',
      carefulResult: { points: 90, integrity: 14, message: '✅ Clay preserved - ready for analysis!' },
      quickResult: { points: 20, integrity: -25, message: '💔 Careless handling damaged the layer!' }
    }
  ];

  // Level 2: Intermediate scenarios (more challenging, mixed preservation needs)
  const level2Scenarios = [
    {
      id: 1,
      artifact: '🦴',
      name: 'Human Remains',
      description: 'Skeletal remains in fragile condition',
      correctApproach: 'careful',
      carefulResult: { points: 120, integrity: 20, message: '✅ Bones preserved for DNA analysis!' },
      quickResult: { points: 10, integrity: -40, message: '💔 Rough handling destroyed bone structure!' }
    },
    {
      id: 2,
      artifact: '⚙️',
      name: 'Bulk Stone Removal',
      description: 'Large stones blocking deeper access',
      correctApproach: 'quick',
      carefulResult: { points: 40, integrity: 5, message: '✓ Too slow for blocked stones.' },
      quickResult: { points: 110, integrity: 12, message: '✅ Efficiently cleared obstruction!' }
    },
    {
      id: 3,
      artifact: '🌾',
      name: 'Seed Deposit',
      description: 'Ancient carbonized seeds in soil',
      correctApproach: 'careful',
      carefulResult: { points: 95, integrity: 18, message: '✅ Seeds preserved for plant analysis!' },
      quickResult: { points: 5, integrity: -35, message: '💔 Careless digging destroyed seeds!' }
    },
    {
      id: 4,
      artifact: '🪣',
      name: 'Loose Surface Debris',
      description: 'Modern trash and displaced soil',
      correctApproach: 'quick',
      carefulResult: { points: 25, integrity: 3, message: '✓ Careful but unnecessary for debris.' },
      quickResult: { points: 75, integrity: 8, message: '✅ Quickly removed contamination!' }
    }
  ];

  // Level 3: Advanced scenarios (complex decisions, expert challenges)
  const level3Scenarios = [
    {
      id: 1,
      artifact: '📜',
      name: 'Organic Fibers',
      description: 'Ancient textile fragments (extremely delicate)',
      correctApproach: 'careful',
      carefulResult: { points: 140, integrity: 25, message: '✅ Fibers intact - reveals weaving techniques!' },
      quickResult: { points: 0, integrity: -50, message: '💔 Fibers disintegrated completely!' }
    },
    {
      id: 2,
      artifact: '🏔️',
      name: 'Heavy Clay Block',
      description: 'Large compacted clay without artifacts',
      correctApproach: 'quick',
      carefulResult: { points: 35, integrity: 4, message: '✓ Overcautious for sterile clay.' },
      quickResult: { points: 120, integrity: 15, message: '✅ Expert efficiency on dense layer!' }
    },
    {
      id: 3,
      artifact: '💍',
      name: 'Metal Artifact in Soil',
      description: 'Oxidized metal piece requiring careful exposure',
      correctApproach: 'careful',
      carefulResult: { points: 130, integrity: 22, message: '✅ Patina preserved for dating analysis!' },
      quickResult: { points: 20, integrity: -28, message: '⚠️ Artifact scratched, reduced dating accuracy.' }
    },
    {
      id: 4,
      artifact: '🔍',
      name: 'Complex Context Layer',
      description: 'Mixed artifacts and sediment requiring documentation',
      correctApproach: 'careful',
      carefulResult: { points: 135, integrity: 21, message: '✅ Perfect documentation - reveals settlement patterns!' },
      quickResult: { points: 30, integrity: -38, message: '💔 Lost critical context information!' }
    },
    {
      id: 5,
      artifact: '⚡',
      name: 'Intrusive Root System',
      description: 'Modern roots penetrating ancient layers',
      correctApproach: 'quick',
      carefulResult: { points: 40, integrity: 5, message: '✓ Excessive care for non-cultural material.' },
      quickResult: { points: 100, integrity: 14, message: '✅ Expertly removed contamination!' }
    },
    {
      id: 6,
      artifact: '🎯',
      name: 'Artifact Cluster',
      description: 'Multiple items in close association',
      correctApproach: 'careful',
      carefulResult: { points: 145, integrity: 26, message: '✅ Perfect preservation - reveals trade networks!' },
      quickResult: { points: 15, integrity: -42, message: '💔 Lost relationships between artifacts!' }
    }
  ];

  // Get scenarios based on current level
  const getScenariosByLevel = () => {
    switch(currentLevel) {
      case 1: return level1Scenarios;
      case 2: return level2Scenarios;
      case 3: return level3Scenarios;
      default: return level1Scenarios;
    }
  };

  const excavationScenarios = getScenariosByLevel();

  const initializeExcavationGame = () => {
    setSiteIntegrity(100);
    setExcavatedCount(0);
    setCurrentChallenge(null);
    // Start with first scenario for this level
    const scenarios = getScenariosByLevel();
    setCurrentChallenge(scenarios[0]);
  };

  const handleExcavate = (chooseCareful: boolean) => {
    if (!currentChallenge) return;

    const scenario = currentChallenge as any;
    const result = chooseCareful ? scenario.carefulResult : scenario.quickResult;
    
    // Check if this was the correct approach for this scenario
    const isCorrectApproach = (chooseCareful && scenario.correctApproach === 'careful') || 
                              (!chooseCareful && scenario.correctApproach === 'quick');
    
    // Update site integrity immediately
    const newIntegrity = Math.max(0, Math.min(100, siteIntegrity + result.integrity));
    setSiteIntegrity(newIntegrity);
    setScore(score + result.points);
    setExcavatedCount(excavatedCount + 1);

    // Show feedback with immediate visual consequence
    setCurrentChallenge({
      ...scenario,
      feedback: result.message,
      isCorrect: isCorrectApproach,
      integrityChange: result.integrity
    });

    // Move to next scenario after 2 seconds
    setTimeout(() => {
      if (excavatedCount + 1 < excavationScenarios.length) {
        const nextIndex = (excavatedCount + 1) % excavationScenarios.length;
        setCurrentChallenge(excavationScenarios[nextIndex]);
      }
      // Level complete is handled by excavatedCount >= length check in render
    }, 2000);
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
        <Header 
          onLogoClick={() => navigate('/dashboard')}
        >
          <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
          <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
        </Header>

        <div className="game-content">
          {selectedGame === null ? (
            <div className="game-selection">
              <div className="selection-header">
                <h2>🎮 Archaeological Challenge</h2>
                <button className="instructions-btn" onClick={() => setShowInstructions(true)}>
                  📖 How to Play
                </button>
              </div>
              <p>Complete both phases sequentially to master archaeology. Your combined score will rank you on the leaderboard!</p>
              
              <div className="games-grid">
                <div className="game-card site-integrity" onClick={() => setSelectedGame('siteIntegrity')}>
                  <h3>Phase 1: Site Integrity Challenge</h3>
                  <div className="game-card-subtitle">Excavation Decision Game</div>
                  <div className="game-icon">🏗️</div>
                  <p>Make critical excavation decisions to preserve archaeological sites. Learn why site integrity matters and master the protocols that protect irreplaceable artifacts and historical information.</p>
                  <ul className="game-features">
                    <li>🎯 3 Progressive difficulty levels</li>
                    <li>💪 Make careful vs quick excavation choices</li>
                    <li>🌍 Learn preservation best practices</li>
                    <li>📈 Earn points + Site Integrity Bonus</li>
                  </ul>
                  <button className="select-game-btn">Start Phase 1 →</button>
                </div>

                <div className="game-card" onClick={() => setSelectedGame('memory')}>
                  <h3>Phase 2: Artifact Memory Challenge</h3>
                  <div className="game-card-subtitle">Memory Matching Game</div>
                  <div className="game-icon">🧩</div>
                  <p>Test your archaeological knowledge! Match pairs of artifacts while learning fascinating facts about ancient civilizations, preservation techniques, and the importance of site integrity.</p>
                  <ul className="game-features">
                    <li>🎯 3 Progressive difficulty levels (6-12 cards)</li>
                    <li>📚 Learn facts about 9 different artifacts</li>
                    <li>⚡ Efficient matching = higher score</li>
                    <li>🏆 Combined scores rank on leaderboard</li>
                  </ul>
                  <button className="select-game-btn">Play Now →</button>
                </div>

                <div className="game-card" onClick={() => setSelectedGame('threatElimination')}>
                  <h3>Phase 3: Threat Elimination Challenge</h3>
                  <div className="game-card-subtitle">Rapid Response Game</div>
                  <div className="game-icon">🛡️</div>
                  <p>Protect archaeological sites from environmental and human threats! Eliminate dangers while carefully preserving valuable artifacts. Race against time in this action-packed defense game.</p>
                  <ul className="game-features">
                    <li>🎯 3 Progressive difficulty levels (45-55 seconds)</li>
                    <li>⚠️ 5 threat types to identify and eliminate</li>
                    <li>🏺 Avoid clicking valuable artifacts (-100 penalty!)</li>
                    <li>⚡ Fast-paced reaction gameplay</li>
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
          ) : selectedGame === 'threatElimination' ? (
            <ThreatElimination 
              onScoreSubmit={(threatScore) => {
                setGameScores({...gameScores, threatElimination: threatScore});
                setSelectedGame(null);
                navigate('/leaderboard');
              }}
              onBack={() => setSelectedGame(null)}
            />
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
                  <h3>🎮 Game Overview</h3>
                  <p>Complete an epic two-game archaeological challenge to earn your place on the leaderboard!</p>
                  <ol>
                    <li><strong>Phase 1 - Site Integrity Challenge:</strong> Make excavation decisions across 3 progressive levels to preserve archaeological sites.</li>
                    <li><strong>Phase 2 - Artifact Memory Challenge:</strong> Test your memory by matching pairs of artifacts across 3 progressive levels.</li>
                    <li><strong>Final Score:</strong> Your combined score from both games determines your leaderboard ranking!</li>
                  </ol>
                </div>

                <div className="instructions-section">
                  <h3>🏗️ Phase 1: Site Integrity Challenge - How to Play</h3>
                  <ol>
                    <li><strong>Choose Your Starting Level:</strong> Progress through 3 levels with increasing complexity.</li>
                    <li><strong>Make Excavation Decisions:</strong> For each artifact, choose between CAREFUL (slow, preserves site) or QUICK (fast but risky).</li>
                    <li><strong>Earn Points:</strong> Each correct decision earns points toward your game score.</li>
                    <li><strong>Monitor Site Health:</strong> Site Integrity % shows how well you're preserving the archaeological site (0-100%).</li>
                    <li><strong>Green = Good:</strong> Site Integrity 70%+ means excellent preservation (green text).</li>
                    <li><strong>Yellow = Caution:</strong> Site Integrity 40-69% means moderate damage (yellow text).</li>
                    <li><strong>Red = Danger:</strong> Site Integrity below 40% means severe damage (red text).</li>
                    <li><strong>Complete Phase 1:</strong> Finish all 3 levels, then automatically progress to Phase 2!</li>
                  </ol>
                </div>

                <div className="instructions-section">
                  <h3>🧩 Phase 2: Artifact Memory Challenge - How to Play</h3>
                  <ol>
                    <li><strong>Choose Your Starting Level:</strong> Level 1 (6 cards, 3 pairs) → Level 2 (8 cards, 4 pairs) → Level 3 (12 cards, 6 pairs).</li>
                    <li><strong>Click to Flip Cards:</strong> Click on cards to reveal the artifacts underneath.</li>
                    <li><strong>Match Artifact Pairs:</strong> Find two identical artifacts. Matched pairs stay flipped!</li>
                    <li><strong>Watch Your Moves:</strong> Each level has a move limit. Use fewer moves = higher score!</li>
                    <li><strong>Learn Artifact Facts:</strong> After matching all pairs, discover fascinating facts about each artifact.</li>
                    <li><strong>Complete Phase 2:</strong> Finish all 3 levels and automatically proceed to the leaderboard!</li>
                  </ol>
                </div>

                <div className="instructions-section">
                  <h3>🏆 Combined Scoring & Leaderboard</h3>
                  <ul>
                    <li><strong>Phase 1 Score:</strong> Points earned from correct excavation decisions (can exceed 100 points).</li>
                    <li><strong>Phase 2 Score:</strong> Points based on efficient card matching (fewer moves = more points).</li>
                    <li><strong>Site Integrity Bonus:</strong> Earn bonus points equal to (Site Integrity % × 50). Good preservation = bonus points!</li>
                    <li><strong>Combined Total:</strong> Phase 1 + Phase 2 + Site Integrity Bonus = Your Final Score</li>
                    <li><strong>Auto Leaderboard:</strong> After Phase 2 completes, you're automatically placed on the leaderboard ranked by combined score!</li>
                  </ul>
                </div>

                <div className="instructions-section">
                  <h3>💡 Tips for Success</h3>
                  <ul>
                    <li>🏗️ <strong>Phase 1:</strong> Read each challenge carefully - understand WHY certain choices damage the site!</li>
                    <li>🏗️ <strong>Phase 1:</strong> Maintain high Site Integrity for bonus points on the leaderboard!</li>
                    <li>🧩 <strong>Phase 2:</strong> Remember card positions - better memory = fewer moves = higher score!</li>
                    <li>⚡ <strong>Phase 2:</strong> Work efficiently - the fewer moves you use, the more bonus points you earn!</li>
                    <li>🎯 <strong>Overall:</strong> Excellence in BOTH games = highest combined score = top leaderboard ranking!</li>
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

    // Site Integrity Game (Interactive Excavation Simulator)
    if (selectedGame === 'siteIntegrity') {
      const totalScenarios = excavationScenarios.length;
      const progressPercentage = totalScenarios > 0 ? (excavatedCount / totalScenarios) * 100 : 0;

      return (
        <div className="game-container">
          <nav className="navbar">
            <div className="nav-content">
              <h1>🏗️ Excavation Simulator - Level {currentLevel}</h1>
              <div className="nav-right">
                <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
              </div>
            </div>
          </nav>

          <div className="game-content">
            <div className="match-game">
              <div className="excavation-game">
                <div className="game-header">
                  <h2>🏺 Interactive Excavation Site Manager</h2>
                  <div className="site-integrity-definition">
                    <p><strong>What is Site Integrity?</strong> Site integrity is the wholeness, preservation, and condition of a site. It's how artifacts and resources remain how they are to enhance study and knowledge</p>
                  </div>
                  <div className="game-stats">
                    <div className="stat-box">
                      <div className="stat-label">Site Preservation Health</div>
                      <div className="stat-value" style={{ 
                        color: siteIntegrity >= 70 ? '#4CAF50' : siteIntegrity >= 40 ? '#FFC107' : '#f44336'
                      }}>
                        {Math.round(siteIntegrity)}%
                      </div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Artifacts Excavated</div>
                      <div className="stat-value">{excavatedCount}/{totalScenarios}</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-label">Total Points</div>
                      <div className="stat-value" style={{ color: '#ffd700' }}>{score}</div>
                    </div>
                  </div>
                </div>

                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progressPercentage}%` }}></div>
                </div>
              </div>

              {/* Interactive Scenario Card */}
              {currentChallenge && (
                <div className={`scenario-card ${(currentChallenge as any).feedback ? 'revealed' : ''}`}>
                  <div className="scenario-header">
                    <div className="artifact-display">
                      <div className="artifact-emoji">{currentChallenge.artifact}</div>
                      <div className="artifact-info">
                        <h3>{currentChallenge.name}</h3>
                        <p className="artifact-description">{currentChallenge.description}</p>
                      </div>
                    </div>
                  </div>

                  {!(currentChallenge as any).feedback ? (
                    <div className="scenario-choices">
                      <div className="scenario-text">
                        <strong>How should you excavate this artifact?</strong>
                      </div>
                      
                      <button
                        className="scenario-btn careful-btn"
                        onClick={() => handleExcavate(true)}
                      >
                        <div className="btn-icon">🛡️</div>
                        <div className="btn-title">Careful Excavation</div>
                        <div className="btn-subtitle">Slow, documented, preserve site integrity</div>
                        <div className="btn-result">✅ Preserves artifacts & evidence</div>
                      </button>

                      <button
                        className="scenario-btn quick-btn"
                        onClick={() => handleExcavate(false)}
                      >
                        <div className="btn-icon">⚡</div>
                        <div className="btn-title">Speed Excavation</div>
                        <div className="btn-subtitle">Fast, risk-taking approach</div>
                        <div className="btn-result">⚠️ Risk damaging artifacts</div>
                      </button>
                    </div>
                  ) : (
                    <div className="scenario-result">
                      <div className={`result-banner ${(currentChallenge as any).isCorrect ? 'success' : 'danger'}`}>
                        <div className="result-icon">
                          {(currentChallenge as any).isCorrect ? '✅' : '❌'}
                        </div>
                        <div className="result-text">
                          {(currentChallenge as any).feedback}
                        </div>
                        <div className="result-score">
                          {(currentChallenge as any).integrityChange > 0 ? '+' : ''}{(currentChallenge as any).integrityChange} Site Integrity
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Level Complete */}
              {excavatedCount >= excavationScenarios.length && (
                <div className="challenge-result correct">
                  <div className="feedback-header">🎉 Level Complete!</div>
                  <div className="feedback-message">
                    You've completed all excavation scenarios. Your site integrity is {Math.round(siteIntegrity)}%!
                  </div>
                  <button 
                    className="continue-btn"
                    onClick={() => {
                      if (currentLevel < 3) {
                        initializeLevel(currentLevel + 1);
                      } else {
                        setGameState('finished');
                      }
                    }}
                  >
                    {currentLevel < 3 ? `Continue to Level ${currentLevel + 1} →` : '🏆 View Leaderboard'}
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
          <Header 
            onLogoClick={() => navigate('/dashboard')}
          >
            <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
          </Header>

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
                    <button className="continue-btn" onClick={() => {
                      updateUserScore(score);
                      addScoreToLeaderboard(user?.displayName || 'Anonymous', score);
                      navigate('/leaderboard');
                    }}>
                      🏆 View Leaderboard
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
          <Header 
            onLogoClick={() => navigate('/dashboard')}
          >
            <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
          </Header>

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
                      <div className="score-label">Phase 2 Score</div>
                      <div className="score-value">{score}</div>
                    </div>
                    <div className="achievement-message">
                      You used {moves} moves but the limit was {currentMoveLimit}. Try to match pairs more carefully and use fewer moves!
                    </div>
                    <div className="combined-score-breakdown">
                      <h4>📊 Your Combined Score</h4>
                      <div className="score-row">
                        <span className="score-item-label">Phase 1 (Site Integrity):</span>
                        <span className="score-item-value">{gameScores.siteIntegrity}</span>
                      </div>
                      <div className="score-row">
                        <span className="score-item-label">Phase 2 (Memory Match):</span>
                        <span className="score-item-value">{score}</span>
                      </div>
                      <div className="score-row">
                        <span className="score-item-label">Site Integrity Bonus (% × 50):</span>
                        <span className="score-item-value">+{Math.round((siteIntegrity / 100) * 50)}</span>
                      </div>
                      <div className="score-row total">
                        <span className="score-item-label"><strong>Total Combined Score:</strong></span>
                        <span className="score-item-value total-value"><strong>{score + gameScores.siteIntegrity + Math.round((siteIntegrity / 100) * 50)}</strong></span>
                      </div>
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
                    // Save memory game score and calculate combined score with site integrity bonus
                    const memoryGameScore = score;
                    const newGameScores = { ...gameScores, memory: memoryGameScore };
                    setGameScores(newGameScores);
                    
                    // Calculate combined score: Memory + SiteIntegrity + (SiteIntegrity% × 50)
                    const integrityBonus = Math.round((siteIntegrity / 100) * 50);
                    const combinedScore = memoryGameScore + newGameScores.siteIntegrity + integrityBonus;
                    
                    updateUserScore(combinedScore);
                    addScoreToLeaderboard(user?.displayName || 'Anonymous', combinedScore);
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
                    <div className="score-label">Phase 2 Score</div>
                    <div className="score-value">{score}</div>
                  </div>
                  <div className="achievement-message">
                    🏆 Congratulations! You've matched all artifacts and learned incredible facts about ancient civilizations!
                  </div>
                  <div className="combined-score-breakdown">
                    <h4>📊 Your Combined Score</h4>
                    <div className="score-row">
                      <span className="score-item-label">Phase 1 (Site Integrity):</span>
                      <span className="score-item-value">{gameScores.siteIntegrity}</span>
                    </div>
                    <div className="score-row">
                      <span className="score-item-label">Phase 2 (Memory Match):</span>
                      <span className="score-item-value">{score}</span>
                    </div>
                    <div className="score-row">
                      <span className="score-item-label">Site Integrity Bonus (% × 50):</span>
                      <span className="score-item-value">+{Math.round((siteIntegrity / 100) * 50)}</span>
                    </div>
                    <div className="score-row total">
                      <span className="score-item-label"><strong>Total Combined Score:</strong></span>
                      <span className="score-item-value total-value"><strong>{score + gameScores.siteIntegrity + Math.round((siteIntegrity / 100) * 50)}</strong></span>
                    </div>
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
                    // Save memory game score and calculate combined score with site integrity bonus
                    const memoryGameScore = score;
                    const newGameScores = { ...gameScores, memory: memoryGameScore };
                    setGameScores(newGameScores);
                    
                    // Calculate combined score: Memory + SiteIntegrity + (SiteIntegrity% × 50)
                    const integrityBonus = Math.round((siteIntegrity / 100) * 50);
                    const combinedScore = memoryGameScore + newGameScores.siteIntegrity + integrityBonus;
                    
                    updateUserScore(combinedScore);
                    addScoreToLeaderboard(user?.displayName || 'Anonymous', combinedScore);
                    navigate('/leaderboard');
                  }}>
                    🏆 View Final Leaderboard
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
                  <div className="score-label">Phase 1 Score</div>
                  <div className="score-value">{score}</div>
                </div>
                <div className="achievement-message">
                  🏆 Excellent work! You've demonstrated understanding of archaeological site preservation through practical excavation decisions!
                </div>
                <div className="achievement-detail">
                  Site Integrity Maintained: {Math.round(siteIntegrity)}% | Excavations Completed: {excavatedCount}
                </div>
                <div className="bonus-preview">
                  <div className="bonus-item">
                    <span className="bonus-label">Site Integrity Bonus (% × 50):</span>
                    <span className="bonus-value">+{Math.round((siteIntegrity / 100) * 50)} pts</span>
                  </div>
                  <div className="bonus-note">💡 Complete Phase 2 to see your combined score!</div>
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
                  // Save site integrity game score and progress to Memory Match
                  const siteIntegrityScore = score;
                  const newGameScores = { ...gameScores, siteIntegrity: siteIntegrityScore };
                  setGameScores(newGameScores);
                  
                  // Auto-transition to Memory Match game
                  setSelectedGame('memory');
                  setGameState('levelSelect');
                  setScore(0);
                  setCurrentLevel(0);
                }}>
                  ➜ Proceed to Memory Match Game
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="game-container">
      <Header 
        onLogoClick={() => navigate('/dashboard')}
      >
        <span className="user-info">Welcome, {user?.displayName || 'Explorer'}!</span>
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </Header>

      <div className="game-content">
        <section className="about-section">
          <h3>🏆 How to Play</h3>
          <ul>
            <li><strong>Level Select:</strong> Choose from 3 excavation sites of increasing difficulty</li>
            <li><strong>Grid Excavation:</strong> Click on grid squares to excavate and reveal artifacts</li>
            <li><strong>Find Artifacts:</strong> Discover hidden artifacts randomly placed in the dig site</li>
            <li><strong>Use Hints:</strong> Get 3 hints per level that identify specific artifacts</li>
            <li><strong>Earn Points:</strong> Common artifacts (10-20pts) to legendary items (100pts)</li>
            <li><strong>Combo System:</strong> Find consecutive artifacts without digging empty squares for bonus points</li>
            <li><strong>Rarity Levels:</strong> Common → Uncommon → Rare → Legendary</li>
            <li><strong>Level Progression:</strong> Complete all 3 sites to become a Master Archaeologist</li>
            <li><strong>Leaderboard:</strong> Compete with other players and climb the rankings</li>
          </ul>
        </section>

        <section className="about-section">
          <h3>⛏️ Game Features</h3>
          <div className="features-section">
            <div className="feature">
              <div className="feature-emoji">🎮</div>
              <h4>Multiple Levels</h4>
              <p>3 unique excavation sites with increasing grid sizes (5x5 → 7x7)</p>
            </div>
            <div className="feature">
              <div className="feature-emoji">🎯</div>
              <h4>Strategic Gameplay</h4>
              <p>Choose when to use hints wisely for better strategic play</p>
            </div>
            <div className="feature">
              <div className="feature-emoji">🏅</div>
              <h4>Rarity System</h4>
              <p>Collect different artifact rarities for varying rewards</p>
            </div>
            <div className="feature">
              <div className="feature-emoji">⚡</div>
              <h4>Combo Multiplier</h4>
              <p>Build combos for bonus points on consecutive discoveries</p>
            </div>
          </div>
        </section>

        <section className="about-section">
          <h3>ℹ️ About This Game</h3>
          <p>
            This interactive Relics Reimagined is designed to introduce players to the exciting world 
            of archaeological discovery. While simplified, it captures the essence of what archaeologists 
            do: search for artifacts, analyze findings, and uncover the mysteries of past civilizations.
          </p>
          <p>
            Players at all levels can enjoy this educational game and learn about different historical 
            periods and the importance of preserving our cultural heritage.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Game;
