-- Função para criar usuário no PostgreSQL e na tabela users quando um novo piloto é adicionado
CREATE OR REPLACE FUNCTION create_driver_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Criar usuário no PostgreSQL
    EXECUTE format('CREATE USER %I WITH PASSWORD %L', 
        NEW.driverref || '_d', 
        NEW.driverref);
    
    -- Inserir na tabela users
    INSERT INTO users (login, password, tipo, id_original, ativo)
    VALUES (
        NEW.driverref || '_d',
        generate_scram_hash(NEW.driverref),
        'Piloto',
        NEW.driverid,
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
        NEW.constructorref || '_c', 
        NEW.constructorref);
    
    -- Inserir na tabela users
    INSERT INTO users (login, password, tipo, id_original, ativo)
    VALUES (
        NEW.constructorref || '_c',
        generate_scram_hash(NEW.constructorref),
        'Escuderia',
        NEW.constructorid,
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
        OLD.driverref || '_d',
        NEW.driverref || '_d');
    
    -- Atualizar na tabela users
    UPDATE users 
    SET login = NEW.driverref || '_d',
        password = generate_scram_hash(NEW.driverref)
    WHERE tipo = 'Piloto' AND id_original = NEW.driverid;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para atualizar usuário quando uma escuderia é modificada
CREATE OR REPLACE FUNCTION update_constructor_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Atualizar usuário no PostgreSQL
    EXECUTE format('ALTER USER %I RENAME TO %I', 
        OLD.constructorref || '_c',
        NEW.constructorref || '_c');
    
    -- Atualizar na tabela users
    UPDATE users 
    SET login = NEW.constructorref || '_c',
        password = generate_scram_hash(NEW.constructorref)
    WHERE tipo = 'Escuderia' AND id_original = NEW.constructorid;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para criar usuário quando um novo piloto é adicionado
CREATE TRIGGER trg_create_driver_user
    AFTER INSERT ON driver
    FOR EACH ROW
    EXECUTE FUNCTION create_driver_user();

-- Trigger para criar usuário quando uma nova escuderia é adicionada
CREATE TRIGGER trg_create_constructor_user
    AFTER INSERT ON constructors
    FOR EACH ROW
    EXECUTE FUNCTION create_constructor_user();

-- Trigger para atualizar usuário quando um piloto é modificado
CREATE TRIGGER trg_update_driver_user
    AFTER UPDATE ON driver
    FOR EACH ROW
    EXECUTE FUNCTION update_driver_user();

-- Trigger para atualizar usuário quando uma escuderia é modificada
CREATE TRIGGER trg_update_constructor_user
    AFTER UPDATE ON constructors
    FOR EACH ROW
    EXECUTE FUNCTION update_constructor_user(); 