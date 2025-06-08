-- Criado para popular a base de dados com dados aleatórios
-- Não é necessário executar este arquivo

-- Adição de pilotos testes
INSERT INTO drivers (driver_ref, number, code, forename, surname, date_of_birth, nationality) VALUES
('hamilton', 44, 'HAM', 'Lewis', 'Hamilton', '1985-01-07', 'British'),
('verstappen', 1, 'VER', 'Max', 'Verstappen', '1997-09-30', 'Dutch'),
('leclerc', 16, 'LEC', 'Charles', 'Leclerc', '1997-10-16', 'Monegasque'),
('norris', 4, 'NOR', 'Lando', 'Norris', '1999-11-13', 'British'),
('russell', 63, 'RUS', 'George', 'Russell', '1998-02-15', 'British'),
('sainz', 55, 'SAI', 'Carlos', 'Sainz', '1994-09-01', 'Spanish'),
('perez', 11, 'PER', 'Sergio', 'Perez', '1990-01-26', 'Mexican'),
('alonso', 14, 'ALO', 'Fernando', 'Alonso', '1981-07-29', 'Spanish');

-- Adição de escuderias testes
INSERT INTO constructors (constructor_ref, name, nationality) VALUES
('mercedes', 'Mercedes', 'German'),
('red_bull', 'Red Bull', 'Austrian'),
('ferrari', 'Ferrari', 'Italian'),
('mclaren', 'McLaren', 'British'),
('aston_martin', 'Aston Martin', 'British'),
('alpine', 'Alpine', 'French'),
('williams', 'Williams', 'British'),
('haas', 'Haas F1 Team', 'American');

-- Adição de circuitos testes
INSERT INTO circuits (circuit_ref, name, location, country, lat, lng, alt) VALUES
('monaco', 'Circuit de Monaco', 'Monte Carlo', 'Monaco', 43.7347, 7.4206, 7),
('monza', 'Autodromo Nazionale di Monza', 'Monza', 'Italy', 45.6156, 9.2903, 162),
('spa', 'Circuit de Spa-Francorchamps', 'Spa', 'Belgium', 50.4372, 5.9714, 401),
('silverstone', 'Silverstone Circuit', 'Silverstone', 'UK', 52.0786, -1.0169, 153);

-- Adição de temporadas testes
INSERT INTO seasons (year) VALUES
(2023),
(2024);

-- Adição de status testes
INSERT INTO status (status) VALUES
('Finished'),
('Accident'),
('Mechanical'),
('Retired'),
('Disqualified'),
('+1 Lap'),
('+2 Laps'),
('+3 Laps');

-- Adição de corridas testes
INSERT INTO races (year, round, circuit_id, name, date) VALUES
(2023, 1, (SELECT circuit_id FROM circuits WHERE circuit_ref = 'monaco'), 'Monaco Grand Prix', '2023-05-28'),
(2023, 2, (SELECT circuit_id FROM circuits WHERE circuit_ref = 'monza'), 'Italian Grand Prix', '2023-09-03'),
(2023, 3, (SELECT circuit_id FROM circuits WHERE circuit_ref = 'spa'), 'Belgian Grand Prix', '2023-07-30'),
(2023, 4, (SELECT circuit_id FROM circuits WHERE circuit_ref = 'silverstone'), 'British Grand Prix', '2023-07-09');

-- Adição de resultados testes
INSERT INTO results (race_id, driver_id, constructor_id, number, grid, position, position_text, points, laps, status_id)
SELECT 
    r.race_id,
    d.driver_id,
    c.constructor_id,
    d.number,
    FLOOR(RANDOM() * 20) + 1, -- grid aleatório
    FLOOR(RANDOM() * 20) + 1, -- position aleatória
    CASE WHEN FLOOR(RANDOM() * 20) + 1 <= 10 THEN (FLOOR(RANDOM() * 20) + 1)::TEXT ELSE 'DNF' END, -- position_text
    CASE WHEN FLOOR(RANDOM() * 20) + 1 <= 10 THEN (FLOOR(RANDOM() * 25) + 1)::NUMERIC ELSE 0 END, -- points
    FLOOR(RANDOM() * 50) + 30, -- laps
    FLOOR(RANDOM() * 8) + 1 -- status_id
FROM races r
CROSS JOIN drivers d
CROSS JOIN constructors c
WHERE d.driver_ref IN ('hamilton', 'verstappen', 'leclerc', 'norris')
AND c.constructor_ref IN ('mercedes', 'red_bull', 'ferrari', 'mclaren')
LIMIT 20; 