import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ResultadoStatus {
  nome_status: string
  quantidade_resultados: number
}

interface ReportStatusContextType {
  resultados: ResultadoStatus[]
  isLoading: boolean
  fetchResultados: () => Promise<void>
}

const ReportStatusContext = createContext<ReportStatusContextType | undefined>(undefined)

export const ReportStatusProvider = ({ children }: { children: ReactNode }) => {
  const [resultados, setResultados] = useState<ResultadoStatus[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const fetchResultados = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/reports/status-count')
      const data = await response.json()
      setResultados(data)
    } catch (error) {
      console.error('Erro ao buscar dados do relatório de status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResultados()
  }, [])

  return (
    <ReportStatusContext.Provider value={{ resultados, isLoading, fetchResultados }}>
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
