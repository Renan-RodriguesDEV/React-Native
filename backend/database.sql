create database storeapp;

use storeapp;

create table clientes (
    id int not null primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null,
    senha varchar(16) not null
);

create table produtos (
    id int not null primary key auto_increment,
    nome varchar(255) not null,
    preco decimal(10, 2) default 0.00,
    quantidade int default 0,
    descricao text
);

create table compras (
    id int not null primary key auto_increment,
    fk_usuario int not null,
    fk_produto int not null,
    quantidade int not null,
    data_compra datetime default current_timestamp
);

create table vendedores (
    id int not null primary key auto_increment,
    nome varchar(255) not null,
    email varchar(255) not null,
    senha varchar(16) not null
);