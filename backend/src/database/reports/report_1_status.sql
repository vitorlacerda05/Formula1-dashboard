-- Relatório 1: Total de resultados agrupados por status

-- Cria ou substitui uma função chamada admin_relatorio_status_resultados
CREATE OR REPLACE FUNCTION admin_relatorio_status_resultados()
-- Define o tipo de retorno da função: uma tabela com duas colunas (nome_status e quantidade_resultados)
RETURNS TABLE(
    nome_status TEXT,
    quantidade_resultados INT
) AS $$
BEGIN
  -- Início do bloco de retorno: a função retorna os resultados da consulta SQL abaixo
  RETURN QUERY
  SELECT
    -- Seleciona o status da corrida como texto
    s.status::TEXT AS nome_status,
    
    -- Conta o número de ocorrências desse status e converte para inteiro
    COUNT(*)::INT AS quantidade_resultados

  -- A tabela results guarda os resultados de cada piloto por corrida
  FROM results r

  -- Realiza um JOIN com a tabela status para acessar a descrição textual de cada status
  JOIN status s ON r.status_id = s.status_id

  -- Agrupa os dados pelo status textual
  GROUP BY s.status

  -- Ordena os resultados de forma decrescente pela quantidade e, em caso de empate, por ordem alfabética do status
  ORDER BY quantidade_resultados DESC, nome_status;
END;
$$ LANGUAGE plpgsql;
-- Define que a linguagem usada é PL/pgSQL, específica do PostgreSQL
