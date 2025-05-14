-- Banco de dados para o projeto com banco de dados MySQL com php
CREATE DATABASE react_native_db;

USE react_native_db;

CREATE TABLE mensagens (
  id INT AUTO_INCREMENT PRIMARY KEY,
  texto VARCHAR(255)
);

INSERT INTO mensagens (texto) VALUES
('Olá mundo!'),
('Hello World'),
('Ah shit, have go again');

CREATE TABLE pessoas (
id INT NOT NULL PRIMARY KEY,
nome VARCHAR(255),
email VARCHAR(255),
senha VARCHAR(255)
);

INSERT INTO pessoas (id, nome, email, senha) VALUES (1, 'Fulano', 'fulano@example.com', 'senha123');
INSERT INTO pessoas (id, nome, email, senha) VALUES (2, 'Beltrano', 'beltrano@example.com', 'senha456');
INSERT INTO pessoas (id, nome, email, senha) VALUES (3, 'Ciclano', 'ciclano@example.com', 'senha789');
-- Banco de dados para o projeto com banco de dados MySQL e python
CREATE DATABASE mobile_usuarios;
USE mobile_usuarios;
DROP TABLE usuarios;
CREATE TABLE usuarios(
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
nome VARCHAR(255),
telefone VARCHAR(15),
email VARCHAR(255),
senha VARCHAR(8)
);

INSERT INTO usuarios(nome,telefone,email,senha) VALUES ('Pedro','19998722472','pedro@gmail.com','comsenha');
INSERT INTO usuarios(nome,telefone,email,senha) VALUES ('Mariani','19998722472','mariani@gmail.com','semsenha');
INSERT INTO usuarios(nome,telefone,email,senha) VALUES ('Renan','19998722472','renan@gmail.com','admin');