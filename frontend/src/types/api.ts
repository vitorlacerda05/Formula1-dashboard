export interface User {
  userid: number;
  login: string;
  tipo: string;
  idOriginal: number;
  isAuthenticated: boolean;
  type?: 'administrator' | 'team' | 'driver';
  teamName?: string;
  fullName?: string;
  teamId?: number;
  driverId?: number;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
  session?: User;
}

export interface SessionResponse {
  success: boolean;
  isAuthenticated: boolean;
  message?: string;
  session?: User;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
} 