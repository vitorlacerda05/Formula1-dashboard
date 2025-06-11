-- Inserir administrador
INSERT INTO users (login, password, tipo, id_original, ativo) VALUES
('admin', generate_scram_hash('admin'), 'Administrador', NULL, 'S');

-- Inserir usuários para todos os pilotos
INSERT INTO users (login, password, tipo, id_original, ativo)
SELECT 
    driverref || '_d',
    generate_scram_hash(driverref),
    'Piloto',
    driverid,
    'S'
FROM driver;

-- Inserir usuários para todas as escuderias
INSERT INTO users (login, password, tipo, id_original, ativo)
SELECT 
    constructorref || '_c',
    generate_scram_hash(constructorref),
    'Escuderia',
    constructorid,
    'S'
FROM constructors;