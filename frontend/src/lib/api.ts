const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Função auxiliar para fazer requests
const apiRequest = async (endpoint: string) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// Dashboard Admin APIs
export const dashboardApi = {
  // Buscar estatísticas gerais do admin
  getAdminStats: async () => {
    return apiRequest('/dashboard/admin/stats')
  },

  // Buscar corridas do ano atual
  getCurrentYearRaces: async () => {
    return apiRequest('/dashboard/admin/races/current-year')
  },

  // Buscar equipes do ano atual
  getCurrentYearTeams: async () => {
    return apiRequest('/dashboard/admin/teams/current-year')
  },

  // Buscar pilotos do ano atual
  getCurrentYearDrivers: async () => {
    return apiRequest('/dashboard/admin/drivers/current-year')
  },

  // Buscar estatísticas de uma equipe específica
  getTeamStats: async (constructorId: string) => {
    return apiRequest(`/dashboard/team/${constructorId}/stats`)
  },

  // Buscar estatísticas de um piloto específico
  getDriverStats: async (driverId: string) => {
    return apiRequest(`/dashboard/driver/${driverId}/stats`)
  },

  // Buscar pilotos de uma equipe pelo sobrenome
  findDriversByLastName: async (constructorId: string, lastName: string) => {
    return apiRequest(`/dashboard/team/${constructorId}/drivers/search/${lastName}`);
  },
}

// Tipos para as respostas da API
export interface AdminStats {
  total_pilotos: number
  total_escuderias: number
  total_temporadas: number
}

export interface RaceData {
  nome_corrida: string
  data_corrida: string
  max_voltas_registradas: number
  duracao_estimada_formatada: string
}

export interface TeamData {
  nome_escuderia: string
  total_pontos_ano: number
}

export interface DriverData {
  piloto_id: number;
  nome_piloto: string;
  total_pontos_ano: number;
  nacionalidade: string;
}

export interface TeamStats {
  vitorias: number
  pilotos_unicos: number
  primeiro_ano: number
  ultimo_ano: number
}

export interface DriverPeriod {
  primeiro_ano: number
  ultimo_ano: number
}

export interface DriverPerformance {
  ano: number
  circuito: string
  pontos: number
  vitorias: number
  total_corridas: number
}

export interface DriverStats {
  period: DriverPeriod
  performance: DriverPerformance[]
} 