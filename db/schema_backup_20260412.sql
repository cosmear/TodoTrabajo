-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 12-04-2026 a las 22:37:36
-- Versión del servidor: 11.8.6-MariaDB-log
-- Versión de PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `u262259906_TodoTrabajo`
--
CREATE DATABASE IF NOT EXISTS `u262259906_TodoTrabajo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `u262259906_TodoTrabajo`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `applications`
--

DROP TABLE IF EXISTS `applications`;
CREATE TABLE IF NOT EXISTS `applications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `status` varchar(50) DEFAULT 'Enviada',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`job_id`),
  KEY `job_id` (`job_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `applications`
--

INSERT INTO `applications` (`id`, `user_id`, `job_id`, `status`, `created_at`) VALUES
(3, 33, 4, 'Enviada', '2026-04-09 17:29:52');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `candidates`
--

DROP TABLE IF EXISTS `candidates`;
CREATE TABLE IF NOT EXISTS `candidates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_apellido` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `pais` varchar(100) DEFAULT '',
  `provincia` varchar(100) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `areas_interes` varchar(255) NOT NULL,
  `disponibilidad` varchar(100) NOT NULL,
  `remuneracion_pretendida` decimal(15,2) DEFAULT 0.00,
  `linkedin` varchar(255) DEFAULT '',
  `twitter` varchar(255) DEFAULT '',
  `instagram` varchar(255) DEFAULT '',
  `tiktok` varchar(255) DEFAULT '',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  `cv_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `candidates`
--

INSERT INTO `candidates` (`id`, `nombre_apellido`, `descripcion`, `fecha_nacimiento`, `telefono`, `pais`, `provincia`, `ciudad`, `direccion`, `areas_interes`, `disponibilidad`, `remuneracion_pretendida`, `linkedin`, `twitter`, `instagram`, `tiktok`, `created_at`, `user_id`, `cv_url`) VALUES
(1, 'Cosme Argerich', 'asdfasdf', '2026-03-12', '0111555746444|', 'España', 'Ciudad Autónoma de Buenos Aires', 'Recoleta', 'Av general gelly y obes 2268', 'ghjkhjk', 'tytyu', 54456456.00, 'ghgh', '', '', '', '2026-03-17 00:39:11', NULL, NULL),
(2, 'Cosme Argerich', 'ojkjkjkljkljkljkljkl', '2026-03-10', '0111555746444', 'España', 'Ciudad Autónoma de Buenos Aires', 'Recoleta', 'Av general gelly y obes 2268', 'porteria', 'Full-Time', 234423234234.00, 'ghgh', '', '', '', '2026-03-17 01:16:40', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `candidate_companies`
--

DROP TABLE IF EXISTS `candidate_companies`;
CREATE TABLE IF NOT EXISTS `candidate_companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `candidate_positions`
--

DROP TABLE IF EXISTS `candidate_positions`;
CREATE TABLE IF NOT EXISTS `candidate_positions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `candidate_id` int(11) NOT NULL,
  `position_name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `candidate_id` (`candidate_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `companies`
--

DROP TABLE IF EXISTS `companies`;
CREATE TABLE IF NOT EXISTS `companies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `telefono` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `ciudad` varchar(100) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `companies`
--

INSERT INTO `companies` (`id`, `nombre`, `descripcion`, `telefono`, `email`, `pais`, `provincia`, `ciudad`, `direccion`, `logo_url`, `created_at`, `user_id`) VALUES
(1, 'Guimagra', 'asdfasdfasdfasdf', '0111555746444', 'cargerich8@gmail.com', 'España', 'Ciudad Autónoma de Buenos Aires', 'Recoleta', 'Av general gelly y obes 2268', NULL, '2026-03-17 15:51:55', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `job_postings`
--

DROP TABLE IF EXISTS `job_postings`;
CREATE TABLE IF NOT EXISTS `job_postings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa` varchar(255) NOT NULL,
  `posicion` varchar(255) NOT NULL,
  `requisitos` text DEFAULT NULL,
  `areas` varchar(255) NOT NULL,
  `disponibilidad` varchar(100) NOT NULL,
  `contacto` varchar(255) NOT NULL,
  `pais` varchar(100) NOT NULL,
  `provincia` varchar(100) NOT NULL,
  `areas_interes` varchar(255) NOT NULL,
  `zona` varchar(255) NOT NULL,
  `direccion` varchar(255) NOT NULL,
  `visible_suscripcion` tinyint(1) DEFAULT 0,
  `requiere_salario` tinyint(1) DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `approval_status` varchar(20) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `job_postings`
--

INSERT INTO `job_postings` (`id`, `empresa`, `posicion`, `requisitos`, `areas`, `disponibilidad`, `contacto`, `pais`, `provincia`, `areas_interes`, `zona`, `direccion`, `visible_suscripcion`, `requiere_salario`, `is_active`, `approval_status`, `created_at`, `user_id`) VALUES
(1, 'smt', 'Profesor', 'asdfadf', 'asdf', 'Full-Time', 'cargerich8@gmail.com', 'España', 'Ciudad Autónoma de Buenos Aires', 'porteria', 'Recoleta', 'Av general gelly y obes 2268', 1, 0, 1, 'pending', '2026-03-17 18:07:49', 2),
(2, 'YPF', 'Playero', 'Secundario Completo', 'Atencion al Cliente', 'Full-Time', 'ypf@gmail.com', 'Argentina', 'Buenos Aires', 'PLAYERO', 'San Miguel', 'Av. Leon Gallardo y Pardo', 1, 1, 1, 'pending', '2026-03-31 00:02:16', 7),
(3, 'smt', 'Profesor', 'asdfadf', 'asdf', 'Full-Time', 'cargerich8@gmail.com', 'Argentina', 'Ciudad Autónoma de Buenos Aires', 'porteria', 'Recoleta', 'Av general gelly y obes 2268', 0, 0, 1, 'pending', '2026-04-01 14:49:22', 10),
(4, 'YPF', 'Playero', 'Secundario Completo', 'Atencion al Cliente', 'Full-Time', 'loopsmiths1@gmail.com', 'Argentina', 'Buenos Aires', 'PLAYERO', 'San Miguel', 'Av. Leon Gallardo y Pardo', 1, 0, 1, 'approved', '2026-04-09 17:28:32', 35);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `tipo_cuenta` varchar(50) NOT NULL COMMENT 'candidato o empresa',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `approval_status` varchar(20) NOT NULL DEFAULT 'approved',
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expires` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `nombre_completo`, `email`, `password_hash`, `tipo_cuenta`, `is_active`, `approval_status`, `reset_token`, `reset_token_expires`, `created_at`) VALUES
(2, 'SMT', 'SMT@gmail.com', '$2b$10$IUwJQm9uySn/MLtECYpsdeHL1GAhkD.5C48mxrjA9ruXNKfSkyRBy', 'empresa', 1, 'approved', NULL, NULL, '2026-03-17 15:51:34'),
(3, 'otro', 'otro@gmail.com', '$2b$10$KN5UjiJiyQ6M8I/cIHzsK.i4snGCJpBu2gF5EcEL2dM14zoOq105i', 'candidato', 1, 'approved', NULL, NULL, '2026-03-17 18:49:52'),
(8, 'Cosme', 'cargerich8@gmail.com', '$2b$10$3nAKtltn1uHi9xz/wAHQ3O7YlTLMC5Oro8ktkATae3irz9zuUx6xm', 'candidato', 1, 'approved', NULL, NULL, '2026-04-01 14:46:16'),
(10, 'Cosme', 'miempresa@gmial.com', '$2b$10$uUZpbEHFwof2VUdjhV.h5uU8.Efv3GmtY44t2aOP.8obDDKYq2M1.', 'empresa', 1, 'approved', NULL, NULL, '2026-04-01 14:48:42'),
(11, 'Ari ', 'ar@gmail.co', '$2b$10$dD7sQWXeuRYpz15tlSlnwOIoX0Rf12I9BJsgH2uZYk/hph4rnOjt.', 'candidato', 1, 'approved', NULL, NULL, '2026-04-01 15:01:24'),
(12, 'Fab gn', 'asd@gmail.com', '$2b$10$SGmtjXcaKiIPZruGkn4nS.a9dSTp7fBEIu0jhap45.Rpp8RFia/G2', 'candidato', 1, 'approved', NULL, NULL, '2026-04-01 15:09:00'),
(14, 'Administrador Todo Trabajo', 'Todotrabajo@gmail.com', '$2b$10$YAFV61Aq.0l3U4e795QPROxzg.WIFCiCzvso6vy4ut5/hN622O/jS', 'admin', 1, 'approved', NULL, NULL, '2026-04-06 23:59:32'),
(33, 'Nacho Panaccia', 'Panaccia01@gmail.com', '$2b$10$826W1k5gct14KA0/3QY/oegWsZN/zqEfmg2Ef4aLADNWeCqN2JJ/S', 'candidato', 1, 'approved', NULL, NULL, '2026-04-08 21:43:17'),
(35, 'Nacho Panaccia Empresa', 'Panaccia00@gmail.com', '$2b$10$YRfTK.YFPLhpyZgoRfzkEukDREVLE7eqtD1LUXOmtIoAyMzRJ2TMq', 'empresa', 1, 'approved', 'ac627dee9616301ecf0ef4b401cda8a5c08bf8aee3ae59739adc9409c19195a8', '2026-04-09 18:21:55', '2026-04-08 21:45:31'),
(85, 'Nacho Admin', 'nacho@admin.com', '$2b$10$aKrLbuaHS.9ocT/Mro6GMuqGi4sdG8S18WQJlrTqOFXlkRLsg0B/G', 'admin', 1, 'approved', NULL, NULL, '2026-04-09 22:04:57'),
(86, 'Cosme Admin', 'cosme@admin.com', '$2b$10$.3FIoP0uuSFzrEMx8BOUlezptd18rZrZl9aNFlB0fmOc.CjbgEhoS', 'admin', 1, 'approved', NULL, NULL, '2026-04-09 22:04:57');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `job_postings` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `candidate_companies`
--
ALTER TABLE `candidate_companies`
  ADD CONSTRAINT `candidate_companies_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `candidate_positions`
--
ALTER TABLE `candidate_positions`
  ADD CONSTRAINT `candidate_positions_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `candidates` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
