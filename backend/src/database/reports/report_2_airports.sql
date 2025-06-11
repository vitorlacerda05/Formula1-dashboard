-- Cria ou substitui a função chamada admin_aeroportos_proximos, que recebe o nome de uma cidade como entrada
CREATE OR REPLACE FUNCTION admin_aeroportos_proximos(cidade TEXT)
-- Define que a função retorna uma tabela com as colunas: nome do aeroporto, cidade do aeroporto, tipo e distância
RETURNS TABLE (
    nome_aeroporto TEXT,
    cidade_aeroporto TEXT,
    tipo TEXT,
    distancia_km NUMERIC
) AS $$
BEGIN
  -- Início do bloco de retorno da função: executa a consulta que retorna os aeroportos próximos
  RETURN QUERY
  SELECT 
    a.name,                 -- Nome do aeroporto
    a.city,                 -- Cidade onde o aeroporto está localizado
    a.type,                 -- Tipo do aeroporto: medium_airport ou large_airport
    ROUND(                  -- Arredonda o cálculo da distância final para 2 casas decimais
      111.045 * DEGREES(    -- Constante aproximada para converter graus em quilômetros
        ACOS(LEAST(1.0,     -- Garante que o valor passado ao ACOS esteja no intervalo [-1, 1] (por segurança numérica)
          COS(RADIANS(g.lat)) * COS(RADIANS(a.lat_deg)) * COS(RADIANS(g.long - a.long_deg)) +
          SIN(RADIANS(g.lat)) * SIN(RADIANS(a.lat_deg))
        ))
      ), 2
    ) AS distancia_km       -- Distância geográfica aproximada entre a cidade informada e o aeroporto
  FROM airports a
  JOIN geocities15k g       -- Junta com a tabela de cidades georreferenciadas
    ON g.country = 'BR'     -- Filtra apenas cidades brasileiras
  WHERE g.asciiname = cidade            -- Compara a cidade informada com o nome ascii (sem acentos) da cidade na base
    AND a.iso_country = 'BR'           -- Filtra apenas aeroportos localizados no Brasil
    AND a.type IN ('medium_airport', 'large_airport')  -- Considera apenas aeroportos de médio e grande porte
    AND ROUND(                         -- Aplica novamente o cálculo de distância para filtrar os aeroportos próximos
      111.045 * DEGREES(
        ACOS(LEAST(1.0,
          COS(RADIANS(g.lat)) * COS(RADIANS(a.lat_deg)) * COS(RADIANS(g.long - a.long_deg)) +
          SIN(RADIANS(g.lat)) * SIN(RADIANS(a.lat_deg))
        ))
      ), 2
    ) <= 100;                          -- Mantém apenas os aeroportos localizados a no máximo 100 km da cidade
END;
$$ LANGUAGE plpgsql;                   -- Indica que a linguagem utilizada é PL/pgSQL
