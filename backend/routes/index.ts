import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { LoginRequest, LoginResponse, ApiResponse } from '../@types'

export default async function routes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/health', async (_request: FastifyRequest, _reply: FastifyReply): Promise<ApiResponse> => {
    return { success: true, data: { status: 'OK', message: 'F1 Dashboard API is running' } }
  })

  // Auth routes
  fastify.post('/auth/login', async (request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) => {
    try {
      const { email, password } = request.body

      // Basic validation
      if (!email || !password) {
        reply.status(400).send({ 
          success: false, 
          error: 'Email and password are required' 
        })
        return
      }

      // Mock authentication logic - replace with actual authentication
      if (email === 'admin@f1dashboard.com' && password === 'admin123') {
        const response: LoginResponse = {
          success: true,
          token: 'mock-jwt-token-12345',
          user: {
            id: '1',
            email: email,
            name: 'Admin User'
          }
        }
        reply.status(200).send(response)
      } else {
        reply.status(401).send({ 
          success: false, 
          error: 'Invalid credentials' 
        })
      }
    } catch (error) {
      fastify.log.error(error)
      reply.status(500).send({ 
        success: false, 
        error: 'Authentication failed' 
      })
    }
  })
}