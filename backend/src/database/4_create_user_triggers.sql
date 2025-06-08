-- Função para criar usuário no PostgreSQL e na tabela users quando um novo piloto é adicionado
CREATE OR REPLACE FUNCTION create_driver_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar usuário no PostgreSQL
    EXECUTE format('CREATE USER %I WITH PASSWORD %L', 
        NEW.driver_ref || '_d', 
        NEW.driver_ref);
    
    -- Inserir na tabela users
    INSERT INTO users (login, password, tipo, id_original, ativo)
    VALUES (
        NEW.driver_ref || '_d',
        generate_scram_hash(NEW.driver_ref),
        'Piloto',
        NEW.driver_id,
        'S'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para criar usuário no PostgreSQL e na tabela users quando uma nova escuderia é adicionada
CREATE OR REPLACE FUNCTION create_constructor_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar usuário no PostgreSQL
    EXECUTE format('CREATE USER %I WITH PASSWORD %L', 
        NEW.constructor_ref || '_c', 
        NEW.constructor_ref);
    
    -- Inserir na tabela users
    INSERT INTO users (login, password, tipo, id_original, ativo)
    VALUES (
        NEW.constructor_ref || '_c',
        generate_scram_hash(NEW.constructor_ref),
        'Escuderia',
        NEW.constructor_id,
        'S'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar usuário quando um novo piloto é adicionado
CREATE TRIGGER trg_create_driver_user
    AFTER INSERT ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION create_driver_user();

-- Trigger para criar usuário quando uma nova escuderia é adicionada
CREATE TRIGGER trg_create_constructor_user
    AFTER INSERT ON constructors
    FOR EACH ROW
    EXECUTE FUNCTION create_constructor_user(); 