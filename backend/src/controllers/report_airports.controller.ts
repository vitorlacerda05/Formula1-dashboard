import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../src/config/database'; //ajustar

// Define o handler da rota GET que espera o parâmetro cidade na query string
export const getAeroportosProximos = async (request: FastifyRequest<{ Querystring: { cidade: string } }>, reply: FastifyReply) => {
  const { cidade } = request.query;

  if (!cidade) {
    return reply.status(400).send({ error: 'Parâmetro "cidade" é obrigatório.' });
  }

  try {
    const { rows } = await db.query(
      'SELECT * FROM admin_aeroportos_proximos($1);',
      [cidade]
    );
    return reply.send(rows);
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ error: 'Erro ao consultar aeroportos próximos.' });
  }
};
