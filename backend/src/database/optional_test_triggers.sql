-- Criado para testar o trigger de criação de usuários
-- Não é necessário executar este arquivo


-- Inserir 2 novos pilotos para testar o trigger
INSERT INTO drivers (driver_ref, number, code, forename, surname, date_of_birth, nationality) VALUES
('piastri', 81, 'PIA', 'Oscar', 'Piastri', '2001-04-06', 'Australian'),
('stroll', 18, 'STR', 'Lance', 'Stroll', '1998-10-29', 'Canadian');

-- Inserir 2 novas escuderias para testar o trigger
INSERT INTO constructors (constructor_ref, name, nationality) VALUES
('alfa_romeo', 'Alfa Romeo', 'Swiss'),
('alphatauri', 'AlphaTauri', 'Italian');

-- Verificar se os usuários foram criados
SELECT * FROM users WHERE login IN ('piastri_d', 'stroll_d', 'alfa_romeo_c', 'alphatauri_c'); 