-- =============================================================================
-- SISTEMA DE GESTION DE CLINICA MEDICA (SGCM - MVP)
-- FASE 4: SCRIPT DE INSERCION DE DATOS DE PRUEBA (DML SEEDS)
-- =============================================================================
-- Proposito: Poblado de datos realistas para pruebas funcionales, QA y testing
-- Cubre: Casos exitosos (Happy Path), casos de borde y reglas de negocio RN-01..08
-- =============================================================================

TRUNCATE TABLE registros_consulta, citas, historias_clinicas, medicos, pacientes RESTART IDENTITY CASCADE;

-- -----------------------------------------------------------------------------
-- 1. POBLADO DE PACIENTES (HU-01, HU-02, HU-03)
-- -----------------------------------------------------------------------------
INSERT INTO pacientes (id, nombre, edad, telefono, direccion) VALUES
('P-101', 'Carlos Andres Mendoza', 34, '3104567890', 'Calle 45 # 12-34, Bogota'),
('P-102', 'Maria Fernanda Gomez', 28, '3159876543', 'Carrera 7 # 115-40, Bogota'),
('P-103', 'Jorge Eduardo Ramirez', 62, '3001234567', 'Avenida Esperanza # 50-21, Bogota'),
('P-104', 'Valentina Rios Castro', 19, '3206549871', 'Transversal 23 # 85-12, Bogota'),
('P-105', 'Sofia Isabela Martinez', 8,  '3117894561', 'Calle 134 # 9-60, Bogota');

-- -----------------------------------------------------------------------------
-- 2. POBLADO DE MEDICOS (HU-04, HU-05, HU-06 | RN-01, RN-05, RN-08)
-- -----------------------------------------------------------------------------
INSERT INTO medicos (id, nombre, edad, telefono, especialidad, activo) VALUES
('M-201', 'Dra. Laura Camila Torres', 39, '3123456789', 'Medicina General', TRUE),
('M-202', 'Dr. Roberto Silva Morales', 48, '3167891234', 'Cardiologia', TRUE),
('M-203', 'Dra. Diana Patricia Hoyos', 42, '3189012345', 'Pediatria', TRUE),
('M-204', 'Dr. Andres Felipe Vargas', 35, '3145678901', 'Dermatologia', TRUE),
-- Medico inactivo para pruebas de baja medica (RN-01 / RN-08)
('M-205', 'Dr. Guillermo Leon Perez', 67, '3178901234', 'Medicina General', FALSE);

-- -----------------------------------------------------------------------------
-- 3. POBLADO DE HISTORIAS CLINICAS (Relacion 1:1 con Pacientes)
-- -----------------------------------------------------------------------------
INSERT INTO historias_clinicas (paciente_id, fecha_creacion) VALUES
('P-101', '2026-01-15'),
('P-102', '2026-02-01'),
('P-103', '2026-02-10'),
('P-104', '2026-03-01'),
('P-105', '2026-03-15');

-- -----------------------------------------------------------------------------
-- 4. POBLADO DE CITAS (HU-07, HU-08 | RN-02, RN-03)
-- -----------------------------------------------------------------------------
-- Cita 1: Atendida en el pasado
INSERT INTO citas (paciente_id, medico_id, fecha_hora, estado, motivo) VALUES
('P-101', 'M-201', '2026-03-20 08:30:00', 'ATENDIDA', 'Control de rutina e hipertension');

-- Cita 2: Atendida en el pasado para nino (Pediatria)
INSERT INTO citas (paciente_id, medico_id, fecha_hora, estado, motivo) VALUES
('P-105', 'M-203', '2026-03-22 10:00:00', 'ATENDIDA', 'Fiebre persistente y tos seca');

-- Cita 3: Cancelada por el paciente (HU-08)
INSERT INTO citas (paciente_id, medico_id, fecha_hora, estado, motivo) VALUES
('P-102', 'M-204', '2026-03-25 14:00:00', 'CANCELADA', 'Consulta dermatologica - cancelada por viaje');

-- Cita 4: Agendada a futuro (Activa - Must Have HU-07)
INSERT INTO citas (paciente_id, medico_id, fecha_hora, estado, motivo) VALUES
('P-103', 'M-202', '2026-11-05 09:00:00', 'AGENDADA', 'Evaluacion cardiovascular post-esfuerzo');

-- Cita 5: Agendada a futuro (Activa)
INSERT INTO citas (paciente_id, medico_id, fecha_hora, estado, motivo) VALUES
('P-104', 'M-201', '2026-11-05 11:30:00', 'AGENDADA', 'Revision de cuadro gripal y certificacion');

-- -----------------------------------------------------------------------------
-- 5. POBLADO DE REGISTROS DE CONSULTA (HU-09, HU-10 | RN-06)
-- -----------------------------------------------------------------------------
INSERT INTO registros_consulta (historia_clinica_id, cita_id, medico_id, fecha_hora, diagnostico, tratamiento) VALUES
(1, 1, 'M-201', '2026-03-20 09:00:00',
 'Hipertension arterial esencial grado 1 bajo control. Sin afeccion organica aguda.',
 'Continuar con Losartan 50mg cada 12 horas. Dieta hiposodica y actividad cardiovascular leve 30 min diarios.');

INSERT INTO registros_consulta (historia_clinica_id, cita_id, medico_id, fecha_hora, diagnostico, tratamiento) VALUES
(1, NULL, 'M-202', '2026-04-10 16:15:00',
 'Ecocardiograma transtoracico con fraccion de eyeccion del 62%. Ritmo sinusal normal.',
 'Se ratifica buen pronostico cardiaco. Proximo control de rutina en 6 meses.');

INSERT INTO registros_consulta (historia_clinica_id, cita_id, medico_id, fecha_hora, diagnostico, tratamiento) VALUES
(5, 2, 'M-203', '2026-03-22 10:35:00',
 'Faringoamigdalitis viral aguda sin sobreinfeccion bacteriana evidente.',
 'Acetaminofen jarabe 120mg/5ml: 5ml cada 6 horas por 3 dias si hay dolor o fiebre. Abundante hidratacion oral.');

INSERT INTO registros_consulta (historia_clinica_id, cita_id, medico_id, fecha_hora, diagnostico, tratamiento) VALUES
(3, NULL, 'M-202', '2026-02-15 11:00:00',
 'Evaluacion preliminar de palpitaciones ocasionales.',
 'Orden de Holter cardiaco de 24 horas y perfil lipidico completo en ayunas.');
