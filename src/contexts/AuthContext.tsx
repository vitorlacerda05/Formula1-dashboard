
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'administrator' | 'team' | 'driver';

export interface User {
  id: string;
  type: UserType;
  name: string;
  teamName?: string;
  driversCount?: number;
  fullName?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'admin': {
    id: 'admin',
    type: 'administrator',
    name: 'admin'
  },
  'ferrari': {
    id: 'ferrari',
    type: 'team',
    name: 'ferrari',
    teamName: 'Scuderia Ferrari',
    driversCount: 2
  },
  'hamilton': {
    id: 'hamilton',
    type: 'driver',
    name: 'hamilton',
    fullName: 'Lewis Hamilton',
    teamName: 'Mercedes'
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simple authentication logic
    if (password === '123' && mockUsers[username]) {
      setUser(mockUsers[username]);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
