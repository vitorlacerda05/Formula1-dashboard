import { FastifyInstance } from 'fastify'
import { 
  getAdminStats, 
  getCurrentYearRaces, 
  getCurrentYearTeams, 
  getCurrentYearDrivers, 
  getTeamStats, 
  getDriverStats,
  findDriverByLastName
} from '../src/controllers/dashboard.controller'

export default async function dashboardRoutes(fastify: FastifyInstance) {
  // Rotas para administrador
  fastify.get('/admin/stats', getAdminStats)
  fastify.get('/admin/races/current-year', getCurrentYearRaces)
  fastify.get('/admin/teams/current-year', getCurrentYearTeams)
  fastify.get('/admin/drivers/current-year', getCurrentYearDrivers)
  
  // Rotas para escuderias
  fastify.get('/team/:constructorId/stats', getTeamStats)
  fastify.get('/team/:constructorId/drivers/search/:lastName', findDriverByLastName)
  
  // Rotas para pilotos
  fastify.get('/driver/:driverId/stats', getDriverStats)
} 