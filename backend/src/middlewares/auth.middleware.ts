import { FastifyRequest, FastifyReply } from 'fastify'
import { UserSession } from '../types/user'

declare module 'fastify' {
  interface FastifyRequest {
    user?: UserSession;
  }
}

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    // Verificar se existe uma sessão válida
    const sessionData = request.cookies['session']
    
    if (!sessionData) {
      return reply.code(401).send({
        success: false,
        message: 'Não autorizado'
      })
    }

    try {
      const session = JSON.parse(sessionData) as UserSession
      
      if (!session.isAuthenticated) {
        return reply.code(401).send({
          success: false,
          message: 'Sessão inválida'
        })
      }

      // Adiciona o usuário ao request para uso posterior
      request.user = session
    } catch (error) {
      return reply.code(401).send({
        success: false,
        message: 'Sessão inválida'
      })
    }
  } catch (error) {
    console.error('Erro na autenticação:', error)
    return reply.code(500).send({
      success: false,
      message: 'Erro interno do servidor'
    })
  }
} 