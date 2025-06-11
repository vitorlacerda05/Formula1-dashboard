## Admin

1. Total de pilotos, escuderias e temporadas
    
    ```sql
    CREATE OR REPLACE FUNCTION admin_resumo_geral()
    RETURNS TABLE(total_pilotos BIGINT, total_escuderias BIGINT, total_temporadas BIGINT) AS $$
    BEGIN
      RETURN QUERY
      SELECT
        (SELECT COUNT(DISTINCT driver_id) FROM drivers) AS total_pilotos,
        (SELECT COUNT(DISTINCT constructor_id) FROM constructors) AS total_escuderias,
        (SELECT COUNT(DISTINCT year) FROM seasons) AS total_temporadas;
    END;
    $$ LANGUAGE plpgsql;
    ```
    
2. Lista de todas as corridas cadastradas no ano corrente, com a quantidade total de
voltas e tempo de cada uma;Lista de todas as corridas cadastradas no ano corrente, com a quantidade total de voltas e tempo de cada uma;

```sql
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
        lt.race_id,
        lt.driver_id,
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
        lts.race_id,
        lts.driver_id,
        SUM(lts.lap_seconds) AS total_driver_seconds
    FROM
        LapTimesInSeconds lts
    GROUP BY
        lts.race_id, lts.driver_id
  ), RaceMaxDuration AS (
    SELECT
        dtrt.race_id,
        MAX(dtrt.total_driver_seconds) AS max_race_total_seconds
    FROM
        DriverTotalRaceTime dtrt
    GROUP BY
        dtrt.race_id
  )
  SELECT
    r.name AS nome_corrida,
    r.date AS data_corrida,
    MAX(res.laps) AS max_voltas_registradas,
    -- Converte o total de segundos para intervalo e formata para 'HH24:MI:SS',
    -- fazendo cast explícito para VARCHAR(8)
    TO_CHAR((COALESCE(rmd.max_race_total_seconds, 0) || ' seconds')::INTERVAL, 'HH24:MI:SS')::VARCHAR(8) AS duracao_estimada_formatada
  FROM
    races r
  LEFT JOIN
    results res ON r.race_id = res.race_id
  LEFT JOIN
    RaceMaxDuration rmd ON r.race_id = rmd.race_id
  WHERE
    r.year = p_ano
  GROUP BY
    r.race_id, r.name, r.date, rmd.max_race_total_seconds
  ORDER BY
    r.date;
END;
$$ LANGUAGE plpgsql;
```
​
Lista de todas as escuderias que correram no ano corrente, cada uma com o total de
pontos obtidos;

```sql
CREATE OR REPLACE FUNCTION admin_escuderias_pontos_por_ano(p_ano INTEGER)
RETURNS TABLE(
    nome_escuderia VARCHAR(100),
    total_pontos_ano NUMERIC(10, 2) -- Ajustado para acomodar somas maiores de pontos, mantendo 2 casas decimais
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.name AS nome_escuderia,
    SUM(res.points) AS total_pontos_ano
  FROM
    constructors c
  JOIN
    results res ON c.constructor_id = res.constructor_id
  JOIN
    races r ON res.race_id = r.race_id
  WHERE
    r.year = p_ano
  GROUP BY
    c.constructor_id, c.name -- Agrupar pelo ID garante unicidade mesmo com nomes iguais (improvável aqui)
  ORDER BY
    SUM(res.points) DESC, c.name;
END;
$$ LANGUAGE plpgsql;
```

Lista de todos os pilotos que correram no ano corrente, cada um com o total de pontos obtidos.
```sql
CREATE OR REPLACE FUNCTION admin_pilotos_pontos_por_ano(p_ano INTEGER)
RETURNS TABLE(
    nome_piloto VARCHAR(101),
    total_pontos_ano NUMERIC(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    (d.forename || ' ' || d.surname)::VARCHAR(101) AS nome_piloto,
    SUM(res.points) AS total_pontos_ano
  FROM
    drivers d
  JOIN
    results res ON d.driver_id = res.driver_id
  JOIN
    races r ON res.race_id = r.race_id
  WHERE
    r.year = p_ano
  GROUP BY
    d.driver_id, d.forename, d.surname
  ORDER BY
    SUM(res.points) DESC, nome_piloto;
END;
$$ LANGUAGE plpgsql;
```

Quantidade de vitórias da escuderia.
```sql
CREATE OR REPLACE FUNCTION escuderia_vitorias(p_constructor_id INT)
RETURNS INTEGER AS $$
DECLARE
  total_vitorias INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO total_vitorias
  FROM results
  WHERE constructor_id = p_constructor_id
    AND position = 1;
    
  RETURN total_vitorias;
END;
$$ LANGUAGE plpgsql;
```

Quantidade de pilotos diferentes que já correram pela escuderia.
```sql
CREATE OR REPLACE FUNCTION escuderia_pilotos_unicos(p_constructor_id INT)
RETURNS INTEGER AS $$
DECLARE
  total_pilotos INT;
BEGIN
  SELECT COUNT(DISTINCT driver_id)
  INTO total_pilotos
  FROM results
  WHERE constructor_id = p_constructor_id;
  
  RETURN total_pilotos;
END;
$$ LANGUAGE plpgsql;
```

Primeiro e último ano de participação da escuderia
```sql
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
    races r ON res.race_id = r.race_id
  WHERE
    res.constructor_id = p_constructor_id;
END;
$$ LANGUAGE plpgsql;
```

Primeiro e último ano em que há dados do Piloto na base (pela tabela RESULTS)
```sql
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
    races r ON res.race_id = r.race_id
  WHERE
    res.driver_id = p_driver_id;
END;
$$ LANGUAGE plpgsql;
```

Para o total de competições do piloto, para cada ano que ele competiu e para cada
circuito em que correu indicar:
– Quantidade de pontos obtidos;
– Quantidade de vitórias;
– Quantidade total de corridas em que participou.
```sql
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
    c.name,
    SUM(res.points),
    COUNT(CASE WHEN res.position = 1 THEN 1 END)::INT,
    COUNT(*)::INT
  FROM results res
  JOIN races r ON res.race_id = r.race_id
  JOIN circuits c ON r.circuit_id = c.circuit_id
  WHERE res.driver_id = p_driver_id
  GROUP BY r.year, c.name
  ORDER BY r.year, c.name;
END;
$$ LANGUAGE plpgsql;
```