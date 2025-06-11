import { FastifyInstance } from 'fastify'
import { getRelatorioStatus, getRelatorioEquipesPilotos } from '../src/controllers/report_status.controller'

export async function reportStatusRoutes(fastify: FastifyInstance) {
  fastify.get('/reports/status-count', getRelatorioStatus)
  fastify.get('/reports/teams-drivers', getRelatorioEquipesPilotos)
}
