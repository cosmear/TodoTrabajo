-- Script para phpMyAdmin / MySQL
-- Crea la tabla principal de usuarios para Login y Registro.

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    tipo_cuenta VARCHAR(50) NOT NULL COMMENT 'candidato o empresa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
