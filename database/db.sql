-- Crear una nueva base de datos
CREATE DATABASE db_links;

-- Usar la nueva base de datos
USE db_links;

-- Crear la tabla de usuarios
CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    username VARCHAR(60) NOT NULL,
    password VARCHAR(60) NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

-- Insertar un usuario de ejemplo
INSERT INTO users (username, password, fullname) VALUES ('john', 'password1', 'John Carter');

-- Crear la tabla de enlaces con los cambios especificados
CREATE TABLE links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    encrypted_id VARCHAR(32),
    title VARCHAR(150) NOT NULL,
    url VARCHAR(255) NOT NULL,
    description TEXT,
    user_id INT(11),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id)
);