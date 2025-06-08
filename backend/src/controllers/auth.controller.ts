import { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service';
import { LoginRequest } from '../types/user';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) {
    try {
      const loginRequest = request.body;
      const ipOrigem = this.authService.getClientIp(request);
      
      const response = await this.authService.authenticateUser(loginRequest);
      
      if (response.success && response.session) {
        // Salvar sessão em cookie
        reply.setCookie('session', JSON.stringify(response.session), {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          maxAge: 24 * 60 * 60, // 24 horas
          path: '/'
        });

        return reply.code(200).send(response);
      }

      return reply.code(401).send(response);
    } catch (error) {
      console.error('Erro no login:', error);
      return reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  async logout(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user?.userid;
      const ipOrigem = this.authService.getClientIp(request);

      if (!userId) {
        return reply.code(401).send({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      await this.authService.registerLogout(userId, ipOrigem);
      
      // Limpar cookie
      reply.clearCookie('session');

      return reply.code(200).send({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      return reply.code(500).send({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
} 