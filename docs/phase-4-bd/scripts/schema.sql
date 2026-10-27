-- =============================================================================
-- SISTEMA DE GESTION DE CLINICA MEDICA (SGCM - MVP)
-- FASE 4: SCRIPT DE CREACION DE BASE DE DATOS (ESQUEMA DDL)
-- =============================================================================
-- Motor objetivo: PostgreSQL 14+ / ANSI SQL Compatible
-- Estandares: 3FN, Integridad Referencial Estricta, Nombres en snake_case
-- Trazabilidad: ERS V6, Historias HU-01 a HU-10 y Reglas de Negocio RN-01 a RN-08
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. ELIMINACION PREVIA DE TABLAS (Orden inverso de dependencias)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS registros_consulta CASCADE;
DROP TABLE IF EXISTS citas CASCADE;
DROP TABLE IF EXISTS historias_clinicas CASCADE;
DROP TABLE IF EXISTS medicos CASCADE;
DROP TABLE IF EXISTS pacientes CASCADE;

-- -----------------------------------------------------------------------------
-- 1. TABLA: PACIENTES (Trazabilidad: HU-01, HU-02, HU-03 | RF-01, RF-02, RF-03)
-- -----------------------------------------------------------------------------
CREATE TABLE pacientes (
    id VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Clave Primaria
    CONSTRAINT pk_pacientes PRIMARY KEY (id),

    -- Restricciones de Dominio y Negocio
    CONSTRAINT chk_pacientes_id_not_empty CHECK (LENGTH(TRIM(id)) > 0),
    CONSTRAINT chk_pacientes_nombre_not_empty CHECK (LENGTH(TRIM(nombre)) > 0),
    CONSTRAINT chk_pacientes_edad_range CHECK (edad >= 0 AND edad <= 125),
    CONSTRAINT chk_pacientes_telefono_valido CHECK (LENGTH(TRIM(telefono)) >= 7 AND telefono ~ '^[0-9+\-\s]+$'),
    CONSTRAINT chk_pacientes_direccion_not_empty CHECK (LENGTH(TRIM(direccion)) > 0)
);

COMMENT ON TABLE pacientes IS 'Almacena los datos personales y de contacto de los pacientes registrados en la clinica.';
COMMENT ON COLUMN pacientes.id IS 'Numero de identificacion legal o cedula del paciente (Identificador de Negocio y PK).';
COMMENT ON COLUMN pacientes.telefono IS 'Numero telefonico de contacto; minimo 7 digitos numericos.';

-- -----------------------------------------------------------------------------
-- 2. TABLA: MEDICOS (Trazabilidad: HU-04, HU-05, HU-06 | RF-04, RF-05, RF-06 | RN-01, RN-05, RN-08)
-- -----------------------------------------------------------------------------
CREATE TABLE medicos (
    id VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Clave Primaria
    CONSTRAINT pk_medicos PRIMARY KEY (id),

    -- Restricciones de Dominio y Negocio
    CONSTRAINT chk_medicos_id_not_empty CHECK (LENGTH(TRIM(id)) > 0),
    CONSTRAINT chk_medicos_nombre_not_empty CHECK (LENGTH(TRIM(nombre)) > 0),
    -- RN-05: Edad laboral valida para profesionales medicos (18 a 99 anos)
    CONSTRAINT chk_medicos_edad_laboral CHECK (edad >= 18 AND edad <= 99),
    -- RN-04: Telefono con minimo 7 digitos
    CONSTRAINT chk_medicos_telefono_valido CHECK (LENGTH(TRIM(telefono)) >= 7 AND telefono ~ '^[0-9+\-\s]+$'),
    CONSTRAINT chk_medicos_especialidad_not_empty CHECK (LENGTH(TRIM(especialidad)) > 0)
);

COMMENT ON TABLE medicos IS 'Catalogo de facultativos y especialistas habilitados para la atencion.';
COMMENT ON COLUMN medicos.activo IS 'Bandera de borrado logico / baja medica (RN-01, RN-08). TRUE = Activo, FALSE = Inactivo.';

-- -----------------------------------------------------------------------------
-- 3. TABLA: HISTORIAS_CLINICAS (Trazabilidad: HU-09, HU-10 | RF-09, RF-10)
-- -----------------------------------------------------------------------------
CREATE TABLE historias_clinicas (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    paciente_id VARCHAR(20) NOT NULL,
    fecha_creacion DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Claves
    CONSTRAINT pk_historias_clinicas PRIMARY KEY (id),
    -- Relacion 1 a 1 estricta: Cada paciente tiene exactamente UNA historia clinica
    CONSTRAINT uq_historias_paciente_id UNIQUE (paciente_id),

    -- Integridad Referencial: Si se elimina el paciente, se elimina su expediente (Composicion fuerte)
    CONSTRAINT fk_historias_paciente FOREIGN KEY (paciente_id)
        REFERENCES pacientes (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

COMMENT ON TABLE historias_clinicas IS 'Expediente clinico general vinculado 1:1 con cada paciente.';

-- -----------------------------------------------------------------------------
-- 4. TABLA: CITAS (Trazabilidad: HU-07, HU-08 | RF-07, RF-08 | RN-02, RN-03, RN-07)
-- -----------------------------------------------------------------------------
CREATE TABLE citas (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    paciente_id VARCHAR(20) NOT NULL,
    medico_id VARCHAR(20) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    estado VARCHAR(15) DEFAULT 'AGENDADA' NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Clave Primaria
    CONSTRAINT pk_citas PRIMARY KEY (id),

    -- Claves Foraneas
    CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id)
        REFERENCES pacientes (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- RN-08: No se permite borrado fisico de medico si tiene citas asignadas
    CONSTRAINT fk_citas_medico FOREIGN KEY (medico_id)
        REFERENCES medicos (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Estados validos de la cita
    CONSTRAINT chk_citas_estado_valido CHECK (estado IN ('AGENDADA', 'ATENDIDA', 'CANCELADA')),

    -- RN-02: Regla de no-colision de agenda para citas programadas
    CONSTRAINT uq_citas_medico_fecha_hora UNIQUE (medico_id, fecha_hora)
);

COMMENT ON TABLE citas IS 'Programacion de turnos medicos entre pacientes y doctores.';
COMMENT ON COLUMN citas.estado IS 'Ciclo de vida: AGENDADA -> ATENDIDA (o CANCELADA).';

-- -----------------------------------------------------------------------------
-- 5. TABLA: REGISTROS_CONSULTA (Trazabilidad: HU-09, HU-10 | RF-09, RF-10 | RN-06)
-- -----------------------------------------------------------------------------
CREATE TABLE registros_consulta (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    historia_clinica_id BIGINT NOT NULL,
    cita_id BIGINT,
    medico_id VARCHAR(20) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Clave Primaria
    CONSTRAINT pk_registros_consulta PRIMARY KEY (id),

    -- Claves Foraneas
    CONSTRAINT fk_registros_historia FOREIGN KEY (historia_clinica_id)
        REFERENCES historias_clinicas (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    -- RN-06: Vinculo opcional 1:1 con la cita que origino la consulta
    CONSTRAINT fk_registros_cita FOREIGN KEY (cita_id)
        REFERENCES citas (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,

    CONSTRAINT fk_registros_medico FOREIGN KEY (medico_id)
        REFERENCES medicos (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,

    -- Restriccion: Una misma cita solo puede ser atendida y registrada una unica vez
    CONSTRAINT uq_registros_cita_unica UNIQUE (cita_id),

    -- Validaciones de contenido obligatorio
    CONSTRAINT chk_registros_diagnostico_not_empty CHECK (LENGTH(TRIM(diagnostico)) > 0),
    CONSTRAINT chk_registros_tratamiento_not_empty CHECK (LENGTH(TRIM(tratamiento)) > 0)
);

COMMENT ON TABLE registros_consulta IS 'Entradas evolutivas de atencion medica dentro de la historia clinica.';

-- -----------------------------------------------------------------------------
-- 6. INDICES PARA OPTIMIZACION DE CONSULTAS (Performance Tuning)
-- -----------------------------------------------------------------------------
CREATE INDEX idx_citas_medico_fecha ON citas (medico_id, fecha_hora);
CREATE INDEX idx_citas_paciente_estado ON citas (paciente_id, estado);
CREATE INDEX idx_registros_historia_fecha ON registros_consulta (historia_clinica_id, fecha_hora DESC);
CREATE INDEX idx_medicos_especialidad_activo ON medicos (especialidad, activo);
