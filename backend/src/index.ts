import Fastify, { FastifyInstance } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifyCookie from '@fastify/cookie'
import routes from '../routes/index'
import cors from '@fastify/cors'
import pool from './config/database' // Importar pool de conexão
import dotenv from 'dotenv'
dotenv.config()

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
  logger: true,
})

// Função para verificar a conexão com o banco de dados
const checkDatabaseConnection = async () => {
  try {
    const client = await pool.connect()
    server.log.info('Conexão com o banco de dados estabelecida com sucesso.')
    client.release()
  } catch (err) {
    server.log.error('Não foi possível conectar ao banco de dados:', err)
    process.exit(1)
  }
}

// Registrar plugins
server.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'um-segredo-muito-seguro-para-desenvolvimento',
  parseOptions: {} // options for parsing cookies
})

// CORS configuration
server.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Permitir frontend configurável
  credentials: true, // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

// Register API routes
server.register(routes, { prefix: '/api' })

// Rota de exemplo (health check)
server.get('/', async () => {
  return { message: 'Servidor F1 API está no ar!' }
})

const start = async () => {
  try {
    await checkDatabaseConnection() // Verificar conexão antes de iniciar o servidor
    const port = process.env.PORT || 3000
    await server.listen({ port: Number(port), host: '0.0.0.0' })
    server.log.info(`Servidor escutando na porta ${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()