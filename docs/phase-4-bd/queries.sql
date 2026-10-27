-- =============================================================================
-- SISTEMA DE GESTION DE CLINICA MEDICA (SGCM - MVP)
-- FASE 4: CONSULTAS DE VALIDACION FUNCIONAL Y PRUEBAS DE INTEGRIDAD (DQL)
-- =============================================================================
-- Autores: Fabian Trujillo, Alexandra Garzon
-- Proposito: Bateria de consultas de lectura (DQL) para validar HU-01 a HU-10
--            y pruebas negativas controladas para verificar RN-01 a RN-08.
-- =============================================================================

-- =============================================================================
-- SECCION 1: CONSULTAS DE VALIDACION FUNCIONAL (DQL - HAPPY PATH)
-- =============================================================================

-- -----------------------------------------------------------------------------
-- CONSULTA 1 (HU-02): Listado general de pacientes registrados
-- Retorna: Identificacion, Nombre, Edad, Telefono y Domicilio.
-- -----------------------------------------------------------------------------
SELECT 
    p.id AS identificacion_paciente,
    p.nombre AS nombre_completo,
    p.edad,
    p.telefono,
    p.direccion,
    TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI') AS fecha_registro
FROM pacientes p
ORDER BY p.nombre ASC;


-- -----------------------------------------------------------------------------
-- CONSULTA 2 (HU-05 / RN-08): Catalogo de medicos activos disponibles para turnos
-- Filtra exclusivamente medicos habilitados (activo = TRUE) agrupados por especialidad.
-- -----------------------------------------------------------------------------
SELECT 
    m.id AS tarjeta_profesional,
    m.nombre AS medico,
    m.especialidad,
    m.telefono,
    CASE 
        WHEN m.activo THEN 'DISPONIBLE'
        ELSE 'INACTIVO / DE BAJA'
    END AS estado_operativo
FROM medicos m
WHERE m.activo = TRUE
ORDER BY m.especialidad ASC, m.nombre ASC;


-- -----------------------------------------------------------------------------
-- CONSULTA 3 (HU-07): Agenda de Citas con JOIN cruzado
-- Consolida la informacion para la pantalla de recepcion: Paciente + Medico + Horario.
-- -----------------------------------------------------------------------------
SELECT 
    c.id AS radicado_cita,
    TO_CHAR(c.fecha_hora, 'YYYY-MM-DD HH24:MI') AS fecha_hora_cita,
    p.id AS doc_paciente,
    p.nombre AS paciente,
    p.telefono AS telefono_contacto,
    m.nombre AS medico_asignado,
    m.especialidad,
    c.estado AS estado_turno,
    COALESCE(c.motivo, 'Sin observacion') AS motivo_consulta
FROM citas c
INNER JOIN pacientes p ON c.paciente_id = p.id
INNER JOIN medicos m ON c.medico_id = m.id
ORDER BY c.fecha_hora ASC;


-- -----------------------------------------------------------------------------
-- CONSULTA 4 (HU-08): Monitoreo de citas por estado (AGENDADA / ATENDIDA / CANCELADA)
-- Utilizada por la recepcionista para identificar citas canceladas o pendientes del dia.
-- -----------------------------------------------------------------------------
SELECT 
    c.estado,
    COUNT(c.id) AS total_citas
FROM citas c
GROUP BY c.estado
ORDER BY total_citas DESC;


-- -----------------------------------------------------------------------------
-- CONSULTA 5 (HU-10): Historial clinico cronologico completo de un paciente
-- Parametro de busqueda: Paciente 'P-101' (Carlos Andres Mendoza).
-- Retorna todas sus atenciones ordenadas cronologicamente de forma descendente.
-- -----------------------------------------------------------------------------
SELECT 
    p.id AS identificacion,
    p.nombre AS paciente,
    hc.id AS numero_expediente,
    TO_CHAR(rc.fecha_hora, 'YYYY-MM-DD HH24:MI') AS fecha_atencion,
    m.nombre AS medico_tratante,
    m.especialidad,
    rc.diagnostico,
    rc.tratamiento,
    COALESCE(rc.cita_id::TEXT, 'Consulta no agendada') AS cita_asociada
FROM historias_clinicas hc
INNER JOIN pacientes p ON hc.paciente_id = p.id
INNER JOIN registros_consulta rc ON rc.historia_clinica_id = hc.id
INNER JOIN medicos m ON rc.medico_id = m.id
WHERE p.id = 'P-101'
ORDER BY rc.fecha_hora DESC;


-- -----------------------------------------------------------------------------
-- CONSULTA 6 (HU-09): Trazabilidad de citas atendidas con su registro clinico
-- Valida la transicion obligatoria de cita a atencion clinica (RN-06).
-- -----------------------------------------------------------------------------
SELECT 
    c.id AS radicado_cita,
    c.fecha_hora AS fecha_cita,
    p.nombre AS paciente,
    m.nombre AS medico,
    c.estado AS estado_cita,
    rc.id AS id_registro_clinico,
    rc.diagnostico
FROM citas c
LEFT JOIN registros_consulta rc ON rc.cita_id = c.id
INNER JOIN pacientes p ON c.paciente_id = p.id
INNER JOIN medicos m ON c.medico_id = m.id
WHERE c.estado = 'ATENDIDA';


-- =============================================================================
-- SECCION 2: PRUEBAS NEGATIVAS DE REGLAS DE NEGOCIO (INTENCIONADAS PARA FALLAR)
-- =============================================================================
-- NOTA: Estas sentencias estan intencionalmente disenadas para violar constraints.
-- Para probarlas individualmente, descomentalas una por una y confirma el rechazo.

-- -----------------------------------------------------------------------------
-- PRUEBA NEGATIVA 1: Violacion de RN-02 (Sobreagendamiento de medico en mismo horario)
-- Objetivo: Intentar insertar una cita para el Dr. Laura Torres ('M-201')
--           en '2026-11-05 11:30:00' (Horario ya ocupado por la Cita #5).
-- Resultado Esperado: ERROR: duplicate key value violates unique constraint "uq_citas_medico_fecha_hora"
-- -----------------------------------------------------------------------------
/*
INSERT INTO citas (paciente_id, medico_id, fecha_hora, estado, motivo) 
VALUES ('P-102', 'M-201', '2026-11-05 11:30:00', 'AGENDADA', 'Intento de colision horario');
*/


-- -----------------------------------------------------------------------------
-- PRUEBA NEGATIVA 2: Violacion de RN-05 (Edad laboral del medico fuera de 18 a 99)
-- Objetivo: Intentar registrar a un profesional medico de 16 anos.
-- Resultado Esperado: ERROR: new row for relation "medicos" violates check constraint "chk_medicos_edad_laboral"
-- -----------------------------------------------------------------------------
/*
INSERT INTO medicos (id, nombre, edad, telefono, especialidad, activo) 
VALUES ('M-999', 'Practicante Menor de Edad', 16, '3101234567', 'Medicina General', TRUE);
*/


-- -----------------------------------------------------------------------------
-- PRUEBA NEGATIVA 3: Violacion de RN-04 (Telefono con menos de 7 digitos o con letras)
-- Objetivo: Intentar registrar un paciente con telefono invalido ('123ABC').
-- Resultado Esperado: ERROR: new row for relation "pacientes" violates check constraint "chk_pacientes_telefono_valido"
-- -----------------------------------------------------------------------------
/*
INSERT INTO pacientes (id, nombre, edad, telefono, direccion) 
VALUES ('P-999', 'Usuario Prueba Telefono', 30, '123ABC', 'Calle Falsa 123');
*/


-- -----------------------------------------------------------------------------
-- PRUEBA NEGATIVA 4: Violacion de RN-01 / RN-08 (Borrado fisico de medico con citas)
-- Objetivo: Intentar hacer un DELETE sobre 'M-201' que tiene citas asignadas.
-- Resultado Esperado: ERROR: update or delete on table "medicos" violates foreign key constraint "fk_citas_medico" on table "citas"
--                     DETAIL: Key (id)=(M-201) is still referenced from table "citas".
-- -----------------------------------------------------------------------------
/*
DELETE FROM medicos WHERE id = 'M-201';
*/


-- -----------------------------------------------------------------------------
-- PRUEBA NEGATIVA 5: Violacion de RN-06 (Intento de duplicar atencion para una misma cita)
-- Objetivo: Intentar asociar una segunda consulta a la Cita #1 que ya tiene atencion.
-- Resultado Esperado: ERROR: duplicate key value violates unique constraint "uq_registros_cita_unica"
-- -----------------------------------------------------------------------------
/*
INSERT INTO registros_consulta (historia_clinica_id, cita_id, medico_id, fecha_hora, diagnostico, tratamiento)
VALUES (1, 1, 'M-201', '2026-03-20 10:00:00', 'Segundo diagnostico no permitido', 'Formula duplicada');
*/
