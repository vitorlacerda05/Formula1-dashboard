import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthService } from '../services/auth.service'
import { LoginRequest } from '../types/user'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  async login(request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) {
    try {
      console.log('Recebida requisição de login:', request.body)
      const loginRequest = request.body
      const ipOrigem = this.authService.getClientIp(request)
      
      const response = await this.authService.authenticateUser(loginRequest)
      console.log('Resposta da autenticação:', response)
      
      if (response.success && response.session) {
        // Salvar sessão em cookie
        reply.setCookie('session', JSON.stringify(response.session), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 7 * 24 * 60 * 60, // 7 dias em segundos
          path: '/',
          sameSite: 'lax'
        })

        return reply.code(200).send(response)
      }

      return reply.code(401).send(response)
    } catch (error) {
      console.error('Erro no login:', error)
      return reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  async checkSession(request: FastifyRequest, reply: FastifyReply) {
    try {
      const sessionData = request.cookies['session']
      
      if (!sessionData) {
        return reply.code(200).send({
          success: false,
          isAuthenticated: false,
          message: 'Nenhuma sessão encontrada'
        })
      }

      try {
        const session = JSON.parse(sessionData)
        
        if (!session.isAuthenticated) {
          return reply.code(200).send({
            success: false,
            isAuthenticated: false,
            message: 'Sessão inválida'
          })
        }

        // Verificar se o usuário ainda está ativo no banco
        const userValidation = await this.authService.validateUser(session.userid)
        
        if (!userValidation) {
          // Limpar cookie inválido
          reply.clearCookie('session')
          return reply.code(200).send({
            success: false,
            isAuthenticated: false,
            message: 'Usuário inativo ou não encontrado'
          })
        }

        return reply.code(200).send({
          success: true,
          isAuthenticated: true,
          session
        })
      } catch (error) {
        // Cookie corrompido, limpar
        reply.clearCookie('session')
        return reply.code(200).send({
          success: false,
          isAuthenticated: false,
          message: 'Sessão corrompida'
        })
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
      return reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userid
      const ipOrigem = this.authService.getClientIp(request)

      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: 'Usuário não autenticado'
        })
      }

      await this.authService.registerLogout(userId)
      
      // Limpar cookie
      reply.clearCookie('session')

      return reply.code(200).send({
        success: true,
        message: 'Logout realizado com sucesso'
      })
    } catch (error) {
      console.error('Erro no logout:', error)
      return reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor'
      })
    }
  }
} 