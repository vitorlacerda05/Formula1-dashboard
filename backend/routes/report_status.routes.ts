import { FastifyInstance } from 'fastify'
import { getRelatorioStatus } from '../src/controllers/report_status.controller'

export async function reportStatusRoutes(fastify: FastifyInstance) {
  fastify.get('/reports/status-count', getRelatorioStatus)
}
