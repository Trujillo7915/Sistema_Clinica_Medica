# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [0.5.0] - 2026-10-27 - Fase 5: Diseño de Interfaz y Experiencia de Usuario (UI/UX)
### Added
- **Estructura completa de 9 módulos UI/UX en `docs/phase-5-ui-ux/`:**
  - `01. estructura-navegacion/`: Arquitectura de información, RBAC, Sidebar de alta densidad (Desktop) y Bottom Navigation Bar con Drawer (Mobile).
  - `02. pantalla-inicio/`: Portal de bienvenida, saludo dinámico por turno, KPI cards operativas y acciones rápidas.
  - `03. login/`: Acceso institucional seguro con control de roles (RBAC) y mockups en alta fidelidad desktop y mobile.
  - `04. dashboard/`: Cuadros de mando por rol (Recepción con sala de espera activa, Médico con box de consulta, Administración con ocupación).
  - `05. formularios/`: Formularios transaccionales de alta fidelidad para HU-01 (Pacientes), HU-04 (Médicos), HU-07 (Agendar Cita) y HU-09 (Atención Médica) en Desktop y Mobile.
  - `06. listados/`: Tablas de datos de alta densidad con paginación y ordenamiento para Pacientes (HU-02), Médicos (HU-05) y Citas (HU-08).
  - `07. consultas/`: Búsqueda global predictiva (`Ctrl + K`), filtros avanzados multicriterio y matriz de disponibilidad horaria sin solapamiento (RN-02).
  - `08. detalle-registros/`: Expediente clínico longitudinal, ficha del paciente con alertas de alergias críticas, evolución médica (HU-10) y formato de receta.
  - `09. mensajes-error-confirmacion/`: Modales de confirmación crítica (cancelación de cita RN-03), toasts flotantes semánticos, inline validation y pantallas 404/403/500.
- **Design System *Clinical Clarity*:** Paleta semántica (#002C3A, #016398, #F8FAFC), tipografías Plus Jakarta Sans / Inter y accesibilidad WCAG 2.1 AA.
- Documentación técnica y especificaciones completas en cada uno de los 9 módulos.

---

## [0.4.0] - 2026-10-26 - Fase 4: Diseño de Base de Datos y Persistencia
### Added
- **Estructura modular reorganizada:**
  - `docs/phase-4-bd/documentation/`: 11 documentos de especificación técnica paso a paso del `01_` al `11_` más el `diccionario_datos.md`.
  - `docs/phase-4-bd/scripts/`: Scripts ejecutables SQL (`schema.sql`, `data.sql`, `views.sql`, `triggers.sql`, `queries.sql`).
  - `docs/phase-4-bd/diagrams/`: Diagramas vectoriales SVG (`Modelo_Entidad_Relacion_SGCM.svg` y `Modelo_Logico_Relacional_SGCM.svg`).
- **Scripts de Persistencia:**
  - `schema.sql`: Esquema DDL con 5 tablas normalizadas en 3FN, índices B-Tree y restricciones nativas (`CHECK` y `UNIQUE`).
  - `data.sql`: Semillas DML realistas para pruebas funcionales.
  - `views.sql`: Vistas optimizadas para recepción (`v_agenda_citas_recepcion`) e historial médico (`v_historial_medico_completo`).
  - `triggers.sql`: Triggers automáticos para auto-crear historia clínica (1:1) y transición de cita a `ATENDIDA` (**RN-06**).
  - `queries.sql`: Batería de validación funcional DQL para las 10 Historias de Usuario y pruebas negativas de restricciones (**RN-01..RN-08**).
- **Gobernanza y Estándares de Ingeniería:**
  - `docs/standards/`: Creación de manuales de buenas prácticas, reglas del proyecto, manual de desarrollo y control de cambios.
  - `docs/reports/informe-desarrollo-calidad.md`: Informe formal de calidad y conformidad del ciclo de vida.
  - `.gitignore` y `LICENSE` (MIT) en la raíz del proyecto.

---

## [0.3.0] - 2026-10-26 - Fase 3: Modelado UML 2.5
### Added
- Diagramas de Casos de Uso vectoriales consolidado y por módulo en formato Draw.io SVG.
- Diagrama de Clases de Dominio (`Diagrama_Clases_Dominio_GCM.svg`) con jerarquía de herencia `Persona` y composición de historia clínica.
- Diagrama de Secuencia (`Diagrama_Secuencia_AgendarCita_GCM.svg`) para CU-07.
- Diagrama de Actividades con swimlanes (`Diagrama_Actividades_AgendarCita_GCM.svg`) para el flujo web de agendamiento.
- Especificación técnica UML en `docs/phase-3-uml/README.md`.

---

## [0.2.0] - 2026-10-20 - Fase 2: Requerimientos y Trazabilidad
### Added
- Especificación formal de Requisitos de Software bajo estándar IEEE Std 830-1998 (`ERS_SGCM_IEEE830_V6.docx` y `.pdf`).
- Matriz de Trazabilidad bidireccional (`Trazabilida_Matriz.MD`) que vincula Historias de Usuario, Requisitos Funcionales y Casos de Uso.
- Catálogo de 8 Reglas de Negocio críticas (RN-01 a RN-08).

---

## [0.1.0] - 2026-09-21 - Fase 1: Historias de Usuario y MoSCoW
### Added
- Catálogo de 10 Historias de Usuario (HU-01 a HU-10) en formato Gherkin (Dado-Cuando-Entonces).
- Priorización formal bajo metodología MoSCoW (7 Must Have, 2 Should Have, 1 Could Have).
- 4 épicas funcionales: Gestión de Pacientes, Gestión de Médicos, Gestión de Citas e Historia Clínica.
