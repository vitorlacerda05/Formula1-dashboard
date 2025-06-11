import { FastifyRequest } from 'fastify'
import pool from '../config/database'
import { User, UserSession, LoginRequest, LoginResponse } from '../types/user'

export class AuthService {
  async authenticateUser(loginRequest: LoginRequest): Promise<LoginResponse> {
    try {
      const { login, password } = loginRequest
      console.log('Tentando autenticar:', { login })

      // Buscar usuário no banco
      const result = await pool.query(
        `SELECT userid, login, tipo, id_original, ativo, password 
         FROM users 
         WHERE login = $1 AND ativo = 'S'`,
        [login]
      )

      console.log('Resultado da busca:', result.rows)

      if (result.rows.length === 0) {
        return {
          success: false,
          message: 'Usuário não encontrado ou inativo'
        }
      }

      const user: User = result.rows[0]

      // Verificar senha usando a função verify_scram_hash
      const passwordCheck = await pool.query(
        `SELECT verify_scram_hash($1, $2) as is_valid`,
        [password, user.password]
      )

      console.log('Verificação de senha:', passwordCheck.rows[0])

      if (!passwordCheck.rows[0].is_valid) {
        return {
          success: false,
          message: 'Senha incorreta'
        }
      }

      // Registrar login
      await this.registerLogin(user.userid)

      const session: UserSession = {
        userid: user.userid,
        login: user.login,
        tipo: user.tipo,
        idOriginal: user.idOriginal,
        isAuthenticated: true
      }

      return {
        success: true,
        session
      }
    } catch (error) {
      console.error('Erro na autenticação:', error)
      return {
        success: false,
        message: 'Erro interno do servidor'
      }
    }
  }

  async validateUser(userId: number): Promise<boolean> {
    try {
      const result = await pool.query(
        `SELECT userid FROM users WHERE userid = $1 AND ativo = 'S'`,
        [userId]
      )
      
      return result.rows.length > 0
    } catch (error) {
      console.error('Erro ao validar usuário:', error)
      return false
    }
  }

  async registerLogin(userId: number): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO users_log (userid, tipo_acao, data_hora_login) 
         VALUES ($1, 'LOGIN', CURRENT_TIMESTAMP)`,
        [userId]
      )

      await pool.query(
        `UPDATE users 
         SET ultimo_login = CURRENT_TIMESTAMP 
         WHERE userid = $1`,
        [userId]
      )
    } catch (error) {
      console.error('Erro ao registrar login:', error)
      throw error
    }
  }

  async registerLogout(userId: number): Promise<void> {
    try {
      await pool.query(
        `INSERT INTO users_log (userid, tipo_acao, data_hora_login) 
         VALUES ($1, 'LOGOUT', CURRENT_TIMESTAMP)`,
        [userId]
      )
    } catch (error) {
      console.error('Erro ao registrar logout:', error)
      throw error
    }
  }

  getClientIp(request: FastifyRequest): string {
    return request.ip || 
           request.headers['x-forwarded-for']?.toString() || 
           request.socket.remoteAddress || 
           'unknown'
  }
} 