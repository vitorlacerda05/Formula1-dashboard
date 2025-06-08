-- Primeiro, criar os usuários no PostgreSQL
DO $$
BEGIN
    -- Criar usuário administrador
    EXECUTE 'CREATE USER admin WITH PASSWORD ''admin''';
    
    -- Criar usuários para pilotos
    FOR driver_rec IN (SELECT driver_ref FROM drivers) LOOP
        EXECUTE format('CREATE USER %I WITH PASSWORD %L', 
            driver_rec.driver_ref || '_d', 
            driver_rec.driver_ref);
    END LOOP;
    
    -- Criar usuários para escuderias
    FOR constructor_rec IN (SELECT constructor_ref FROM constructors) LOOP
        EXECUTE format('CREATE USER %I WITH PASSWORD %L', 
            constructor_rec.constructor_ref || '_c', 
            constructor_rec.constructor_ref);
    END LOOP;
END $$;

-- Inserir administrador
INSERT INTO users (login, password, tipo, id_original, ativo) VALUES
('admin', generate_scram_hash('admin'), 'Administrador', NULL, 'S');

-- Inserir usuários para todos os pilotos
INSERT INTO users (login, password, tipo, id_original, ativo)
SELECT 
    driver_ref || '_d',
    generate_scram_hash(driver_ref),
    'Piloto',
    driver_id,
    'S'
FROM drivers;

-- Inserir usuários para todas as escuderias
INSERT INTO users (login, password, tipo, id_original, ativo)
SELECT 
    constructor_ref || '_c',
    generate_scram_hash(constructor_ref),
    'Escuderia',
    constructor_id,
    'S'
FROM constructors;