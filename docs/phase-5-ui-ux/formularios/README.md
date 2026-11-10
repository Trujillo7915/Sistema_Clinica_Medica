# 05. Módulo de Formularios de Negocio (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Formularios Transaccionales y de Registro  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** HU-01, HU-04, HU-07, HU-09 | RF-01, RF-04, RF-07, RF-09 | Entidades BD: `pacientes`, `medicos`, `citas`, `consultas`  

---

## 📌 1. Propósito del Módulo

Establecer las directrices de diseño, ergonomía y validación para todos los formularios de captura del sistema. Los formularios garantizan integridad en el ingreso de datos clínicos, reducen la tasa de error por digitación y ofrecen retroalimentación instantánea.

---

## 📋 2. Catálogo de Formularios Implementados

### 2.1. HU-01: Registrar Paciente (Admisión)
- **Campos:** Tipo y número de documento, nombres, apellidos, fecha de nacimiento, sexo biológico, teléfono, email, dirección, seguro médico, contacto de emergencia.
- **Validaciones:** Cédula única obligatoria, cálculo automático de edad, formato de teléfono válido.
- **Vistas:**
  - Desktop: [hu_01_registrar_paciente_desktop.png](./desktop/hu_01_registrar_paciente_desktop.png)
  - Mobile: [hu_01_registrar_paciente_mobile.png](./mobile/hu_01_registrar_paciente_mobile.png)

### 2.2. HU-04: Registrar Médico (Alta Profesional)
- **Campos:** Nombres, apellidos, número de colegiado/registro médico, especialidad médica, teléfono, correo institucional, box de atención, horario de turnos.
- **Validaciones:** Cédula profesional no duplicada, selección obligatoria de especialidad y box.
- **Vistas:**
  - Desktop: [hu_04_registrar_medico_desktop.png](./desktop/hu_04_registrar_medico_desktop.png)
  - Mobile: [hu_04_registrar_medico_mobile.png](./mobile/hu_04_registrar_medico_mobile.png)

### 2.3. HU-07: Agendar Cita Médica (Agenda y Cupos)
- **Campos:** Búsqueda predictiva de paciente, selección de especialidad y médico tratante, selector de fecha, grilla interactiva de franjas horarias (slots de 30 min), motivo de consulta.
- **Validaciones:** Regla RN-02 (prevención de solapamiento de horarios), no doble cita para el mismo paciente en el mismo día.
- **Vistas:**
  - Desktop: [hu_07_agendar_cita_desktop.png](./desktop/hu_07_agendar_cita_desktop.png)
  - Mobile: [hu_07_agendar_cita_mobile.png](./mobile/hu_07_agendar_cita_mobile.png)

### 2.4. HU-09: Registrar Diagnóstico y Tratamiento (Consulta Clínica)
- **Campos:** Signos vitales (PA, FC, Temp, SatO2, Peso/Talla), motivo de consulta detallado, anamnesis, exploración física, diagnóstico principal (CIE-10), plan terapéutico, prescripción farmacológica, indicaciones.
- **Validaciones:** Solo médicos autorizados, cita en estado activa/en espera, campos clínicos mandatorios.
- **Vistas:**
  - Desktop: [hu_09_registrar_diagnostico_y_tratamiento_desktop.png](./desktop/hu_09_registrar_diagnostico_y_tratamiento_desktop.png)
  - Mobile: [hu_09_registrar_diagnostico_y_tratamiento_mobile.png](./mobile/hu_09_registrar_diagnostico_y_tratamiento_mobile.png)

---

## 📂 3. Directorios de Assets

- `desktop/`: 4 mockups en alta fidelidad para pantallas de escritorio ($1440 \times 900$).
- `mobile/`: 4 mockups responsivos optimizados para vista móvil vertical ($390 \times 844$).
