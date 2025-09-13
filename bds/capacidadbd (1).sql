-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-09-2025 a las 19:15:55
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
-- Base de datos: `capacidadbd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capacidades`
--

CREATE TABLE `capacidades` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(90) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `capacidades`
--

INSERT INTO `capacidades` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Resolución de problemas', 'Avanzado'),
(2, 'Trabajo en equipo', 'Intermedio'),
(3, 'Comunicación efectiva', 'Avanzado'),
(4, 'Desarrollo Backend', 'Desarrollo de aplicaciones del lado del servidor'),
(5, 'Desarrollo Backend', 'Desarrollo de aplicaciones del lado del servidor'),
(6, 'Desarrollo Backend', 'Desarrollo de aplicaciones del lado del servidor'),
(9, 'Prueba UI', 'Creada desde PowerShell'),
(10, 'AUTO-1757501097373', 'Creada por UI test'),
(11, 'capacidad nueva front', 'pruebas'),
(12, 'AUTO-1757502217449', 'Creada por UI test'),
(13, 'mi capacidd', 'mi capacidd'),
(14, 'mi capacidad', 'mi cap'),
(15, 'capacidad nueva front', 'pruebas'),
(16, 'my test', 'my test'),
(17, '1', '1'),
(18, 'Desarrollo Backend', 'Desarrollo de aplicaciones del lado del servidor'),
(19, 'AAAAAAAA', 'AAAAAAAA'),
(20, 'N CAP', 'N CAP');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `capacidad_tecnologia`
--

CREATE TABLE `capacidad_tecnologia` (
  `capacidad_id` int(11) NOT NULL,
  `tecnologia_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `capacidad_tecnologia`
--

INSERT INTO `capacidad_tecnologia` (`capacidad_id`, `tecnologia_id`) VALUES
(4, 1),
(4, 2),
(4, 3),
(5, 1),
(5, 2),
(5, 3),
(7, 1),
(7, 2),
(7, 3),
(18, 1),
(18, 2),
(18, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tecnologias`
--

CREATE TABLE `tecnologias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `capacidades`
--
ALTER TABLE `capacidades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `capacidad_tecnologia`
--
ALTER TABLE `capacidad_tecnologia`
  ADD UNIQUE KEY `uq_capacidad_tecnologia` (`capacidad_id`,`tecnologia_id`);

--
-- Indices de la tabla `tecnologias`
--
ALTER TABLE `tecnologias`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `capacidades`
--
ALTER TABLE `capacidades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `tecnologias`
--
ALTER TABLE `tecnologias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
