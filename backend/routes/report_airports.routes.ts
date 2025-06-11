import { FastifyInstance } from 'fastify'
import { getAeroportosProximos } from '../src/controllers/report_airports.controller'

export default async function reportAirportsRoutes(fastify: FastifyInstance) {
  // Define o endpoint GET que responde com os aeroportos próximos a uma cidade
  fastify.get('/reports/airports-nearby', getAeroportosProximos)
}
