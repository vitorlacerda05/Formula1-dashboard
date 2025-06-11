import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../config/database'; // ajuste esse path se necessário

export const getRelatorioStatus = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const { rows } = await db.query('SELECT * FROM admin_relatorio_status_resultados();');
    reply.send(rows);
  } catch (error) {
    console.error('Erro ao executar relatório de status:', error);
    reply.status(500).send({ error: 'Erro ao gerar relatório de status' });
  }
};
