import { FastifyRequest, FastifyReply } from 'fastify'
import pool from '../config/database'

export const getAdminStats = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const client = await pool.connect()
    
    // Usar a função SQL já disponível
    const resumoResult = await client.query('SELECT * FROM admin_resumo_geral()')
    
    client.release()
    
    reply.send({
      success: true,
      data: resumoResult.rows[0]
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}

export const getCurrentYearRaces = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const client = await pool.connect()
    
    // Buscar o ano mais recente com corridas
    const yearResult = await client.query('SELECT MAX(year) as max_year FROM races')
    const currentYear = yearResult.rows[0].max_year
    
    // Usar a função SQL já disponível
    const racesResult = await client.query('SELECT * FROM admin_corridas_por_ano($1)', [currentYear])
    console.log('Dados das corridas do ano atual:', racesResult.rows)
    
    client.release()
    
    reply.send({
      success: true,
      data: racesResult.rows
    })
  } catch (error) {
    console.error('Erro ao buscar corridas do ano atual:', error)
    reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}

export const getCurrentYearTeams = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const client = await pool.connect()
    
    // Buscar o ano mais recente com corridas
    const yearResult = await client.query('SELECT MAX(year) as max_year FROM races')
    const currentYear = yearResult.rows[0].max_year
    
    // Usar a função SQL já disponível
    const teamsResult = await client.query('SELECT * FROM admin_escuderias_pontos_por_ano($1)', [currentYear])
    console.log('Dados das equipes do ano atual:', teamsResult.rows)
    
    client.release()
    
    reply.send({
      success: true,
      data: teamsResult.rows
    })
  } catch (error) {
    console.error('Erro ao buscar equipes do ano atual:', error)
    reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}

export const getCurrentYearDrivers = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    const client = await pool.connect()
    
    // Buscar o ano mais recente com corridas
    const yearResult = await client.query('SELECT MAX(year) as max_year FROM races')
    const currentYear = yearResult.rows[0].max_year
    
    // Usar a função SQL já disponível
    const driversResult = await client.query('SELECT * FROM admin_pilotos_pontos_por_ano($1)', [currentYear])
    console.log('Dados dos pilotos do ano atual:', driversResult.rows)
    
    client.release()
    
    reply.send({
      success: true,
      data: driversResult.rows
    })
  } catch (error) {
    console.error('Erro ao buscar pilotos do ano atual:', error)
    reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}

export const getTeamStats = async (request: FastifyRequest<{ Params: { constructorId: string } }>, reply: FastifyReply) => {
  try {
    console.log('getTeamStats chamado com constructorId:', request.params.constructorId)
    const client = await pool.connect()
    const constructorId = parseInt(request.params.constructorId, 10)

    if (isNaN(constructorId)) {
      console.log('ID da escuderia inválido:', request.params.constructorId)
      return reply.status(400).send({ success: false, error: 'ID da escuderia inválido.' })
    }
    
    // Usar as funções SQL já disponíveis
    console.log('Executando query escuderia_vitorias para ID:', constructorId)
    const vitoriasResult = await client.query('SELECT escuderia_vitorias($1) as vitorias', [constructorId])
    console.log('Resultado vitorias:', vitoriasResult.rows)
    
    console.log('Executando query escuderia_pilotos_unicos para ID:', constructorId)
    const pilotosResult = await client.query('SELECT escuderia_pilotos_unicos($1) as pilotos_unicos', [constructorId])
    console.log('Resultado pilotos_unicos:', pilotosResult.rows)
    
    console.log('Executando query escuderia_periodo_atividade para ID:', constructorId)
    const periodoResult = await client.query('SELECT * FROM escuderia_periodo_atividade($1)', [constructorId])
    console.log('Resultado periodo:', periodoResult.rows)
    
    client.release()

    if (!periodoResult.rows.length) {
      // Retorna dados zerados se a equipe não for encontrada
      console.log('Equipe não encontrada, retornando dados zerados')
      return reply.send({
        success: true,
        data: { vitorias: 0, pilotos_unicos: 0, primeiro_ano: null, ultimo_ano: null }
      })
    }
    
    const responseData = {
      vitorias: vitoriasResult.rows[0].vitorias,
      pilotos_unicos: pilotosResult.rows[0].pilotos_unicos,
      primeiro_ano: periodoResult.rows[0]?.primeiro_ano,
      ultimo_ano: periodoResult.rows[0]?.ultimo_ano
    }
    console.log('Retornando dados da equipe:', responseData)
    
    reply.send({
      success: true,
      data: responseData
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}

export const getDriverStats = async (request: FastifyRequest<{ Params: { driverId: string } }>, reply: FastifyReply) => {
  try {
    console.log('getDriverStats chamado com driverId:', request.params.driverId)
    const client = await pool.connect()
    const driverId = parseInt(request.params.driverId, 10)

    if (isNaN(driverId)) {
      console.log('ID do piloto inválido:', request.params.driverId)
      return reply.status(400).send({ success: false, error: 'ID do piloto inválido.' })
    }
    
    // Usar as funções SQL já disponíveis
    console.log('Executando query piloto_periodo_atividade para ID:', driverId)
    const periodoResult = await client.query('SELECT * FROM piloto_periodo_atividade($1)', [driverId])
    console.log('Resultado periodo piloto:', periodoResult.rows)
    
    console.log('Executando query piloto_desempenho para ID:', driverId)
    const performanceResult = await client.query('SELECT * FROM piloto_desempenho($1)', [driverId])
    console.log('Resultado performance piloto:', performanceResult.rows)
    
    client.release()

    if (!periodoResult.rows.length) {
      console.log('Piloto não encontrado para ID:', driverId)
      return reply.status(404).send({ success: false, error: 'Piloto não encontrado.' })
    }
    
    const responseData = {
      period: periodoResult.rows[0],
      performance: performanceResult.rows
    }
    console.log('Retornando dados do piloto:', responseData)
    
    reply.send({
      success: true,
      data: responseData
    })
  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor',
      details: error
    })
  }
}

export const findDriverByLastName = async (request: FastifyRequest<{ Params: { constructorId: string, lastName: string } }>, reply: FastifyReply) => {
  try {
    const client = await pool.connect()
    const { constructorId, lastName } = request.params
    const teamId = parseInt(constructorId, 10)

    if (isNaN(teamId)) {
      return reply.status(400).send({ success: false, error: 'ID da escuderia inválido.' })
    }

    const query = `
      SELECT 
        p.driverid as piloto_id,
        p.forename || ' ' || p.surname as nome_piloto,
        p.nationality as nacionalidade,
        COALESCE(SUM(rs.points), 0) as total_pontos_ano
      FROM drivers p
      INNER JOIN results rs ON p.driverid = rs.driverid
      INNER JOIN races r ON rs.raceid = r.raceid
      WHERE rs.constructorid = $1
        AND p.surname ILIKE $2
        AND r.year = (SELECT MAX(year) FROM races)
      GROUP BY p.driverid, p.forename, p.surname, p.nationality
      ORDER BY total_pontos_ano DESC
    `
    
    const result = await client.query(query, [teamId, `%${lastName}%`])
    
    client.release()
    
    reply.send({
      success: true,
      data: result.rows
    })

  } catch (error) {
    reply.status(500).send({
      success: false,
      error: 'Erro ao buscar pilotos.',
      details: error
    })
  }
} 