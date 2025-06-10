import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  userid: number;
  login: string;
  tipo: string;
  isAuthenticated: boolean;
  type?: 'administrator' | 'team' | 'driver';
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapTipoToType(tipo: string): 'administrator' | 'team' | 'driver' | undefined {
  switch (tipo) {
    case 'Administrador':
      return 'administrator';
    case 'Escuderia':
      return 'team';
    case 'Piloto':
      return 'driver';
    default:
      return undefined;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ login: username, password }),
      });
      const data = await response.json();
      if (data.success && data.session) {
        const mappedUser = {
          ...data.session,
          type: mapTipoToType(data.session.tipo),
        };
        setUser(mappedUser);
        return true;
      }
      setUser(null);
      return false;
    } catch (error) {
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    await fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
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
