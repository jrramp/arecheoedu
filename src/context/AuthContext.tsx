import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// DEVELOPMENT MODE: Using mock authentication for testing without Firebase
// All authentication is simulated in-memory for demo purposes

// Mock user interface
interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
}

// Store for mock authentication
let mockCurrentUser: MockUser | null = null;
const mockUsers: { [email: string]: { email: string; password: string; displayName: string } } = {
  'cyber@example.com': { email: 'cyber@example.com', password: 'turtle2025', displayName: 'Cyber Archaeologist' },
};

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

interface AuthContextType {
  user: MockUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  updateUserScore: (score: number) => void;
  addScoreToLeaderboard: (name: string, score: number) => void;
  getLeaderboard: () => LeaderboardEntry[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functions
const mockSignUp = (email: string, password: string, displayName: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers[email]) {
        reject(new Error('auth/email-already-in-use'));
      } else {
        mockUsers[email] = { email, password, displayName: displayName || 'Player' };
        const user: MockUser = {
          uid: Math.random().toString(36).substr(2, 9),
          email,
          displayName: displayName || 'Player'
        };
        mockCurrentUser = user;
        resolve(user);
      }
    }, 500);
  });
};

const mockSignIn = (email: string, password: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = mockUsers[email];
      if (!user) {
        reject(new Error('auth/user-not-found'));
      } else if (user.password !== password) {
        reject(new Error('auth/wrong-password'));
      } else {
        const mockUser: MockUser = {
          uid: Math.random().toString(36).substr(2, 9),
          email,
          displayName: user.displayName
        };
        mockCurrentUser = mockUser;
        resolve(mockUser);
      }
    }, 500);
  });
};

const mockLogOut = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockCurrentUser = null;
      resolve();
    }, 300);
  });
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for saved session
    setTimeout(() => {
      const savedUser = localStorage.getItem('mockAuthUser');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          setUser(null);
        }
      } else {
        setUser(mockCurrentUser);
      }
      setLoading(false);
    }, 100);
  }, []);

  const logout = async () => {
    await mockLogOut();
    setUser(null);
    localStorage.removeItem('mockAuthUser');
  };

  const updateUserScore = (score: number) => {
    if (user) {
      localStorage.setItem(`${user.email}_score`, score.toString());
    }
  };

  const addScoreToLeaderboard = (name: string, score: number) => {
    const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    leaderboard.push({
      name,
      score,
      date: new Date().toLocaleDateString()
    });
    // Sort by score descending
    leaderboard.sort((a, b) => b.score - a.score);
    // Keep top 100 entries
    leaderboard.splice(100);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  const getLeaderboard = (): LeaderboardEntry[] => {
    try {
      return JSON.parse(localStorage.getItem('leaderboard') || '[]');
    } catch {
      return [];
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUserScore, addScoreToLeaderboard, getLeaderboard }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Export mock auth functions for login/register pages
export { mockSignUp, mockSignIn, mockLogOut };
