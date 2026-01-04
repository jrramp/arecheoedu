import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/About.css';

const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <Header 
        onLogoClick={() => navigate('/dashboard')}
      >
        <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
      </Header>

      <div className="about-content">
        <h2>About Archaeology</h2>

        <section className="about-section">
          <h3>🏺 What is Archaeology?</h3>
          <p>
            Archaeology is the scientific study of past human societies and cultures through 
            the examination of physical remains and artifacts. Archaeologists work to understand 
            how people lived, worked, and interacted in ancient times by excavating sites and 
            analyzing what they find.
          </p>
        </section>

        <section className="about-section">
          <h3>🔍 The Archaeological Process</h3>
          <ol>
            <li><strong>Survey:</strong> Identify and map potential archaeological sites</li>
            <li><strong>Excavation:</strong> Carefully dig and uncover artifacts</li>
            <li><strong>Documentation:</strong> Record precise locations and contexts</li>
            <li><strong>Analysis:</strong> Study artifacts to learn about the past</li>
            <li><strong>Interpretation:</strong> Piece together the story of ancient peoples</li>
          </ol>
        </section>

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
          <h3>🌍 Famous Archaeological Sites</h3>
          <div className="sites-grid">
            <div className="site-card">
              <h4>🐪 Pyramids of Giza</h4>
              <p>Ancient Egyptian tombs built as monuments to pharaohs.</p>
            </div>
            <div className="site-card">
              <h4>🏛️ Colosseum</h4>
              <p>Ancient Roman amphitheater used for gladiator battles and public events.</p>
            </div>
            <div className="site-card">
              <h4>🗿 Easter Island</h4>
              <p>Polynesian island with mysterious stone statues called moai.</p>
            </div>
            <div className="site-card">
              <h4>🏯 Great Wall of China</h4>
              <p>Massive defensive structure built across ancient China's northern boundaries.</p>
            </div>
            <div className="site-card">
              <h4>🛕 Angkor Wat</h4>
              <p>Largest religious monument in Cambodia, built by the Khmer Empire.</p>
            </div>
            <div className="site-card">
              <h4>🏺 Pompeii</h4>
              <p>Roman city preserved under volcanic ash from Mount Vesuvius.</p>
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

export default About;
