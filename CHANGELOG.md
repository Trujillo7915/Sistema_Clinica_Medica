# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto se adhiere a [Semantic Versioning](https://semver.org/lang/es/).

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
