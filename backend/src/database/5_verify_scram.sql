-- Função para verificar hash SCRAM-SHA-256
CREATE OR REPLACE FUNCTION verify_scram_hash(senha TEXT, hash_armazenado TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    salt TEXT;
    stored_hash TEXT;
    computed_hash TEXT;
BEGIN
    -- Extrair o salt do hash armazenado
    salt := split_part(split_part(hash_armazenado, '$', 2), ':', 2);
    
    -- Gerar o hash com o mesmo salt
    computed_hash := 'SCRAM-SHA-256$4096:' || salt || '$' || encode(digest(senha, 'sha256'), 'base64');
    
    -- Comparar os hashes
    RETURN computed_hash = hash_armazenado;
END;
$$ LANGUAGE plpgsql; 