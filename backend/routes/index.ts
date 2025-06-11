import { FastifyInstance } from 'fastify'
import { ApiResponse } from '../@types'
import authRoutes from './auth.routes'
import { reportStatusRoutes } from './report_status.routes'
import reportAirportsRoutes from './report_airports.routes'

export default async function routes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async (): Promise<ApiResponse> => {
    return { success: true, data: { status: 'OK', message: 'F1 Dashboard API is running' } }
  })

  // Registrar rotas de autenticação
  fastify.register(authRoutes, { prefix: '/auth' })

  // Registrar rotas de relatório
  fastify.register(reportStatusRoutes) // <- adiciona as rotas do relatório 1
  fastify.register(reportAirportsRoutes) // <- adiciona as rotas do relatório 2

  // Aqui você pode registrar outras rotas conforme necessário
}