-- Função para gerar hash SCRAM-SHA-256
CREATE OR REPLACE FUNCTION generate_scram_hash(senha TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN crypt(senha, gen_salt('scram-sha-256'));
END;
$$ LANGUAGE plpgsql;