# FASE 4 — DICCIONARIO DE DATOS CONSOLIDADO Y ESTIMACIÓN DE VOLUMETRÍA
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Autores:** Fabián Trujillo, Alexandra Garzón  
**Trazabilidad:** Historias de Usuario (HU-01 a HU-10), ERS IEEE 830 (V6), Reglas de Negocio (RN-01 a RN-08) y Script `schema.sql`.  
**Fase del Ciclo de Vida:** Fase 4 — Base de Datos y Persistencia.

---

## 1. Introducción

El presente **Diccionario de Datos** es la referencia técnica definitiva que describe metódicamente la estructura física, los tipos de almacenamiento, las restricciones de integridad y las características de cada columna en el esquema relacional del **Sistema de Gestión de Clínica Médica (SGCM)**.

Asimismo, se incluye el estudio de **estimación de volumetría y dimensionamiento físico de almacenamiento** para proyectar el crecimiento de datos del MVP y planificar la infraestructura del servidor de base de datos a 12 meses.

---

## 2. Diccionario de Datos por Tabla

### 2.1. Tabla: `pacientes`
* **Nombre Físico:** `pacientes`
* **Tipo de Entidad:** Fuerte / Maestra
* **Descripción:** Almacena los datos personales, demográficos y de contacto de los pacientes de la clínica.

| Campo | Tipo SQL | Longitud | Clave | Nulo | Default | Dominio / Valores Permitidos | Descripción Técnica y Regla de Negocio |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| `id` | `VARCHAR` | 20 | **PK** | **NO** | Ninguno | Cadenas alfanuméricas no vacías | Identificación legal o cédula de ciudadanía. Clave primaria natural. |
| `nombre` | `VARCHAR` | 100 | - | **NO** | Ninguno | Texto con al menos 1 caracter no espacio | Nombres y apellidos completos del paciente. |
| `edad` | `INT` | 4 bytes | - | **NO** | Ninguno | Enteros entre 0 y 125 | Edad en años cumplidos. Validado por `chk_pacientes_edad_range`. |
| `telefono` | `VARCHAR` | 20 | - | **NO** | Ninguno | Regex `^[0-9+\-\s]+$`, longitud $\ge 7$ | **RN-04:** Teléfono principal de contacto. Mínimo 7 caracteres numéricos. |
| `direccion`| `VARCHAR` | 255 | - | **NO** | Ninguno | Cadenas de texto no vacías | Dirección física de residencia del paciente. |
| `created_at`| `TIMESTAMP`| 8 bytes | - | **NO** | `CURRENT_TIMESTAMP`| Marcas de tiempo válidas | Fecha y hora de creación del registro en el sistema. |

---

### 2.2. Tabla: `medicos`
* **Nombre Físico:** `medicos`
* **Tipo de Entidad:** Fuerte / Catálogo
* **Descripción:** Registro de facultativos y especialistas médicos contratados por la clínica.

| Campo | Tipo SQL | Longitud | Clave | Nulo | Default | Dominio / Valores Permitidos | Descripción Técnica y Regla de Negocio |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| `id` | `VARCHAR` | 20 | **PK** | **NO** | Ninguno | Cadenas alfanuméricas no vacías | Tarjeta profesional o cédula del médico. Clave primaria de negocio. |
| `nombre` | `VARCHAR` | 100 | - | **NO** | Ninguno | Texto con al menos 1 caracter no espacio | Nombre completo y título del profesional de la salud. |
| `edad` | `INT` | 4 bytes | - | **NO** | Ninguno | Enteros entre 18 y 99 | **RN-05:** Rango laboral médico legal (`chk_medicos_edad_laboral`). |
| `telefono` | `VARCHAR` | 20 | - | **NO** | Ninguno | Regex `^[0-9+\-\s]+$`, longitud $\ge 7$ | **RN-04:** Línea telefónica institucional o personal del facultativo. |
| `especialidad`| `VARCHAR` | 100 | - | **NO** | Ninguno | Especialidades válidas | Rama médica (Medicina General, Cardiología, Pediatría, etc.). |
| `activo` | `BOOLEAN` | 1 byte | - | **NO** | `TRUE` | `TRUE` (Habilitado), `FALSE` (Baja) | **RN-01 / RN-08:** Bandera de borrado lógico / estado de disponibilidad. |
| `created_at`| `TIMESTAMP`| 8 bytes | - | **NO** | `CURRENT_TIMESTAMP`| Marcas de tiempo válidas | Marca temporal de alta del médico. |

---

### 2.3. Tabla: `historias_clinicas`
* **Nombre Físico:** `historias_clinicas`
* **Tipo de Entidad:** Débil / Expediente Maestro
* **Descripción:** Encabezado del expediente médico único de cada paciente ($1:1$).

| Campo | Tipo SQL | Longitud | Clave | Nulo | Default | Dominio / Valores Permitidos | Descripción Técnica y Regla de Negocio |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| `id` | `BIGINT` | 8 bytes | **PK** | **NO** | `IDENTITY` | Enteros positivos de 64 bits | Identificador secuencial autoincremental de expediente. |
| `paciente_id`| `VARCHAR` | 20 | **FK, UK** | **NO** | Ninguno | Claves existentes en `pacientes(id)` | Vínculo 1:1 estricto con el paciente (`ON DELETE CASCADE`). |
| `fecha_creacion`| `DATE` | 4 bytes | - | **NO** | `CURRENT_DATE` | Fechas válidas de calendario | Fecha oficial de apertura del expediente. |
| `created_at`| `TIMESTAMP`| 8 bytes | - | **NO** | `CURRENT_TIMESTAMP`| Marcas de tiempo válidas | Auditoría de creación del expediente. |

---

### 2.4. Tabla: `citas`
* **Nombre Físico:** `citas`
* **Tipo de Entidad:** Asociativa / Transaccional
* **Descripción:** Programación de turnos médicos entre pacientes y doctores.

| Campo | Tipo SQL | Longitud | Clave | Nulo | Default | Dominio / Valores Permitidos | Descripción Técnica y Regla de Negocio |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| `id` | `BIGINT` | 8 bytes | **PK** | **NO** | `IDENTITY` | Enteros positivos de 64 bits | Radicado numérico único de la cita médica. |
| `paciente_id`| `VARCHAR` | 20 | **FK** | **NO** | Ninguno | Claves existentes en `pacientes(id)` | Identificador del paciente que solicitó la cita (`ON DELETE RESTRICT`). |
| `medico_id` | `VARCHAR` | 20 | **FK, UK1**| **NO** | Ninguno | Claves existentes en `medicos(id)` | Médico asignado a la cita (`ON DELETE RESTRICT`). |
| `fecha_hora` | `TIMESTAMP`| 8 bytes | **UK1** | **NO** | Ninguno | Estampas de tiempo | **RN-02:** Fecha y hora exacta. En conjunto con `medico_id` forma `uq_citas_medico_fecha_hora`. |
| `estado` | `VARCHAR` | 15 | - | **NO** | `'AGENDADA'` | `'AGENDADA'`, `'ATENDIDA'`, `'CANCELADA'` | **RN-06 / RN-07:** Ciclo de vida controlado (`chk_citas_estado_valido`). |
| `motivo` | `VARCHAR` | 255 | - | SÍ | `NULL` | Texto descriptivo opcional | Razón o síntoma por el cual el paciente agenda la consulta. |
| `created_at`| `TIMESTAMP`| 8 bytes | - | **NO** | `CURRENT_TIMESTAMP`| Marcas de tiempo válidas | Fecha y hora en que se agendó el turno. |

---

### 2.5. Tabla: `registros_consulta`
* **Nombre Físico:** `registros_consulta`
* **Tipo de Entidad:** Débil / Evolución Clínica
* **Descripción:** Detalle de diagnóstico y formulación emitidos por el facultativo en cada acto médico.

| Campo | Tipo SQL | Longitud | Clave | Nulo | Default | Dominio / Valores Permitidos | Descripción Técnica y Regla de Negocio |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- | :--- |
| `id` | `BIGINT` | 8 bytes | **PK** | **NO** | `IDENTITY` | Enteros positivos de 64 bits | Identificador único de evolución médica. |
| `historia_clinica_id`| `BIGINT`| 8 bytes | **FK** | **NO** | Ninguno | Claves en `historias_clinicas(id)` | Expediente clínico al que pertenece el registro (`ON DELETE CASCADE`). |
| `cita_id` | `BIGINT` | 8 bytes | **FK, UK** | SÍ | `NULL` | Claves en `citas(id)` | **RN-06:** Cita origen opcional; unicidad estricta (`ON DELETE SET NULL`). |
| `medico_id` | `VARCHAR` | 20 | **FK** | **NO** | Ninguno | Claves en `medicos(id)` | Médico que realizó la atención y firma el registro (`ON DELETE RESTRICT`). |
| `fecha_hora` | `TIMESTAMP`| 8 bytes | - | **NO** | Ninguno | Marcas de tiempo | Fecha y hora real en que se efectuó el acto médico. |
| `diagnostico`| `TEXT` | Variable | - | **NO** | Ninguno | Texto no vacío | Conclusión diagnóstica médica con criterio clínico. |
| `tratamiento`| `TEXT` | Variable | - | **NO** | Ninguno | Texto no vacío | Conducta clínica, indicaciones farmacológicas y recetas. |
| `created_at`| `TIMESTAMP`| 8 bytes | - | **NO** | `CURRENT_TIMESTAMP`| Marcas de tiempo válidas | Registro de auditoría temporal inmutable. |

---

## 3. Dimensionamiento y Estimación de Volumetría

### 3.1. Estimación del Tamaño Promedio por Fila (Bytes por Registro)

| Tabla | Tamaño Fila Promedio (Bytes) | Justificación de Cálculo |
| :--- | :---: | :--- |
| `pacientes` | $\approx 220\text{ bytes}$ | id (10B) + nombre (40B) + edad (4B) + telefono (12B) + direccion (80B) + created_at (8B) + header tupla (66B) |
| `medicos` | $\approx 200\text{ bytes}$ | id (10B) + nombre (40B) + edad (4B) + telefono (12B) + especialidad (30B) + activo (1B) + created_at (8B) + header (95B) |
| `historias_clinicas` | $\approx 64\text{ bytes}$ | id (8B) + paciente_id (10B) + fecha_creacion (4B) + created_at (8B) + header tupla (34B) |
| `citas` | $\approx 180\text{ bytes}$ | id (8B) + paciente_id (10B) + medico_id (10B) + fecha_hora (8B) + estado (10B) + motivo (80B) + created_at (8B) + header (46B) |
| `registros_consulta` | $\approx 650\text{ bytes}$ | id (8B) + historia_id (8B) + cita_id (8B) + medico_id (10B) + fecha_hora (8B) + diagnostico (250B) + tratamiento (300B) + created_at (8B) + header (50B) |

---

### 3.2. Proyección de Crecimiento a 12 Meses (Operación Clínica Típica)

* **Supuestos de Crecimiento Operativo:**
  * Pacientes registrados: $5,000\text{ usuarios}$
  * Médicos en catálogo: $30\text{ facultativos}$
  * Historias clínicas ($1:1$): $5,000\text{ expedientes}$
  * Citas agendadas por año: $25,000\text{ turnos}$ (promedio 100 citas/día laborable)
  * Registros de consulta por año: $20,000\text{ atenciones efectivas}$ (80% asistencia)

| Tabla | Registros Estimados (1 Año) | Almacenamiento Datos | Overhead Índices B-Tree (40%) | Subtotal Estimado |
| :--- | :---: | :---: | :---: | :---: |
| `pacientes` | 5,000 | 1.10 MB | 0.44 MB | **1.54 MB** |
| `medicos` | 30 | 0.01 MB | 0.01 MB | **0.02 MB** |
| `historias_clinicas` | 5,000 | 0.32 MB | 0.13 MB | **0.45 MB** |
| `citas` | 25,000 | 4.50 MB | 1.80 MB | **6.30 MB** |
| `registros_consulta` | 20,000 | 13.00 MB | 5.20 MB | **18.20 MB** |
| **TOTAL CONSOLIDADO** | **55,030** | **18.93 MB** | **7.58 MB** | **$\approx 26.51\text{ MB}$** |

---

### 3.3. Recomendación de Infraestructura y Servidor

* **Almacenamiento Físico en Disco:** Un disco SSD o NVMe estándar de 20 GB es más que suficiente para almacenar datos, backups periódicos (WALs) y logs transaccionales durante los primeros 3 años de vida del software.
* **Memoria RAM Mínima del SGBD:** Al ser un volumen de trabajo compacto ($\approx 26.5\text{ MB}$ en el primer año), todo el dataset activo puede residir en memoria RAM (`shared_buffers = 256MB` a `512MB`), lo cual garantiza que el **99.9% de las consultas se resuelvan directamente en caché**, alcanzando tiempos de respuesta inferiores a $5\text{ ms}$ en la capa de persistencia.
