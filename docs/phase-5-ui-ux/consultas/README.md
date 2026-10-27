# 07. Módulo de Consultas y Búsquedas Avanzadas (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Consultas, Filtros y Búsquedas Avanzadas  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** HU-02, HU-05, HU-07, HU-08, HU-10 | RF-02, RF-07, RF-08, RF-10 | Consultas SQL de `scripts/queries.sql`  

---

## 📌 1. Propósito del Módulo

Facilitar la localización instantánea y filtrado avanzado de información clínica y administrativa. Permite a recepcionistas, médicos y administradores encontrar pacientes, verificar disponibilidad de agendas y consultar antecedentes sin fricciones operativas.

---

## 🔍 2. Componentes y Flujos de Consulta

### 2.1. Búsqueda Global Predictiva (Omnibar Search)
- **Activación:** Atajo universal `Ctrl + K` (Desktop) o icono de lupa destacado en Header (Mobile).
- **Comportamiento:**
  - Búsqueda en tiempo real con *debouncing* de 250ms para optimizar consultas.
  - Resultados clasificados por secciones:
    - *Pacientes:* Coincidencias por Cédula, Nombres, Apellidos y Teléfono.
    - *Médicos:* Coincidencias por Nombre y Especialidad.
    - *Citas:* Citas activas para la fecha actual.
  - Navegación con teclado (flechas arriba/abajo y Enter) para seleccionar sin usar mouse.

### 2.2. Consulta de Disponibilidad de Horarios y Franjas Médicas
- **Trazabilidad:** HU-07 | RN-02 (Prevención de traslape).
- **Componentes:**
  - Selector de Especialidad y Médico.
  - Calendario mensual con indicador visual de carga de turnos (días libres en verde, saturados en gris).
  - Grilla horaria de bloques de 30 minutos:
    - Bloque Verde (`Disponible`): Clic directo para agendar.
    - Bloque Gris Claro con candado (`Ocupado`): Muestra nombre de cita y box.
    - Bloque Rayado (`Bloqueo Administrativo / Descanso médico`).

### 2.3. Filtros Avanzados Multicriterio para Citas y Reportes
- **Criterios Combinables:**
  - Rango de fechas (Fecha inicio – Fecha fin).
  - Médico tratante o Especialidad médica.
  - Estado de la cita: `Agendada`, `En Espera`, `Atendida`, `Cancelada`.
  - Tipo de atención: `Presencial` o `Teleconsulta`.
- **Botones de Control:** "Aplicar Filtros" (Primary) y "Restablecer Filtros" (Ghost/Outline).

---

## 🖥️ 3. Especificación Desktop ($1440 \times 900$ px)

- **Layout de Panel Dividido (Sidebar de Filtros + Canvas de Resultados):**
  - Barra lateral izquierda colapsable (280px) con acordeones de filtros, selector de fecha tipo date-range picker, checkboxes y tags de selección.
  - Panel derecho amplio con contador dinámico ("*Se encontraron 42 citas para los filtros seleccionados*"), selector de ordenamiento y tabla de resultados con paginación.

---

## 📱 4. Especificación Mobile ($390 \times 844$ px)

- **Experiencia Móvil Táctil con Chips y Bottom Sheet:**
  - Fila superior de chips de filtro horizontal deslizable: `[Hoy] [Mañana] [Dr. Gómez] [En Espera]`.
  - Botón flotante "*Filtros (3)*" que despliega un **Bottom Sheet modal** que ocupa el 75% inferior de la pantalla para ajustar los criterios con selectores táctiles grandes.
  - Botón inferior fijo: "*Aplicar Filtros (Ver 12 Resultados)*".

---

## 📂 5. Directorios de Assets y Prototipos

- `desktop/`: Mockups de pantallas de búsqueda avanzada, grilla de disponibilidad y paneles de consulta.
- `mobile/`: Mockups de vistas móviles de búsqueda interactiva y filtros por bottom sheet.
