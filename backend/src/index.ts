import Fastify, { FastifyInstance } from 'fastify'
import { Server, IncomingMessage, ServerResponse } from 'http'
import routes from '../routes/index'

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> = Fastify({
  logger: true, // Habilita o logger embutido do Fastify (ótimo para desenvolvimento)
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