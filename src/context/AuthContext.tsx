import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// LOCAL FILE-BASED DATABASE: Using localStorage as persistent user database
// All user registration data is stored in localStorage instead of Firebase

// Storage key for user database
const USER_DATABASE_KEY = 'archaeologyedu_user_database';

// User registration data structure
interface UserRegistration {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'customer';
  createdAt: string;
}

// Mock user interface (for logged-in user session)
interface MockUser {
  uid: string;
  email: string;
  displayName: string | null;
  role: 'admin' | 'customer';
}

// Initialize user database from localStorage
const initializeUserDatabase = () => {
  try {
    const existing = localStorage.getItem(USER_DATABASE_KEY);
    if (existing) {
      return JSON.parse(existing);
    }
  } catch (error) {
    console.error('Error loading user database:', error);
  }

  // Default database with test admin user and instructor accounts
  const defaultDatabase: { [email: string]: UserRegistration } = {
    'cyber@example.com': {
      email: 'cyber@example.com',
      password: 'turtle2025',
      displayName: 'Cyber Archaeologist',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    'instructor1@relicsreimagined.com': {
      email: 'instructor1@relicsreimagined.com',
      password: 'SiteIntegrity',
      displayName: 'Instructor One',
      role: 'customer',
      createdAt: new Date().toISOString()
    },
    'instructor2@relicsreimagined.com': {
      email: 'instructor2@relicsreimagined.com',
      password: 'SiteIntegrity',
      displayName: 'Instructor Two',
      role: 'customer',
      createdAt: new Date().toISOString()
    }
  };

  // Save default database to localStorage
  localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(defaultDatabase));
  return defaultDatabase;
};

// In-memory cache of user database
let mockUsers = initializeUserDatabase();

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
  setUserDirect: (user: MockUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functions
const mockSignUp = (email: string, password: string, displayName: string, role: 'admin' | 'customer' = 'customer'): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mockUsers[email]) {
        reject(new Error('auth/email-already-in-use'));
      } else {
        // Create new user registration
        const newUserReg: UserRegistration = {
          email,
          password,
          displayName: displayName || 'Player',
          role,
          createdAt: new Date().toISOString()
        };

        // Add to in-memory database
        mockUsers[email] = newUserReg;

        // Save to localStorage (file-based database)
        localStorage.setItem(USER_DATABASE_KEY, JSON.stringify(mockUsers));

        // Create session user with consistent UID based on email
        const user: MockUser = {
          uid: btoa(email).replace(/=/g, '').substring(0, 15),
          email,
          displayName: displayName || 'Player',
          role
        };
        resolve(user);
      }
    }, 500);
  });
};

const mockSignIn = (email: string, password: string): Promise<MockUser> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const userReg = mockUsers[email] as UserRegistration | undefined;
      if (!userReg) {
        reject(new Error('auth/user-not-found'));
      } else if (userReg.password !== password) {
        reject(new Error('auth/wrong-password'));
      } else {
        // Create session user with consistent UID based on email
        const mockUser: MockUser = {
          uid: btoa(email).replace(/=/g, '').substring(0, 15),
          email,
          displayName: userReg.displayName,
          role: userReg.role
        };
        resolve(mockUser);
      }
    }, 500);
  });
};

const mockLogOut = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 300);
  });
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to sync user from localStorage
  const syncUserFromStorage = () => {
    const savedUser = localStorage.getItem('mockAuthUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    // Check for saved session on mount
    syncUserFromStorage();
    setLoading(false);

    // Listen for storage changes (other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mockAuthUser') {
        syncUserFromStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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

  const setUserDirect = (user: MockUser | null) => {
    setUser(user);
    if (user) {
      localStorage.setItem('mockAuthUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('mockAuthUser');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, updateUserScore, addScoreToLeaderboard, getLeaderboard, setUserDirect }}>
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
