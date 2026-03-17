-- Script para phpMyAdmin / MySQL
-- Crea la tabla principal de Postulaciones (Job Postings).

CREATE TABLE IF NOT EXISTS job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa VARCHAR(255) NOT NULL,
    posicion VARCHAR(255) NOT NULL,
    requisitos TEXT,
    areas VARCHAR(255) NOT NULL,
    disponibilidad VARCHAR(100) NOT NULL,
    contacto VARCHAR(255) NOT NULL,
    pais VARCHAR(100) NOT NULL,
    provincia VARCHAR(100) NOT NULL,
    areas_interes VARCHAR(255) NOT NULL,
    zona VARCHAR(255) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    visible_suscripcion BOOLEAN DEFAULT FALSE,
    requiere_salario BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
