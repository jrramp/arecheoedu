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


      </div>
    </div>
  );
};

export default About;
