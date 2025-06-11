import { FastifyRequest, FastifyReply } from 'fastify'
import pool from '../config/database'

export const getRelatorioStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { rows } = await pool.query('SELECT * FROM grupo_6.admin_relatorio_status_resultados();')
    reply.send(rows)
  } catch (error) {
    console.error('Erro ao executar relatório de status:', error)
    reply.status(500).send({ error: 'Erro ao gerar relatório de status' })
  }
}

export const getRelatorioEquipesPilotos = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { rows } = await pool.query('SELECT * FROM grupo_6.admin_relatorio_equipes_pilotos();')
    reply.send(rows)
  } catch (error) {
    console.error('Erro ao executar relatório de equipes com pilotos:', error)
    reply.status(500).send({ error: 'Erro ao gerar relatório de equipes com pilotos' })
  }
}
