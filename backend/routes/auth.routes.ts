import { FastifyInstance } from 'fastify';
import { AuthController } from '../src/controllers/auth.controller';
import { authMiddleware } from '../src/middlewares/auth.middleware';

export default async function authRoutes(fastify: FastifyInstance) {
  const authController = new AuthController();

  // Rota pública de login
  fastify.post('/login', authController.login.bind(authController));

  // Rota protegida de logout
  fastify.post('/logout', {
    preHandler: authMiddleware
  }, authController.logout.bind(authController));
} 