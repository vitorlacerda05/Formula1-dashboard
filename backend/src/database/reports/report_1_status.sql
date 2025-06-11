-- Relatório 1: Total de resultados agrupados por status

CREATE OR REPLACE FUNCTION admin_relatorio_status_resultados()
RETURNS TABLE(
    nome_status TEXT,
    quantidade_resultados INT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    s.status::TEXT AS nome_status,
    COUNT(*)::INT AS quantidade_resultados
  FROM results r
  JOIN status s ON r.status_id = s.status_id
  GROUP BY s.status
  ORDER BY quantidade_resultados DESC, nome_status;
END;
$$ LANGUAGE plpgsql;
