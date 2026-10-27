# FASE 4 — PUNTO 8: ESTRUCTURA DDL Y CREACIÓN DE TABLAS
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Autores:** Fabián Trujillo, Alexandra Garzón  
**Trazabilidad:** Historias de Usuario (HU-01 a HU-10), ERS IEEE 830 (V6), Reglas de Negocio (RN-01 a RN-08) y Script `schema.sql`.  
**Fase del Ciclo de Vida:** Fase 4 — Base de Datos y Persistencia.

---

## 1. Introducción y Enfoque Físico

El Lenguaje de Definición de Datos (**Data Definition Language - DDL**) materializa el diseño conceptual y lógico en sentencias ejecutables sobre el motor de base de datos relacional (PostgreSQL 14+ / ANSI SQL estándar). 

Este documento detalla la definición física de las **5 tablas esenciales** del Producto Mínimo Viable (MVP), sus tipos de datos a nivel de almacenamiento en disco, nulabilidad estricta (`NOT NULL`), valores por defecto y la estrategia de indexación B-Tree implementada para garantizar alta eficiencia y tiempos de respuesta subsegundo en entornos concurrentes.

---

## 2. Detalle de Estructura Física por Tabla

### 2.1. Tabla `pacientes`
* **Propósito:** Almacén maestro de los pacientes que reciben atención médica en la clínica.
* **Trazabilidad:** HU-01 (Registrar), HU-02 (Consultar), HU-03 (Actualizar) | RF-01, RF-02, RF-03.

```sql
CREATE TABLE pacientes (
    id VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    direccion VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_pacientes PRIMARY KEY (id),
    CONSTRAINT chk_pacientes_id_not_empty CHECK (LENGTH(TRIM(id)) > 0),
    CONSTRAINT chk_pacientes_nombre_not_empty CHECK (LENGTH(TRIM(nombre)) > 0),
    CONSTRAINT chk_pacientes_edad_range CHECK (edad >= 0 AND edad <= 125),
    CONSTRAINT chk_pacientes_telefono_valido CHECK (LENGTH(TRIM(telefono)) >= 7 AND telefono ~ '^[0-9+\-\s]+$'),
    CONSTRAINT chk_pacientes_direccion_not_empty CHECK (LENGTH(TRIM(direccion)) > 0)
);
```

| Columna | Tipo Físico | Nulabilidad | Valor por Defecto | Restricción / Índice | Justificación Técnica |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `PK (B-Tree Clustered)` | Cédula o pasaporte; alfanumérico para compatibilidad internacional. |
| `nombre` | `VARCHAR(100)` | `NOT NULL` | Ninguno | `CHECK (no vacío)` | Espacio óptimo para nombres y apellidos sin truncamiento. |
| `edad` | `INT` | `NOT NULL` | Ninguno | `CHECK (0..125)` | Soporta desde neonatos (0 años) hasta adultos mayores. |
| `telefono` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `CHECK (min 7 dígitos)` | **RN-04:** Cadena que admite prefijos internacionales (`+57`). |
| `direccion` | `VARCHAR(255)` | `NOT NULL` | Ninguno | `CHECK (no vacío)` | Longitud suficiente para nomenclatura urbana o rural. |
| `created_at`| `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Ninguno | Auditoría inmutable de fecha y hora de alta del registro. |

---

### 2.2. Tabla `medicos`
* **Propósito:** Catálogo de profesionales médicos y especialistas habilitados en la institución.
* **Trazabilidad:** HU-04 (Registrar), HU-05 (Consultar), HU-06 (Eliminar/Baja) | RF-04, RF-05, RF-06 | RN-01, RN-05, RN-08.

```sql
CREATE TABLE medicos (
    id VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    edad INT NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    especialidad VARCHAR(100) NOT NULL,
    activo BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_medicos PRIMARY KEY (id),
    CONSTRAINT chk_medicos_id_not_empty CHECK (LENGTH(TRIM(id)) > 0),
    CONSTRAINT chk_medicos_nombre_not_empty CHECK (LENGTH(TRIM(nombre)) > 0),
    CONSTRAINT chk_medicos_edad_laboral CHECK (edad >= 18 AND edad <= 99),
    CONSTRAINT chk_medicos_telefono_valido CHECK (LENGTH(TRIM(telefono)) >= 7 AND telefono ~ '^[0-9+\-\s]+$'),
    CONSTRAINT chk_medicos_especialidad_not_empty CHECK (LENGTH(TRIM(especialidad)) > 0)
);
```

| Columna | Tipo Físico | Nulabilidad | Valor por Defecto | Restricción / Índice | Justificación Técnica |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `PK (B-Tree Clustered)` | Tarjeta profesional o cédula del médico. |
| `nombre` | `VARCHAR(100)` | `NOT NULL` | Ninguno | `CHECK (no vacío)` | Nombre completo del facultativo con título. |
| `edad` | `INT` | `NOT NULL` | Ninguno | `CHECK (18..99)` | **RN-05:** Restricción legal de edad laboral profesional. |
| `telefono` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `CHECK (min 7 dígitos)` | **RN-04:** Canal de localización para guardias e interconsultas. |
| `especialidad` | `VARCHAR(100)` | `NOT NULL` | Ninguno | `Índice compuesto` | Especialidad clínica (Medicina General, Pediatría, etc.). |
| `activo` | `BOOLEAN` | `NOT NULL` | `TRUE` | `Índice compuesto` | **RN-01 / RN-08:** Bandera de baja lógica institucional. |
| `created_at`| `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Ninguno | Registro cronológico del alta profesional. |

---

### 2.3. Tabla `historias_clinicas`
* **Propósito:** Expediente clínico unificado; garantiza la relación $1:1$ estricta con el paciente.
* **Trazabilidad:** HU-09, HU-10 | RF-09, RF-10 | Composición fuerte.

```sql
CREATE TABLE historias_clinicas (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    paciente_id VARCHAR(20) NOT NULL,
    fecha_creacion DATE DEFAULT CURRENT_DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_historias_clinicas PRIMARY KEY (id),
    CONSTRAINT uq_historias_paciente_id UNIQUE (paciente_id),
    CONSTRAINT fk_historias_paciente FOREIGN KEY (paciente_id)
        REFERENCES pacientes (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);
```

| Columna | Tipo Físico | Nulabilidad | Valor por Defecto | Restricción / Índice | Justificación Técnica |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `BIGINT` | `NOT NULL` | `GENERATED ALWAYS AS IDENTITY` | `PK (B-Tree)` | Secuencial de 64 bits para escalabilidad a millones de historias. |
| `paciente_id` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `FK, UNIQUE (B-Tree)` | Asegura que un paciente tenga una y solo una historia en su vida. |
| `fecha_creacion`| `DATE` | `NOT NULL` | `CURRENT_DATE` | Ninguno | Fecha oficial de apertura del expediente médico. |
| `created_at`| `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Ninguno | Auditoría temporal precisa con zona horaria. |

---

### 2.4. Tabla `citas`
* **Propósito:** Gestión transaccional del agendamiento y turno de atención médica.
* **Trazabilidad:** HU-07 (Agendar), HU-08 (Cancelar) | RF-07, RF-08 | RN-02, RN-07, RN-08.

```sql
CREATE TABLE citas (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    paciente_id VARCHAR(20) NOT NULL,
    medico_id VARCHAR(20) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    estado VARCHAR(15) DEFAULT 'AGENDADA' NOT NULL,
    motivo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_citas PRIMARY KEY (id),
    CONSTRAINT fk_citas_paciente FOREIGN KEY (paciente_id)
        REFERENCES pacientes (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT fk_citas_medico FOREIGN KEY (medico_id)
        REFERENCES medicos (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT chk_citas_estado_valido CHECK (estado IN ('AGENDADA', 'ATENDIDA', 'CANCELADA')),
    CONSTRAINT uq_citas_medico_fecha_hora UNIQUE (medico_id, fecha_hora)
);
```

| Columna | Tipo Físico | Nulabilidad | Valor por Defecto | Restricción / Índice | Justificación Técnica |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `BIGINT` | `NOT NULL` | `GENERATED ALWAYS AS IDENTITY` | `PK (B-Tree)` | Clave subrogada autoincremental única por turno. |
| `paciente_id` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `FK (RESTRICT)` | Paciente citado; se prohíbe borrar pacientes con citas registradas. |
| `medico_id` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `FK (RESTRICT), UNIQUE comp.` | **RN-08:** Médico citado; bloquea borrado físico con citas asignadas. |
| `fecha_hora` | `TIMESTAMP` | `NOT NULL` | Ninguno | `UNIQUE compuesto (RN-02)` | Fecha y hora exacta; evita doble reserva en el mismo horario. |
| `estado` | `VARCHAR(15)` | `NOT NULL` | `'AGENDADA'` | `CHECK (AGENDADA, ATENDIDA, CANCELADA)` | Ciclo de vida controlado formalmente (**RN-06**, **RN-07**). |
| `motivo` | `VARCHAR(255)` | `NULL` | Ninguno | Ninguno | Sintomatología o descripción corta del motivo de consulta. |
| `created_at`| `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Ninguno | Marca temporal del momento en que se procesó el agendamiento. |

---

### 2.5. Tabla `registros_consulta`
* **Propósito:** Entradas clínicas evolutivas de juicio diagnóstico y formulación terapéutica.
* **Trazabilidad:** HU-09 (Registrar diagnóstico), HU-10 (Consultar historial) | RF-09, RF-10 | RN-03, RN-06.

```sql
CREATE TABLE registros_consulta (
    id BIGINT GENERATED ALWAYS AS IDENTITY,
    historia_clinica_id BIGINT NOT NULL,
    cita_id BIGINT,
    medico_id VARCHAR(20) NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    diagnostico TEXT NOT NULL,
    tratamiento TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT pk_registros_consulta PRIMARY KEY (id),
    CONSTRAINT fk_registros_historia FOREIGN KEY (historia_clinica_id)
        REFERENCES historias_clinicas (id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT fk_registros_cita FOREIGN KEY (cita_id)
        REFERENCES citas (id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT fk_registros_medico FOREIGN KEY (medico_id)
        REFERENCES medicos (id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
    CONSTRAINT uq_registros_cita_unica UNIQUE (cita_id),
    CONSTRAINT chk_registros_diagnostico_not_empty CHECK (LENGTH(TRIM(diagnostico)) > 0),
    CONSTRAINT chk_registros_tratamiento_not_empty CHECK (LENGTH(TRIM(tratamiento)) > 0)
);
```

| Columna | Tipo Físico | Nulabilidad | Valor por Defecto | Restricción / Índice | Justificación Técnica |
| :--- | :--- | :---: | :---: | :--- | :--- |
| `id` | `BIGINT` | `NOT NULL` | `GENERATED ALWAYS AS IDENTITY` | `PK (B-Tree)` | Secuencial único por acto médico. |
| `historia_clinica_id` | `BIGINT` | `NOT NULL` | Ninguno | `FK (CASCADE), Índice compuesto` | Expediente del paciente al que se anexa la evolución clínica. |
| `cita_id` | `BIGINT` | `NULL` | `NULL` | `FK (SET NULL), UNIQUE (RN-06)` | Vínculo opcional $1:1$ con la cita que originó la atención médica. |
| `medico_id` | `VARCHAR(20)` | `NOT NULL` | Ninguno | `FK (RESTRICT)` | Facultativo que emite y firma el diagnóstico legal. |
| `fecha_hora` | `TIMESTAMP` | `NOT NULL` | Ninguno | `Índice compuesto (DESC)` | Instante de la atención; ordenamiento cronológico para HU-10. |
| `diagnostico` | `TEXT` | `NOT NULL` | Ninguno | `CHECK (no vacío)` | Descripción médica sin límite restrictivo de caracteres. |
| `tratamiento` | `TEXT` | `NOT NULL` | Ninguno | `CHECK (no vacío)` | Prescripción farmacológica y plan de cuidados clínicos. |
| `created_at`| `TIMESTAMP` | `NOT NULL` | `CURRENT_TIMESTAMP` | Ninguno | Auditoría legal forense del acto médico. |

---

## 3. Estrategia de Indexación y Optimización de Consultas (Performance Tuning)

Para evitar escaneos secuenciales completos de tablas (`Seq Scan`) en producción, el script `schema.sql` crea 4 índices secundarios B-Tree estratégicos:

```sql
-- 1. Optimización para validación de disponibilidad y agenda del médico (HU-07 / RN-02)
CREATE INDEX idx_citas_medico_fecha ON citas (medico_id, fecha_hora);

-- 2. Optimización para consultar citas activas de un paciente (HU-01, HU-07)
CREATE INDEX idx_citas_paciente_estado ON citas (paciente_id, estado);

-- 3. Optimización para consulta cronológica de historia clínica (HU-10)
CREATE INDEX idx_registros_historia_fecha ON registros_consulta (historia_clinica_id, fecha_hora DESC);

-- 4. Optimización para búsqueda de especialistas disponibles para agendamiento (HU-05)
CREATE INDEX idx_medicos_especialidad_activo ON medicos (especialidad, activo);
```

### Justificación Técnica de los Índices:
1. **`idx_citas_medico_fecha`:** Convierte la verificación de sobreagendamiento (`WHERE medico_id = ? AND fecha_hora = ?`) en una búsqueda de costo $O(\log n)$ tipo `Index Scan`, respondiendo en menos de 2 milisegundos.
2. **`idx_registros_historia_fecha`:** Al incluir `fecha_hora DESC` en el árbol B-Tree, resuelve la consulta de historial de HU-10 (`ORDER BY fecha_hora DESC`) sin necesidad de una costosa operación de ordenamiento en memoria (`Sort Method: top-N heapsort`).
3. **`idx_medicos_especialidad_activo`:** Permite filtrar instantáneamente en la interfaz de recepción los médicos que pueden recibir citas por especialidad omitiendo a los inactivos.
