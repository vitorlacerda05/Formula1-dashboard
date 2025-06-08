-- Criação da tabela USERS
CREATE TABLE users (
    userid          SERIAL PRIMARY KEY,
    login           VARCHAR(50) UNIQUE NOT NULL,
    password        VARCHAR(256) NOT NULL,  -- Para armazenar hash SHA-256
    tipo            VARCHAR(20) CHECK (tipo IN ('Administrador', 'Escuderia', 'Piloto')),
    id_original     INTEGER,  -- ID da tabela original (driver_id ou constructor_id)
    data_criacao    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ultimo_login    TIMESTAMP,
    ativo           CHAR(1) DEFAULT 'S' CHECK (ativo IN ('S', 'N')),
    CONSTRAINT fk_users_driver
        FOREIGN KEY (id_original) REFERENCES drivers(driver_id)
        ON DELETE CASCADE
        CHECK (tipo = 'Piloto'),
    CONSTRAINT fk_users_constructor
        FOREIGN KEY (id_original) REFERENCES constructors(constructor_id)
        ON DELETE CASCADE
        CHECK (tipo = 'Escuderia'),
    CONSTRAINT check_admin_id_original
        CHECK ((tipo = 'Administrador' AND id_original IS NULL) OR
               (tipo IN ('Piloto', 'Escuderia') AND id_original IS NOT NULL))
);

-- Criação da tabela Users_Log
CREATE TABLE users_log (
    log_id          SERIAL PRIMARY KEY,
    userid          INTEGER NOT NULL,
    data_hora_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tipo_acao       VARCHAR(10) DEFAULT 'LOGIN' CHECK (tipo_acao IN ('LOGIN', 'LOGOUT')),
    ip_origem       VARCHAR(45),  -- Para IPv4 e IPv6
    CONSTRAINT fk_users_log_userid
        FOREIGN KEY (userid) REFERENCES users(userid)
        ON DELETE CASCADE
);

-- Comentários nas tabelas
COMMENT ON TABLE users IS 'Tabela de usuários do sistema';
COMMENT ON TABLE users_log IS 'Tabela de logs de acesso dos usuários';

-- Comentários nas colunas da tabela users
COMMENT ON COLUMN users.userid IS 'Identificador único do usuário';
COMMENT ON COLUMN users.login IS 'Login do usuário (deve ser único)';
COMMENT ON COLUMN users.password IS 'Senha do usuário (hash SHA-256)';
COMMENT ON COLUMN users.tipo IS 'Tipo do usuário (Administrador, Escuderia, Piloto)';
COMMENT ON COLUMN users.id_original IS 'ID da tabela original (driver_id ou constructor_id)';
COMMENT ON COLUMN users.data_criacao IS 'Data de criação do usuário';
COMMENT ON COLUMN users.ultimo_login IS 'Data do último login do usuário';
COMMENT ON COLUMN users.ativo IS 'Status do usuário (S = Ativo, N = Inativo)';

-- Comentários nas colunas da tabela users_log
COMMENT ON COLUMN users_log.log_id IS 'Identificador único do log';
COMMENT ON COLUMN users_log.userid IS 'ID do usuário que gerou o log';
COMMENT ON COLUMN users_log.data_hora_login IS 'Data e hora do login/logout';
COMMENT ON COLUMN users_log.tipo_acao IS 'Tipo da ação (LOGIN ou LOGOUT)';
COMMENT ON COLUMN users_log.ip_origem IS 'Endereço IP de origem do acesso';

-- Índices
CREATE INDEX idx_users_login ON users(login);
CREATE INDEX idx_users_tipo ON users(tipo);
CREATE INDEX idx_users_log_userid ON users_log(userid);
CREATE INDEX idx_users_log_data_hora ON users_log(data_hora_login); 