import Fastify, { FastifyInstance } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import fastifyCookie from '@fastify/cookie'
import routes from '../routes/index'
import cors from '@fastify/cors';

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
  logger: true,
})

// Registrar plugins
server.register(fastifyCookie, {
  secret: process.env.COOKIE_SECRET || 'um-segredo-muito-seguro',
  parseOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60,
    path: '/'
  }
})

// **Registrar o CORS aqui**
server.register(cors, {
  origin: 'http://localhost:8080',
  credentials: true
})

// Register API routes
server.register(routes, { prefix: '/api' })

// Rota de exemplo (health check)
server.get('/', async (_request, _reply) => {
  return { message: 'Servidor F1 API está no ar!' }
})

const start = async () => {
  try {
    const port = process.env.PORT || 3000
    await server.listen({ port: Number(port), host: '0.0.0.0' })
    server.log.info(`Servidor escutando na porta ${port}`)
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()