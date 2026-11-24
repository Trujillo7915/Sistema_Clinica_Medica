# 06. Módulo de Listados, Directorios y Control de Baja (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado de Alta Fidelidad  
**Módulo:** Listados Tabulares y Acciones Operativas  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** HU-02, HU-05, HU-06, HU-08 | RF-02, RF-05, RF-06, RF-08 | Reglas: RN-02, RN-03, RN-08 | Entidades BD: `pacientes`, `medicos`, `citas`  

---

## 📌 1. Propósito del Módulo

Definir los directorios maestros y tablas operativas de alta densidad para la consulta rápida, filtrado multicriterio y ejecución de acciones transaccionales seguras (Check-In, edición de paciente, cancelación justificada de citas y baja protegida de facultativos).

---

## 📑 2. Catálogo de Vistas de Listados

### 2.1. Directorio Maestro de Pacientes (HU-02)
- **Trazabilidad:** `HU-02` | `RF-02` (`RF-02.1`, `RF-02.2`) | Tabla BD: `pacientes`.
- **Estructura Tabular:**
  - Columnas: ID / Documento, Paciente & Contacto, Edad / Sexo / RH, Dirección, Aseguradora (EPS), Alerta de Alergias, Acciones Clínicas.
  - Estado Vacío (`RF-02.2`): Muestra el mensaje oficial *"No hay registros de pacientes disponibles"*.
  - Acciones por Fila: Abrir Expediente Clínico (`HU-10`) y Editar Ficha (`HU-03`).

### 2.2. Cuerpo Médico y Control de Baja (HU-05 & HU-06 / RN-08)
- **Trazabilidad:** `HU-05`, `HU-06` | `RF-05`, `RF-06` (`RF-06.1`, `RF-06.2`, `RF-06.3`) | Regla: **`RN-08`** | Tabla BD: `medicos`.
- **Estructura Tabular:**
  - Columnas: ID / Registro Profesional, Facultativo & Contacto, Edad Laboral (`RN-05`), Especialidad, Consultorio & Turno, Contador de Citas Activas (`AGENDADA`), Acciones (`HU-05` / `HU-06`).
  - **Control de Baja Médica (`HU-06` / `RN-08`):** Incluye el botón **"Dar de Baja (HU-06)"** conectado al modal de verificación de integridad de agenda. Si el médico posee citas futuras en estado `AGENDADA`, el sistema bloquea la baja (`RF-06.2`) listando las citas que deben reasignarse o cancelarse primero; si tiene `0` citas pendientes (`RF-06.1`), procesa la baja de forma segura.

### 2.3. Agenda General de Citas Médicas (HU-08 / RN-03)
- **Trazabilidad:** `HU-08` | `RF-08` (`RF-08.1`, `RF-08.2`) | Regla: **`RN-03`** | Tabla BD: `citas`.
- **Estructura Tabular:**
  - Columnas: Cita ID, Fecha & Horario, Paciente, Facultativo & Box, Motivo / Auditoría de Cancelación, Estado Semántico (`Agendada`, `En Espera`, `En Consulta`, `Atendida`, `Cancelada`), Acciones Operativas.
  - Acciones Directas: **Check-In** inmediato a sala de espera, **Atender (HU-09)** y **Cancelar (RN-03)** con modal de motivo obligatorio que libera inmediatamente el bloque horario en la Matriz de Disponibilidad (`RN-02`).
