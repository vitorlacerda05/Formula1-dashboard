export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    email: string
    name: string
  }
  error?: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}
