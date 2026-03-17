-- Script para phpMyAdmin / MySQL
-- Crea la tabla principal de candidatos y sus tablas relacionadas.

CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_apellido VARCHAR(255) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    telefono VARCHAR(50) NOT NULL,
    pais VARCHAR(100) DEFAULT '',
    provincia VARCHAR(100) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    areas_interes VARCHAR(255) NOT NULL,
    disponibilidad VARCHAR(100) NOT NULL,
    remuneracion_pretendida DECIMAL(15,2) DEFAULT 0,
    linkedin VARCHAR(255) DEFAULT '',
    twitter VARCHAR(255) DEFAULT '',
    instagram VARCHAR(255) DEFAULT '',
    tiktok VARCHAR(255) DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS candidate_positions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    position_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS candidate_companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
