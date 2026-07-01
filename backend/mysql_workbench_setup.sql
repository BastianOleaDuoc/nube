CREATE DATABASE IF NOT EXISTS bd_mestrax;
USE bd_mestrax;

CREATE TABLE IF NOT EXISTS usuarios (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255),
  telefono VARCHAR(50),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admins (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS productos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  categoria VARCHAR(100),
  precio DOUBLE,
  stock INT,
  estado VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS reservas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cliente VARCHAR(255),
  telefono VARCHAR(50),
  email VARCHAR(255),
  fecha VARCHAR(50),
  hora VARCHAR(50),
  personas INT,
  mesa INT,
  comentarios TEXT,
  estado VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS ventas (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  cliente VARCHAR(255),
  producto VARCHAR(255),
  total DOUBLE,
  metodo VARCHAR(100),
  estado VARCHAR(50),
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contactos (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(50),
  mensaje TEXT,
  fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (email, password) VALUES
('admin@mestrax.com', 'admin123'),
('soporte@mestrax.com', 'mestrax2026');
