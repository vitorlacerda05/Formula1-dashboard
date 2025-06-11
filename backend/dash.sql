set search_path to grupo_6

CREATE OR REPLACE FUNCTION admin_resumo_geral()
    RETURNS TABLE(total_pilotos BIGINT, total_escuderias BIGINT, total_temporadas BIGINT) AS $$
    BEGIN
      RETURN QUERY
      SELECT
        (SELECT COUNT(DISTINCT driverid) FROM driver) AS total_pilotos,
        (SELECT COUNT(DISTINCT constructorid) FROM constructors) AS total_escuderias,
        (SELECT COUNT(DISTINCT year) FROM seasons) AS total_temporadas;
    END;
    $$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION admin_corridas_por_ano(p_ano INTEGER)
RETURNS TABLE(
    nome_corrida VARCHAR(100),
    data_corrida DATE,
    max_voltas_registradas INTEGER,
    duracao_estimada_formatada VARCHAR(8)
) AS $$
BEGIN
  RETURN QUERY
  WITH LapTimesInSeconds AS (
    SELECT
        lt.raceid,
        lt.driverid,
        -- Converte 'M:S.ms' ou 'M:S' ou 'S.ms' para total de segundos.
        -- A parte fracionária (ms) é mantida para precisão na soma.
        EXTRACT(EPOCH FROM ('00:' || lt.time)::INTERVAL) AS lap_seconds
    FROM
        laptimes lt
    WHERE
        lt.time IS NOT NULL
        AND lt.time ~ '^[0-9]+:[0-5]?[0-9](\.[0-9]+)?$|^[0-5]?[0-9]\.[0-9]+$|^[0-9]+:[0-5]?[0-9]$'
  ), DriverTotalRaceTime AS (
    SELECT
        lts.raceid,
        lts.driverid,
        SUM(lts.lap_seconds) AS total_driver_seconds
    FROM
        LapTimesInSeconds lts
    GROUP BY
        lts.raceid, lts.driverid
  ), RaceMaxDuration AS (
    SELECT
        dtrt.raceid,
        MAX(dtrt.total_driver_seconds) AS max_race_total_seconds
    FROM
        DriverTotalRaceTime dtrt
    GROUP BY
        dtrt.raceid
  )
  SELECT
    r.name::VARCHAR(100) AS nome_corrida,
    r.date AS data_corrida,
    MAX(res.laps) AS max_voltas_registradas,
    -- Converte o total de segundos para intervalo e formata para 'HH24:MI:SS',
    -- fazendo cast explícito para VARCHAR(8)
    TO_CHAR((COALESCE(rmd.max_race_total_seconds, 0) || ' seconds')::INTERVAL, 'HH24:MI:SS')::VARCHAR(8) AS duracao_estimada_formatada
  FROM
    races r
  LEFT JOIN
    results res ON r.raceid = res.raceid
  LEFT JOIN
    RaceMaxDuration rmd ON r.raceid = rmd.raceid
  WHERE
    r.year = p_ano
  GROUP BY
    r.raceid, r.name, r.date, rmd.max_race_total_seconds
  ORDER BY
    r.date;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION admin_escuderias_pontos_por_ano(p_ano INTEGER)
RETURNS TABLE(
    nome_escuderia VARCHAR(100),
    total_pontos_ano NUMERIC(10, 2) -- Ajustado para acomodar somas maiores de pontos, mantendo 2 casas decimais
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name::VARCHAR(100) AS nome_escuderia,
    SUM(res.points)::NUMERIC(10, 2) AS total_pontos_ano
  FROM
    constructors c
  JOIN
    results res ON c.constructorid = res.constructorid
  JOIN
    races r ON res.raceid = r.raceid
  WHERE
    r.year = p_ano
  GROUP BY
    c.constructorid, c.name -- Agrupar pelo ID garante unicidade mesmo com nomes iguais (improvável aqui)
  ORDER BY
    SUM(res.points) DESC, c.name;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION admin_pilotos_pontos_por_ano(p_ano INTEGER)
RETURNS TABLE(
    nome_piloto VARCHAR(101),
    total_pontos_ano NUMERIC(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (d.forename || ' ' || d.surname)::VARCHAR(101) AS nome_piloto,
    SUM(res.points)::NUMERIC(10, 2) AS total_pontos_ano
  FROM
    driver d
  JOIN
    results res ON d.driverid = res.driverid
  JOIN
    races r ON res.raceid = r.raceid
  WHERE
    r.year = p_ano
  GROUP BY
    d.driverid, d.forename, d.surname
  ORDER BY
    SUM(res.points) DESC, nome_piloto;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION escuderia_vitorias(p_constructor_id INT)
RETURNS INTEGER AS $$
DECLARE
  total_vitorias INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO total_vitorias
  FROM results
  WHERE constructorid = p_constructor_id
    AND position = 1;
    
  RETURN total_vitorias;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION escuderia_pilotos_unicos(p_constructor_id INT)
RETURNS INTEGER AS $$
DECLARE
  total_pilotos INT;
BEGIN
  SELECT COUNT(DISTINCT driverid)
  INTO total_pilotos
  FROM results
  WHERE constructorid = p_constructor_id;
  
  RETURN total_pilotos;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION escuderia_periodo_atividade(p_constructor_id INT)
RETURNS TABLE(primeiro_ano INT, ultimo_ano INT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    MIN(r.year),
    MAX(r.year)
  FROM
    results res
  JOIN
    races r ON res.raceid = r.raceid
  WHERE
    res.constructorid = p_constructor_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION piloto_periodo_atividade(p_driver_id INT)
RETURNS TABLE(primeiro_ano INT, ultimo_ano INT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    MIN(r.year),
    MAX(r.year)
  FROM
    results res
  JOIN
    races r ON res.raceid = r.raceid
  WHERE
    res.driverid = p_driver_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION piloto_desempenho(p_driver_id INT)
RETURNS TABLE(
    ano INT,
    circuito VARCHAR(100),
    pontos NUMERIC(10,2),
    vitorias INT,
    total_corridas INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    r.year,
    c.name::VARCHAR(100),
    SUM(res.points)::NUMERIC(10,2),
    COUNT(CASE WHEN res.position = 1 THEN 1 END)::INT,
    COUNT(*)::INT
  FROM results res
  JOIN races r ON res.raceid = r.raceid
  JOIN circuits c ON r.circuitid = c.circuitid
  WHERE res.driverid = p_driver_id
  GROUP BY r.year, c.name
  ORDER BY r.year, c.name;
END;
$$ LANGUAGE plpgsql;

-- Relatório 1: Total de resultados agrupados por status

CREATE OR REPLACE FUNCTION grupo_6.admin_relatorio_status_resultados()
RETURNS TABLE(
    nome_status TEXT,
    quantidade_resultados INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.status::TEXT AS nome_status,
    COUNT(*)::INT AS quantidade_resultados
  FROM grupo_6.results r
  JOIN grupo_6.status s ON r.statusid = s.statusid
  GROUP BY s.status
  ORDER BY quantidade_resultados DESC, nome_status;
END;
$$ LANGUAGE plpgsql;

-- Relatório 2: Equipes com número de pilotos e estatísticas
CREATE OR REPLACE FUNCTION grupo_6.admin_relatorio_equipes_pilotos()
RETURNS TABLE(
    nome_equipe TEXT,
    numero_pilotos INT,
    total_corridas INT,
    media_voltas NUMERIC(5,1),
    tempo_total_formatado TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH equipe_stats AS (
    SELECT 
      c.name,
      c.constructorid,
      COUNT(DISTINCT r.driverid) as pilotos_unicos,
      COUNT(*) as corridas_total,
      AVG(r.laps) as voltas_media,
      SUM(COALESCE(r.milliseconds, 0)) as milissegundos_total
    FROM grupo_6.constructors c
    JOIN grupo_6.results r ON c.constructorid = r.constructorid
    GROUP BY c.constructorid, c.name
  )
  SELECT
    es.name::TEXT AS nome_equipe,
    es.pilotos_unicos::INT AS numero_pilotos,
    es.corridas_total::INT AS total_corridas,
    ROUND(es.voltas_media, 1)::NUMERIC(5,1) AS media_voltas,
    CASE 
      WHEN es.milissegundos_total > 0 THEN
        TO_CHAR(
          (es.milissegundos_total / 1000.0 || ' seconds')::INTERVAL, 
          'HH24:MI:SS'
        )
      ELSE '00:00:00'
    END::TEXT AS tempo_total_formatado
  FROM equipe_stats es
  WHERE es.pilotos_unicos > 0
  ORDER BY es.pilotos_unicos DESC, es.name;
END;
$$ LANGUAGE plpgsql;
