import { createContext, useContext, useState, ReactNode } from 'react'

interface ResultadoStatus {
  nome_status: string
  quantidade_resultados: number
}

interface EquipePiloto {
  nome_equipe: string
  numero_pilotos: number
  total_corridas: number
  media_voltas: number
  tempo_total_formatado: string
}

interface ReportStatusContextType {
  resultados: ResultadoStatus[]
  equipesPilotos: EquipePiloto[]
  isLoading: boolean
  isLoadingTeams: boolean
  fetchResultados: () => Promise<void>
  fetchEquipesPilotos: () => Promise<void>
}

const ReportStatusContext = createContext<ReportStatusContextType | undefined>(undefined)

export const ReportStatusProvider = ({ children }: { children: ReactNode }) => {
  const [resultados, setResultados] = useState<ResultadoStatus[]>([])
  const [equipesPilotos, setEquipesPilotos] = useState<EquipePiloto[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingTeams, setIsLoadingTeams] = useState(false)

  const fetchResultados = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('http://localhost:3000/api/reports/status-count')
      const data = await response.json()
      
      // Garantir que data é um array
      if (Array.isArray(data)) {
        setResultados(data)
      } else {
        console.error('Dados recebidos não são um array:', data)
        setResultados([])
      }
    } catch (error) {
      console.error('Erro ao buscar dados do relatório de status:', error)
      setResultados([])
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEquipesPilotos = async () => {
    try {
      setIsLoadingTeams(true)
      const response = await fetch('http://localhost:3000/api/reports/teams-drivers')
      const data = await response.json()
      
      // Garantir que data é um array
      if (Array.isArray(data)) {
        setEquipesPilotos(data)
      } else {
        console.error('Dados recebidos não são um array:', data)
        setEquipesPilotos([])
      }
    } catch (error) {
      console.error('Erro ao buscar dados do relatório de equipes:', error)
      setEquipesPilotos([])
    } finally {
      setIsLoadingTeams(false)
    }
  }

  return (
    <ReportStatusContext.Provider value={{ 
      resultados, 
      equipesPilotos, 
      isLoading, 
      isLoadingTeams, 
      fetchResultados, 
      fetchEquipesPilotos 
    }}>
      {children}
    </ReportStatusContext.Provider>
  )
}

export const useReportStatus = () => {
  const context = useContext(ReportStatusContext)
  if (context === undefined) {
    throw new Error('useReportStatus deve ser usado dentro de um ReportStatusProvider')
  }
  return context
}
