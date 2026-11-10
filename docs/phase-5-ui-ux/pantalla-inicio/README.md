# 02. Pantalla de Inicio / Portal de Bienvenida (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Pantalla de Inicio (Home / Portal de Bienvenida)  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** Punto de entrada post-autenticación para todos los roles asistenciales y administrativos.  

---

## 📌 1. Propósito del Módulo

Proporcionar una pantalla de aterrizaje personalizada, limpia y operativa inmediatamente después del inicio de sesión. Esta pantalla ofrece al profesional una visión sintética de su jornada asistencial, minimizando el tiempo para iniciar tareas críticas mediante accesos directos (*Quick Actions*).

---

## 🎨 2. Elementos Principales de Interfaz

1. **Header de Bienvenida Contextual:**
   - Saludo dinámico según la hora del día ("*Buenos días, Dr. Roberto Gómez*").
   - Rol visible con badge semántico (ej. `Médico Especialista - Cardiología - Box 03`).
   - Fecha y hora clínica en tiempo real sincronizada con el servidor.
2. **Banda de Métricas Rápidas de la Jornada (KPI Cards):**
   - **Citas Programadas Hoy:** Contador numérico de consultas asignadas.
   - **Pacientes en Sala de Espera:** Pacientes que ya hicieron check-in en recepción.
   - **Consultas Atendidas:** Progreso de la jornada asistencial.
   - **Tasa de Puntualidad / Tiempo Promedio:** Indicador de flujo operativo.
3. **Acciones Rápidas (Quick Action Buttons):**
   - Botón Primario: **Agendar Nueva Cita** (abre modal/formulario HU-07).
   - Botón Secundario: **Registrar Paciente** (abre formulario de admisión HU-01).
   - Botón Terciario: **Llamar Siguiente Paciente** (activa consulta para el box actual).
4. **Tablón de Comunicados y Avisos Internos:**
   - Avisos administrativos, protocolos sanitarios vigentes o notas de mantenimiento de boxes.

---

## 🖥️ 3. Especificación Desktop ($1440 \times 900$ px)

- **Distribución en Cuadrícula (Grid Layout):**
  - Fila superior: Banner hero de bienvenida con fondo suave Slate-100 y degradado hacia Primary `#002C3A`.
  - Fila intermedia: 4 tarjetas de métricas en columnas iguales (`grid-cols-4`).
  - Fila inferior (dividida 8 / 4 columnas):
    - Columna izquierda (66%): Agenda prioritaria del día con tabla interactiva de las próximas 5 citas.
    - Columna derecha (33%): Panel de accesos directos rápidos y tablón de anuncios clínicos.

---

## 📱 4. Especificación Mobile ($390 \times 844$ px)

- **Distribución en Columna Única (Vertical Stack):**
  - Header compacto con avatar y saludo conciso ("*Hola, Dr. Gómez*").
  - Carrusel horizontal deslizable (*swipeable cards*) con las 3 métricas esenciales del día.
  - Botón de acción principal destacado en ancho completo (`w-full`, altura 48px): "*Llamar Próximo Paciente*".
  - Lista vertical con tarjetas simplificadas de los próximos 3 pacientes citados.

---

## 📂 5. Directorios de Assets y Prototipos

- `desktop/`: Mockups en alta resolución para estaciones médicas y pantallas de recepción.
- `mobile/`: Mockups para dispositivos móviles y smartphones de ronda médica.
