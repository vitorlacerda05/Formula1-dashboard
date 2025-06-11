import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginResponse, SessionResponse } from '../types/api';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  // Verificar sessão existente na inicialização
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });
      
      const data: SessionResponse = await response.json();
      
      if (data.success && data.isAuthenticated && data.session) {
        const mappedUser: User = {
          ...data.session,
          type: mapTipoToType(data.session.tipo),
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

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
      const data: LoginResponse = await response.json();
      if (data.success && data.session) {
        const mappedUser: User = {
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
    try {
      await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
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
