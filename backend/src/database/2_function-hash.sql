-- Habilitar a extensão pgcrypto que contém as funções de criptografia
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Função para gerar hash SCRAM-SHA-256
CREATE OR REPLACE FUNCTION generate_scram_hash(senha TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'SCRAM-SHA-256$4096:' || encode(gen_random_bytes(16), 'base64') || '$' || 
           encode(digest(senha, 'sha256'), 'base64');
END;
$$ LANGUAGE plpgsql;