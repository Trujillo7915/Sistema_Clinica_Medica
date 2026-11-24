# 01. Estructura de Navegación y Arquitectura de Información (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Estructura de Navegación  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** Precondición transversal de navegación para CU-01 a CU-10 | RBAC (Recepción, Médico, Admin) | ERS V6 Sección 3.1  

---

## 📌 1. Propósito del Módulo

Definir la arquitectura de navegación, jerarquía espacial y patrones de interacción del **Sistema de Gestión de Clínica Médica (SGCM)**. El objetivo es minimizar la carga cognitiva del usuario, permitiendo acceder a cualquier función clínica o administrativa en un máximo de **2 clics en Desktop** o **2 toques en Mobile**.

---

## 🗺️ 2. Mapa de Navegación y Flujo de Interacción

```mermaid
flowchart TD
    Login["03. Login / Autenticación Institucional"] --> AuthCheck{"Validación RBAC"}
    
    AuthCheck -->|Rol: Recepcionista| NavRecep["Árbol Recepción"]
    AuthCheck -->|Rol: Médico| NavMed["Árbol Médico"]
    AuthCheck -->|Rol: Administrador| NavAdmin["Árbol Administrador"]

    subgraph NavRecep ["Navegación Recepción"]
        R_Home["02. Pantalla de Inicio / Bienvenida"]
        R_Dash["04. Dashboard Recepción (Sala de Espera)"]
        R_FormPac["05. Formulario: Registrar Paciente (HU-01)"]
        R_FormCita["05. Formulario: Agendar Cita (HU-07)"]
        R_ListPac["06. Listado: Directorio de Pacientes (HU-02)"]
        R_ListCitas["06. Listado: Citas del Día (HU-08)"]
        R_Search["07. Consultas: Búsqueda y Disponibilidad"]
        R_DetPac["08. Detalle: Ficha de Paciente"]
    end

    subgraph NavMed ["Navegación Médica"]
        M_Home["02. Pantalla de Inicio"]
        M_Dash["04. Dashboard Box Médico (Pacientes en Espera)"]
        M_FormDiag["05. Formulario: Atención Médica (HU-09)"]
        M_ListHist["06. Listado: Historial de Consultas"]
        M_Search["07. Consultas: Búsqueda de Expediente"]
        M_DetExp["08. Detalle: Expediente Clínico Completo (HU-10)"]
    end

    subgraph NavAdmin ["Navegación Administración"]
        A_Home["02. Pantalla de Inicio"]
        A_Dash["04. Dashboard Gerencial / Ocupación"]
        A_FormMed["05. Formulario: Registrar Médico (HU-04)"]
        A_ListMed["06. Listado: Directorio Médico (HU-05)"]
        A_ListRep["06. Listados: Reportes de Operación"]
        A_Search["07. Consultas: Auditoría y Estadísticas"]
    end

    NavRecep --> Feedback["09. Mensajes de Confirmación, Error y Modales"]
    NavMed --> Feedback
    NavAdmin --> Feedback
```

---

## 🖥️ 3. Especificación Desktop ($1440 \times 900$ px)

### Componentes Principales:
1. **Sidebar Lateral Izquierda (240px de ancho fijo):**
   - Logotipo institucional **CliniGest** con isotipo médico en Primary `#002C3A`.
   - Menú de navegación agrupado por secciones:
     - *Principal:* Inicio, Dashboard.
     - *Gestión Asistencial:* Citas, Pacientes, Consultas Médicas.
     - *Administración:* Médicos, Boxes, Configuración.
   - Indicador de estado activo con píldora redondeada en `#0D5C75` y texto en alto contraste `#FFFFFF`.
   - Botón inferior de colapso rápido (modo icono de 68px de ancho) para maximizar área de trabajo en registros extensos.
2. **Top Header Bar (64px de alto):**
   - Breadcrumbs dinámicos (ej: *Inicio > Pacientes > Ficha PAC-1020029712*).
   - Buscador global integrado con atajo de teclado (`Ctrl + K`).
   - Selector de sede/sucursal médica.
   - Centro de notificaciones con badge de alertas clínicas pendientes.
   - Widget de perfil con avatar, nombre, rol asistencial y menú desplegable para cierre de sesión seguro.
3. **Canvas de Trabajo Principal:**
   - Contenedor fluido con ancho máximo de 1440px y espaciado lateral de 32px (`p-8`).

---

## 📱 4. Especificación Mobile ($390 \times 844$ px)

### Componentes Principales:
1. **Top App Bar (56px de alto):**
   - Botón de menú hamburguesa (despliega Drawer lateral para opciones secundarias y cierre de sesión).
   - Logotipo CliniGest simplificado (isotipo + texto 18px).
   - Botón de búsqueda rápida y botón de notificaciones.
2. **Bottom Navigation Bar (64px de alto con padding inferior seguro para iPhone/Android):**
   - 4 accesos directos principales con etiqueta e icono Material Symbols (24px):
     1. **Inicio** (`home`)
     2. **Agenda** (`calendar_today`)
     3. **Pacientes** (`group`)
     4. **Mi Turno / Box** (`medical_services` / `person`)
   - Área táctil de cada ítem de mínimo $48 \times 48$ px para cumplimiento WCAG AA.
3. **Navigation Drawer Deslizable:**
   - Muestra el perfil completo, cambio de sede, directorio médico, manual de ayuda y botón rojo para cerrar sesión.

---

## 📂 5. Directorios de Assets y Prototipos

- `desktop/`: Almacena diagramas de estructura, capturas y mockups de navegación para pantallas de escritorio.
- `mobile/`: Almacena diagramas de flujos táctiles, vistas de Bottom Navigation y Drawer para móviles.
