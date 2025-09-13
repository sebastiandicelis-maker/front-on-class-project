-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-09-2025 a las 19:14:45
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bootcampbd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bootcamps`
--

CREATE TABLE `bootcamps` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(90) NOT NULL,
  `fecha_lanzamiento` date NOT NULL,
  `duracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bootcamps`
--

INSERT INTO `bootcamps` (`id`, `nombre`, `descripcion`, `fecha_lanzamiento`, `duracion`) VALUES
(1, 'Fullstack Web 2025', '', '2025-09-15', 12),
(2, 'Data Science Pro', '', '2025-10-01', 10),
(3, 'DevOps Mastery', '', '2025-11-05', 8),
(10, 'Bootcamp Reactivo - actualizado', 'Actualizado', '2025-09-09', 42),
(11, 'Bootcamp Reactivo', 'Curso de programación reactiva', '2025-09-08', 40),
(12, 'X', 'Y', '0000-00-00', 0),
(13, 'my boot', 'my boot nuevo 2', '0000-00-00', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bootcamp_capacidad`
--

CREATE TABLE `bootcamp_capacidad` (
  `bootcamp_id` varchar(255) NOT NULL,
  `capacidad_id` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bootcamp_persona`
--

CREATE TABLE `bootcamp_persona` (
  `id` int(11) NOT NULL,
  `bootcamp_id` int(11) NOT NULL,
  `persona_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bootcamps`
--
ALTER TABLE `bootcamps`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `bootcamp_capacidad`
--
ALTER TABLE `bootcamp_capacidad`
  ADD PRIMARY KEY (`bootcamp_id`,`capacidad_id`);

--
-- Indices de la tabla `bootcamp_persona`
--
ALTER TABLE `bootcamp_persona`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_bootcamp_persona` (`bootcamp_id`,`persona_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bootcamps`
--
ALTER TABLE `bootcamps`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `bootcamp_persona`
--
ALTER TABLE `bootcamp_persona`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
