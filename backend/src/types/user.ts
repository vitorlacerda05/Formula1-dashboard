export type UserType = 'Administrador' | 'Piloto' | 'Escuderia';

export interface User {
  userid: number;
  login: string;
  password: string;
  tipo: UserType;
  idOriginal: number;
  ativo: boolean;
  ultimoLogin?: Date;
  fullName?: string;
  teamName?: string;
}

export interface UserSession {
  userid: number;
  login: string;
  tipo: UserType;
  idOriginal: number;
  isAuthenticated: boolean;
  fullName?: string;
  teamName?: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  session?: UserSession;
} 