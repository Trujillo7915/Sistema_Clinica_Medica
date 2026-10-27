-- =============================================================================
-- SISTEMA DE GESTION DE CLINICA MEDICA (SGCM - MVP)
-- FASE 4: DISPARADORES Y FUNCIONES DE AUTOMATIZACION (PL/pgSQL TRIGGERS)
-- =============================================================================
-- Autores: Fabian Trujillo, Alexandra Garzon
-- Proposito: Automatizaciones de logica de negocio a nivel de base de datos
--            para asegurar consistencia e invariantes del sistema.
-- Triggers:
--   1. trg_paciente_crear_historia: Creacion automatica de historia clinica (1:1).
--   2. trg_registro_consulta_actualizar_cita: Transicion automatica a ATENDIDA (RN-06).
--   3. trg_citas_validar_medico_activo: Bloqueo de asignacion a medicos inactivos (RN-08).
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. TRIGGER: Creacion automatica del expediente clinico al registrar un paciente
-- -----------------------------------------------------------------------------
-- Regla: Todo paciente en el SGCM debe tener una historia clinica desde el primer
--        momento de su creacion (Composicion 1:1 estricta).
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_crear_historia_clinica_automatica()
RETURNS TRIGGER AS $$
BEGIN
    -- Inserta automaticamente el registro de historia clinica para el nuevo paciente
    INSERT INTO historias_clinicas (paciente_id, fecha_creacion)
    VALUES (NEW.id, CURRENT_DATE);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_paciente_crear_historia ON pacientes;

CREATE TRIGGER trg_paciente_crear_historia
AFTER INSERT ON pacientes
FOR EACH ROW
EXECUTE FUNCTION fn_crear_historia_clinica_automatica();

COMMENT ON FUNCTION fn_crear_historia_clinica_automatica() IS 'Crea automaticamente un expediente clinico vacio cada vez que se inserta un nuevo paciente.';


-- -----------------------------------------------------------------------------
-- 2. TRIGGER: Transicion automatica del estado de la Cita a 'ATENDIDA' (RN-06)
-- -----------------------------------------------------------------------------
-- Regla RN-06: "Una cita solo pasa a estado ATENDIDA a traves del registro de
--              diagnostico/tratamiento (RF-09); no existe una accion independiente
--              para marcarla como atendida."
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_transicion_cita_a_atendida()
RETURNS TRIGGER AS $$
DECLARE
    v_estado_actual VARCHAR(15);
BEGIN
    -- Solo aplica si el registro medico esta vinculado a una cita previa
    IF NEW.cita_id IS NOT NULL THEN
        -- Obtener estado actual de la cita referenciada
        SELECT estado INTO v_estado_actual 
        FROM citas 
        WHERE id = NEW.cita_id;

        -- Validar que la cita estuviera previamente agendada
        IF v_estado_actual = 'CANCELADA' THEN
            RAISE EXCEPTION 'RN-03 / RN-06: No se puede registrar atencion medica para una cita que fue cancelada (Cita ID: %)', NEW.cita_id
                USING ERRCODE = '23514';
        END IF;

        -- Actualizar estado de la cita a ATENDIDA
        UPDATE citas 
        SET estado = 'ATENDIDA'
        WHERE id = NEW.cita_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_registro_consulta_actualizar_cita ON registros_consulta;

CREATE TRIGGER trg_registro_consulta_actualizar_cita
AFTER INSERT ON registros_consulta
FOR EACH ROW
EXECUTE FUNCTION fn_transicion_cita_a_atendida();

COMMENT ON FUNCTION fn_transicion_cita_a_atendida() IS 'Cambia el estado de la cita a ATENDIDA al guardar el diagnostico medico (RN-06).';


-- -----------------------------------------------------------------------------
-- 3. TRIGGER: Validar que el medico asignado a una cita este ACTIVO (RN-08)
-- -----------------------------------------------------------------------------
-- Regla RN-08: "Un medico en estado inactivo no puede recibir nuevas citas."
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION fn_validar_medico_activo_en_cita()
RETURNS TRIGGER AS $$
DECLARE
    v_activo BOOLEAN;
    v_nombre_medico VARCHAR(100);
BEGIN
    SELECT activo, nombre INTO v_activo, v_nombre_medico
    FROM medicos
    WHERE id = NEW.medico_id;

    IF v_activo IS FALSE THEN
        RAISE EXCEPTION 'RN-08: El profesional medico % (ID: %) se encuentra en estado INACTIVO / DE BAJA. No se pueden agendar turnos a su nombre.', v_nombre_medico, NEW.medico_id
            USING ERRCODE = '23514';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_citas_validar_medico_activo ON citas;

CREATE TRIGGER trg_citas_validar_medico_activo
BEFORE INSERT OR UPDATE OF medico_id ON citas
FOR EACH ROW
EXECUTE FUNCTION fn_validar_medico_activo_en_cita();

COMMENT ON FUNCTION fn_validar_medico_activo_en_cita() IS 'Impide la creacion de citas para facultativos que no se encuentren activos en el sistema (RN-08).';
