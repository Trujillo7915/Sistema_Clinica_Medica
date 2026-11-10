# 06. Módulo de Listados y Tablas de Datos (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Listados y Vistas Tabulares  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** HU-02, HU-05, HU-08 | RF-02, RF-05, RF-08 | Entidades BD: `pacientes`, `medicos`, `citas`  

---

## 📌 1. Propósito del Módulo

Definir los componentes visuales de visualización masiva de datos (tablas clínicas y directorios de información). Diseñados para una lectura rápida, escaneo eficiente y manipulación ágil mediante ordenamiento, filtros rápidos y paginación ergonómica.

---

## 📑 2. Catálogo de Vistas de Listados

### 2.1. Listado Maestro de Pacientes (HU-02)
- **Trazabilidad:** HU-02 | RF-02 | Entidad BD: `pacientes`.
- **Estructura Tabular:**
  - Columnas: Cédula/Identificador, Nombre Completo del Paciente, Edad/Sexo, Teléfono de Contacto, Seguro/EPS, Última Consulta, Acciones Rápidas.
  - Acciones por Fila: Ver Ficha Integral, Agendar Cita Directa, Modificar Datos.
  - Herramientas Superiores: Barra de búsqueda reactiva por cédula o apellido, filtro por tipo de seguro y botón primario "+ Registrar Paciente".

### 2.2. Listado y Directorio Médico (HU-05)
- **Trazabilidad:** HU-05 | RF-05 | Entidad BD: `medicos`.
- **Estructura Tabular:**
  - Columnas: Registro Profesional, Nombre del Especialista, Especialidad Médica, Box Asignado, Teléfono/Email, Citas Programadas Hoy, Estado Operativo (Activo/En Pausa).
  - Acciones por Fila: Ver Agenda del Médico, Asignar Box, Editar Perfil.

### 2.3. Listado de Citas y Agenda Diaria (HU-08)
- **Trazabilidad:** HU-08 | RF-08 | Entidad BD: `citas`.
- **Estructura Tabular:**
  - Columnas: Hora Pactada, Paciente, Cédula, Médico Tratante, Especialidad, Box, Estado (`Agendada`, `En Espera`, `Atendida`, `Cancelada`), Acciones.
  - Badges de Estado Semánticos:
    - `Agendada`: Azul suave (`#0369A1` / `#E0F2FE`).
    - `En Espera`: Ámbar (`#D97706` / `#FEF3C7`).
    - `Atendida`: Verde esmeralda (`#047857` / `#D1FAE5`).
    - `Cancelada`: Rojo tenue (`#DC2626` / `#FEE2E2`).
  - Acciones Directas: Check-in inmediato (cambia a `En Espera`), Marcar atención, Cancelar cita con modal justificativo.

---

## 🖥️ 3. Especificación Desktop ($1440 \times 900$ px)

- **Diseño de Tabla de Alta Densidad (High-Density Clinical Table):**
  - Filas alternadas sutiles (cebreado Slate-50) para prevenir saltos de línea al leer.
  - Altura de fila de 52px con padding equilibrado (`px-4 py-3`).
  - Cabecera fija (*sticky header*) con ordenamiento ascendente/descendente al hacer clic en columnas.
  - Pie de tabla con selector de filas por página (10, 25, 50, 100), contador total de registros y botones de paginación accesibles.
  - Botón de exportación rápida a formato Excel (.xlsx) y PDF clínico.

---

## 📱 4. Especificación Mobile ($390 \times 844$ px)

- **Diseño de Tarjetas Adaptativas (Card-Based List):**
  - Las tablas complejas se transforman automáticamente en una secuencia vertical de tarjetas clínicas.
  - Cada tarjeta condensa la información crítica en 3 niveles de texto visual.
  - Acciones rápidas accesibles mediante iconos táctiles de 44px o menú contextual de tres puntos (`more_vert`).
  - Barra de búsqueda superior fijada (*sticky top*) con botón de filtros que abre un panel deslizante inferior (*Bottom Sheet*).

---

## 📂 5. Directorios de Assets y Prototipos

- `desktop/`: Mockups de listados tabulares para monitores de alta resolución.
- `mobile/`: Mockups de vistas de tarjetas y listas optimizadas para pantallas táctiles.
