-- =============================================================================
-- SISTEMA DE GESTION DE CLINICA MEDICA (SGCM - MVP)
-- FASE 4: VISTAS SQL OPTIMIZADAS (VIEWS)
-- =============================================================================
-- Autores: Fabian Trujillo, Alexandra Garzon
-- Proposito: Abstraccion y optimizacion de consultas frecuentes para el Frontend.
-- Vistas:
--   1. v_agenda_citas_recepcion (HU-07, HU-08): Vista consolidada para ventanilla.
--   2. v_historial_medico_completo (HU-10): Vista integral de historias y evoluciones.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. VISTA: v_agenda_citas_recepcion
-- -----------------------------------------------------------------------------
-- Proposito: Entrega al modulo de recepcion todos los datos necesarios para
--            gestionar el flujo de citas diarias sin necesidad de armar JOINs
--            manuales en la capa de aplicacion.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_agenda_citas_recepcion AS
SELECT 
    c.id AS cita_id,
    c.fecha_hora AS fecha_hora_completa,
    CAST(c.fecha_hora AS DATE) AS fecha_cita,
    TO_CHAR(c.fecha_hora, 'HH24:MI') AS hora_cita,
    p.id AS paciente_id,
    p.nombre AS paciente_nombre,
    p.telefono AS paciente_telefono,
    p.edad AS paciente_edad,
    m.id AS medico_id,
    m.nombre AS medico_nombre,
    m.especialidad AS especialidad_medica,
    c.estado AS estado_cita,
    COALESCE(c.motivo, 'Sin observacion') AS motivo_consulta,
    c.created_at AS fecha_agendamiento
FROM citas c
INNER JOIN pacientes p ON c.paciente_id = p.id
INNER JOIN medicos m ON c.medico_id = m.id;

COMMENT ON VIEW v_agenda_citas_recepcion IS 'Consolidado desnormalizado de citas para la terminal de recepcion y ventanilla de atencion.';


-- -----------------------------------------------------------------------------
-- 2. VISTA: v_historial_medico_completo
-- -----------------------------------------------------------------------------
-- Proposito: Despliega el expediente clinico cronologico de los pacientes
--            reuniendo los datos demograficos, el expediente, el medico tratante
--            y el juicio diagnostico/terapeutico de cada acto medico.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_historial_medico_completo AS
SELECT 
    rc.id AS registro_id,
    hc.id AS historia_clinica_id,
    hc.fecha_creacion AS fecha_apertura_expediente,
    p.id AS paciente_id,
    p.nombre AS paciente_nombre,
    p.edad AS paciente_edad,
    p.telefono AS paciente_telefono,
    rc.fecha_hora AS fecha_hora_atencion,
    CAST(rc.fecha_hora AS DATE) AS fecha_atencion,
    TO_CHAR(rc.fecha_hora, 'HH24:MI') AS hora_atencion,
    m.id AS medico_id,
    m.nombre AS medico_tratante,
    m.especialidad AS especialidad_medico,
    rc.diagnostico,
    rc.tratamiento,
    rc.cita_id,
    COALESCE(c.estado, 'CONSULTA_DIRECTA') AS estado_cita_origen,
    rc.created_at AS fecha_registro_sistema
FROM registros_consulta rc
INNER JOIN historias_clinicas hc ON rc.historia_clinica_id = hc.id
INNER JOIN pacientes p ON hc.paciente_id = p.id
INNER JOIN medicos m ON rc.medico_id = m.id
LEFT JOIN citas c ON rc.cita_id = c.id;

COMMENT ON VIEW v_historial_medico_completo IS 'Vista clinica exhaustiva para la visualizacion del historial medico del paciente (HU-10).';


-- -----------------------------------------------------------------------------
-- 3. VISTA COMPLEMENTARIA: v_medicos_activos_disponibilidad (HU-05)
-- -----------------------------------------------------------------------------
-- Proposito: Catalogo rapido para seleccion en combos de agendamiento.
-- -----------------------------------------------------------------------------
CREATE OR REPLACE VIEW v_medicos_activos_disponibilidad AS
SELECT 
    m.id AS medico_id,
    m.nombre AS medico_nombre,
    m.especialidad,
    m.telefono,
    (SELECT COUNT(*) FROM citas c WHERE c.medico_id = m.id AND c.estado = 'AGENDADA') AS citas_pendientes
FROM medicos m
WHERE m.activo = TRUE;

COMMENT ON VIEW v_medicos_activos_disponibilidad IS 'Catalogo optimizado de medicos habilitados con conteo de citas en agenda activa.';
