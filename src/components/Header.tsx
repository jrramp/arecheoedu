import React, { type ReactNode } from 'react';

interface HeaderProps {
  onLogoClick: () => void;
  children?: ReactNode;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick, children }) => {
  return (
    <nav className="navbar">
      <div className="nav-content">
        <div>
          <h1 style={{ cursor: 'pointer' }} onClick={onLogoClick}>
            🏛️ Relics Reimagined
          </h1>
          <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
            For the students, by the students
          </p>
        </div>
        <div className="nav-right">
          {children}
        </div>
      </div>
    </nav>
  );
};

export default Header;
