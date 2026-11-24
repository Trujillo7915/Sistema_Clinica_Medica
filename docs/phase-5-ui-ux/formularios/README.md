# 05. Módulo de Formularios de Negocio (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado de Alta Fidelidad  
**Módulo:** Formularios Transaccionales y de Registro  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** HU-01, HU-03, HU-04, HU-07, HU-09 | RF-01, RF-03, RF-04, RF-07, RF-09 | Reglas: RN-01 a RN-07 | Entidades BD: `pacientes`, `medicos`, `citas`, `historias_clinicas`, `registros_consulta`  

---

## 📌 1. Propósito del Módulo

Establecer las directrices de diseño, ergonomía y validación en tiempo real para todos los formularios de captura del sistema. Los formularios garantizan integridad 1:1 con el esquema relacional PostgreSQL (Fase 4), reducen la tasa de error por digitación y ofrecen retroalimentación instantánea.

---

## 📋 2. Catálogo de Formularios Implementados

### 2.1. HU-01 & HU-03: Admisión y Actualización de Paciente
- **Campos:** Tipo y número de documento (`RN-01` inmutable en edición), fecha de nacimiento con cálculo automático de **edad (`0..125` años)**, nombres y apellidos obligatorios (`RF-01.3`), sexo biológico, grupo sanguíneo/RH, teléfono móvil, correo electrónico, aseguradora/EPS, dirección obligatoria (`RF-01.1`), contacto de emergencia y alergias críticas.
- **Validaciones:** Unicidad documental (`RN-01`), teléfono numérico de mínimo 7 dígitos sin letras (`RN-04` / `RF-01.2`), apertura automática 1:1 de `historias_clinicas`.
- **Vistas:**
  - Desktop: [hu_01_registrar_paciente_desktop.png](./desktop/hu_01_registrar_paciente_desktop.png) | [hu_03_actualizar_paciente_desktop.png](./desktop/hu_03_actualizar_paciente_desktop.png)
  - Mobile: [hu_01_registrar_paciente_mobile.png](./mobile/hu_01_registrar_paciente_mobile.png) | [hu_03_actualizar_paciente_mobile.png](./mobile/hu_03_actualizar_paciente_mobile.png)

### 2.2. HU-04: Alta de Facultativo / Médico
- **Campos:** Nombres, apellidos, documento/cédula, **edad laboral (`18 a 99 años`)**, número de registro médico profesional (`RM-XXXXXX-BOG`), especialidad médica (`Cardiología`, `Medicina General`, `Neurología`, `Pediatría`, `Dermatología`), consultorio asignado (`Box 01` a `Box 05`), turno asistencial, correo institucional y teléfono móvil.
- **Validaciones:** Registro médico único (`RN-01`), **rango de edad laboral estricta entre 18 y 99 años (`RN-05` / `RF-04.2`)**, especialidad obligatoria (`RF-04.3`) y teléfono numérico $\ge 7$ dígitos (`RN-04`).
- **Vistas:**
  - Desktop: [hu_04_registrar_medico_desktop.png](./desktop/hu_04_registrar_medico_desktop.png)
  - Mobile: [hu_04_registrar_medico_mobile.png](./mobile/hu_04_registrar_medico_mobile.png)

### 2.3. HU-07: Agendar Cita Médica (Sincronización en Vivo RN-02)
- **Campos:** Selector de paciente registrado (`RF-07.2`), selector de médico y especialidad (`RF-07.2`), fecha de cita (`RF-07.3`), selector dinámico de franjas de 30 minutos sincronizado en tiempo real con la Matriz de Disponibilidad (`RN-02`), modalidad y motivo clínico.
- **Validaciones:** Regla crítica **`RN-02` (`RF-07.4`)** que bloquea automáticamente cualquier intento de sobreagendar al mismo médico o paciente en el mismo bloque horario.
- **Vistas:**
  - Desktop: [hu_07_agendar_cita_desktop.png](./desktop/hu_07_agendar_cita_desktop.png)
  - Mobile: [hu_07_agendar_cita_mobile.png](./mobile/hu_07_agendar_cita_mobile.png)

### 2.4. HU-09: Atención Clínica, Diagnóstico y Tratamiento
- **Campos:** Selector de cita activa vinculada y médico tratante, banner de alergias críticas en rojo, signos vitales (PA, FC, Temp, SatO2, Peso, Talla), anamnesis, exploración física, buscador rápido del catálogo **CIE-10** (código + descripción obligatoria `RF-09.1`), plan terapéutico y prescripción farmacológica (fórmula médica).
- **Validaciones:** Transición automática del estado de la cita vinculada a **`ATENDIDA` (`RN-06`)** y registro cronológico inmutable en el expediente del paciente (`RN-07`).
- **Vistas:**
  - Desktop: [hu_09_registrar_diagnostico_y_tratamiento_desktop.png](./desktop/hu_09_registrar_diagnostico_y_tratamiento_desktop.png)
  - Mobile: [hu_09_registrar_diagnostico_y_tratamiento_mobile.png](./mobile/hu_09_registrar_diagnostico_y_tratamiento_mobile.png)
