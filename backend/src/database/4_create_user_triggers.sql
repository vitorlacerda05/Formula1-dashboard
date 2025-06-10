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

-- Função para atualizar usuário quando um piloto é modificado
CREATE OR REPLACE FUNCTION update_driver_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar usuário no PostgreSQL
    EXECUTE format('ALTER USER %I RENAME TO %I', 
        OLD.driver_ref || '_d',
        NEW.driver_ref || '_d');
    
    -- Atualizar na tabela users
    UPDATE users 
    SET login = NEW.driver_ref || '_d',
        password = generate_scram_hash(NEW.driver_ref)
    WHERE tipo = 'Piloto' AND id_original = NEW.driver_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar usuário quando uma escuderia é modificada
CREATE OR REPLACE FUNCTION update_constructor_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar usuário no PostgreSQL
    EXECUTE format('ALTER USER %I RENAME TO %I', 
        OLD.constructor_ref || '_c',
        NEW.constructor_ref || '_c');
    
    -- Atualizar na tabela users
    UPDATE users 
    SET login = NEW.constructor_ref || '_c',
        password = generate_scram_hash(NEW.constructor_ref)
    WHERE tipo = 'Escuderia' AND id_original = NEW.constructor_id;
    
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

-- Trigger para atualizar usuário quando um piloto é modificado
CREATE TRIGGER trg_update_driver_user
    AFTER UPDATE ON drivers
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_user();

-- Trigger para atualizar usuário quando uma escuderia é modificada
CREATE TRIGGER trg_update_constructor_user
    AFTER UPDATE ON constructors
    FOR EACH ROW
    EXECUTE FUNCTION update_constructor_user(); 