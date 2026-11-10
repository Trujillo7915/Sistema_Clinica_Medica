# 08. Módulo de Detalle de Registros y Expediente Clínico (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Detalle de Registros y Ficha Clínica  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** HU-02, HU-08, HU-10 | RF-02, RF-08, RF-10 | Entidades BD: `expedientes_clinicos`, `consultas`, `recetas`, `pacientes`  

---

## 📌 1. Propósito del Módulo

Definir las pantallas de visualización exhaustiva de entidades clínicas y administrativas. Permite a los profesionales consultar el historial médico longitudinal del paciente, revisar diagnósticos previos, auditar estados de citas y generar documentos asistenciales con máxima claridad.

---

## 📋 2. Tipos de Vistas de Detalle

### 2.1. Ficha Integral y Perfil del Paciente
- **Cabecera de Identificación Rápida:**
  - Código único (`PAC-<cédula>`), Foto/Avatar, Nombre completo, Edad exacta, Sexo biológico, Teléfono, Correo, Tipo de seguro.
  - **Banner de Alerta Clínica Crítica:** Fondo rojo claro (`#FEE2E2`) con texto en rojo intenso (`#DC2626`) indicando *Alergias Conocidas* (ej. Penicilina, AINES) y *Condiciones Crónicas* (Hipertensión, Diabetes).
- **Pestañas de Navegación del Expediente:**
  - `Resumen General`: Antecedentes personales y familiares, hábitos tóxicos, cirugías previas.
  - `Consultas Anteriores`: Historial cronológico de atenciones con diagnósticos CIE-10.
  - `Tratamientos y Recetas`: Prescripciones vigentes e históricas.
  - `Citas`: Historial de citas pasadas y citas agendadas a futuro.

### 2.2. Detalle de Consulta Médica (HU-10)
- **Trazabilidad:** HU-10 | RF-10 | Entidad BD: `consultas`.
- **Bloques de Contenido:**
  - **Signos Vitales:** Presión Arterial, Frecuencia Cardíaca, Temperatura, Frecuencia Respiratoria, Saturación de Oxígeno, Peso, Talla e IMC calculado con indicador semántico (Normal / Sobrepeso / etc.).
  - **Anamnesis y Exploración:** Descripción del motivo de consulta, tiempo de evolución y hallazgos físicos relevantes.
  - **Diagnóstico:** Código y descripción CIE-10 (ej. `I10 - Hipertensión Esencial`).
  - **Prescripción Farmacológica (Receta):** Tabla con Medicamento, Dosis, Vía de administración, Frecuencia y Duración en días.
  - **Recomendaciones y Firma:** Indicaciones no farmacológicas, fecha de control y firma electrónica del médico tratante con número de colegiado.

### 2.3. Detalle de Cita Médica y Auditoría de Estados
- Cronología visual del ciclo de vida de la cita:
  - `1. Agendamiento`: Fecha, hora y recepcionista responsable.
  - `2. Check-in`: Hora de llegada a sala de espera.
  - `3. Atención`: Hora de ingreso a box y médico.
  - `4. Cierre`: Hora de finalización y expedición de receta.

---

## 🖥️ 3. Especificación Desktop ($1440 \times 900$ px)

- **Layout Modular de 3 Columnas:**
  - Columna Izquierda (25%): Tarjeta persistente del paciente (foto, datos demográficos, alergias en alerta, contacto de emergencia).
  - Columna Central (50%): Evolución médica actual, detalle de diagnósticos, signos vitales y prescripción.
  - Columna Derecha (25%): Línea de tiempo interactiva (*Timeline*) con todas las consultas previas para comparación rápida sin salir de la pantalla.
  - Barra de Acciones Superiores: Botones para "Imprimir Receta", "Exportar PDF de Ficha", "Nueva Consulta" y "Agendar Próximo Control".

---

## 📱 4. Especificación Mobile ($390 \times 844$ px)

- **Layout Vertical con Pestañas Deslizables (*Tabs*):**
  - Cabecera compacta con foto, nombre, edad y chip rojo de alertas.
  - Barra de pestañas horizontal deslizable (`Resumen` | `Historial` | `Recetas` | `Citas`).
  - Acordeones colapsables para signos vitales y exámenes físicos para facilitar la lectura sin exceso de scroll.
  - Botón de acción flotante (*FAB*) o barra inferior fija para imprimir receta o compartir por correo.

---

## 📂 5. Directorios de Assets y Prototipos

- `desktop/`: Mockups en alta resolución de la ficha integral del paciente, evolución médica e historial en desktop.
- `mobile/`: Mockups responsivos de la visualización de expedientes y recetas en dispositivos móviles.
