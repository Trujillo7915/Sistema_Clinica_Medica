# 04. Dashboards Operativos por Rol (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Dashboards (Recepción, Médico, Administración)  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** HU-07, HU-08, HU-09 | RF-08, RF-09 | Vistas SQL: `v_recepcion_sala_espera`, `v_historial_clinico_paciente`  

---

## 📌 1. Propósito del Módulo

Consolidar los centros de mando visuales y operativos especializados para cada rol del sistema, optimizando la visibilidad en tiempo real de los flujos de pacientes, la ocupación de consultorios y el estado de las citas clínicas.

---

## 📊 2. Tipos de Dashboards según Rol

### 2.1. Dashboard de Recepción (Flujo de Pacientes y Check-in)
- **Objetivo:** Controlar el ingreso, registro y derivación de pacientes a los consultorios.
- **Componentes:**
  - **Indicadores Rápidos (KPIs):** Citas del día, Pacientes en espera, Consultas atendidas, Cancelaciones.
  - **Tabla de Sala de Espera Activa:** Lista ordenada de pacientes en clínica, tiempo de espera acumulado (alerta ámbar si supera 20 min) y box asignado.
  - **Botón de Check-in Rápido:** Cambia el estado de la cita de `Agendada` a `En Espera` en un solo clic.

### 2.2. Dashboard Médico (Box de Consulta y Triaje)
- **Objetivo:** Gestionar la consulta actual y visualizar la fila de espera de pacientes citados.
- **Componentes:**
  - **Tarjeta de Paciente en Atención:** Foto/avatar, nombre completo, edad, motivo de consulta y botón destacado "**Iniciar Consulta / Registrar Atención (HU-09)**".
  - **Cola de Pacientes del Turno:** Lista secuencial con orden de llegada y hora pactada.
  - **Acceso Directo a Ficha Clínica:** Botón para consultar antecedentes antes de llamar al paciente.

### 2.3. Dashboard Administrativo y Gerencial
- **Objetivo:** Monitorear la capacidad operativa, volumen asistencial y cumplimiento de horarios.
- **Componentes:**
  - Gráfica de volumen de citas por especialidad (Cardiología, Pediatría, Medicina General).
  - Tasa de ocupación de consultorios físicos (Boxes 01 a 08).
  - Reporte de ausentismo / citas canceladas para optimización de cupos.

---

## 🖥️ 3. Especificación Desktop ($1440 \times 900$ px)

- **Estructura Modular Multicolumna:**
  - Cabecera con selector de fecha (Hoy, Mañana, Calendario) y filtro rápido por médico/box.
  - Panel superior de 4 tarjetas KPI con micro-gráficas de tendencia (*sparklines*).
  - Panel central con tabla interactiva de alta densidad:
    - Columnas: Hora, Paciente, Cédula, Médico, Especialidad, Box, Estado (Badge de color), Acciones (Check-in, Reasignar, Cancelar).
  - Panel lateral derecho con estadísticas de ocupación y alertas prioritarias.

---

## 📱 4. Especificación Mobile ($390 \times 844$ px)

- **Vista en Tarjetas Dinámicas (Card-based Layout):**
  - Segmentador superior deslizante: `[Todos] [En Espera (3)] [Atendidos (8)] [Próximos (5)]`.
  - Tarjetas de cita individuales con tipografía jerárquica clara:
    - Línea 1: Hora en negrita + Badge de estado (`En Espera`, `Atendida`, etc.).
    - Línea 2: Nombre del paciente y cédula.
    - Línea 3: Médico y número de box.
    - Botones de acción táctiles al pie de la tarjeta: `Confirmar Llegada` o `Ver Detalle`.

---

## 📂 5. Directorios de Assets y Prototipos

- `desktop/`: Mockups de los dashboards de Recepción, Médico y Administración para monitores clínicos.
- `mobile/`: Mockups optimizados para tablets de enfermería y teléfonos de médicos en ronda.
