export type UserType = 'Administrador' | 'Piloto' | 'Escuderia';

export interface User {
  userid: number;
  login: string;
  tipo: UserType;
  idOriginal: number;
  ativo: boolean;
  ultimoLogin?: Date;
}

export interface UserSession {
  userid: number;
  login: string;
  tipo: UserType;
  idOriginal: number;
  isAuthenticated: boolean;
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