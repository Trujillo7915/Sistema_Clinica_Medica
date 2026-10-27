# REGISTRO Y CONTROL DE CAMBIOS (CHANGELOG)
## Sistema de Gestión de Clínica Médica (SGCM)

Todas las modificaciones notables de este proyecto se documentan en este archivo.  
El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y este proyecto se adhiere a [Semantic Versioning (SemVer)](https://semver.org/lang/es/).

---

## [Unreleased] - Fase 4 en Progreso
### Added
- Creación de documentación modular y paso a paso para la Fase 4 (Base de Datos):
  - Identificación de entidades (`1_identificar_entidades.md`).
  - Definición de atributos y tipos de datos (`2_definir_atributos.md`).
  - Definición de claves primarias e indexación (`3_definir_claves_primarias.md`).
  - Definición de relaciones y cardinalidades (`4_definir_relaciones.md`).
  - Proceso formal de normalización 1FN, 2FN y 3FN (`5_normalizacion.md`).
- Scripts SQL de persistencia: `schema.sql` (DDL) y `data.sql` (DML con datos de prueba).
- Diagramas vectoriales de alta fidelidad en SVG para el Modelo ER y el Modelo Lógico Relacional.
- Carpeta de gobernanza y normas de ingeniería `docs/standards/`:
  - `buenas-practicas.md`: Clean Code, principios SOLID, inmutabilidad y funciones atómicas.
  - `reglas-proyecto.md`: GitFlow, Conventional Commits, seguridad OWASP y testing AAA.
  - `manual-desarrollo.md`: Arquitectura en capas, guía de onboarding y metodología TDD.

---

## [0.3.0] - 2026-10-26 - Fase 3: Modelado UML
### Added
- Diagrama General de Casos de Uso consolidado (`Diagrama_General_Casos_Uso_SGCM.drawio.svg`).
- Diagramas de Casos de Uso por módulo (Pacientes, Médicos, Citas, Historia Clínica).
- Diagrama de Clases de Dominio (`Diagrama_Clases_Dominio_GCM.svg`) con jerarquía de herencia `Persona` y composición de historia clínica.
- Diagrama de Secuencia para CU-07 Agendar Cita (`Diagrama_Secuencia_AgendarCita_GCM.svg`).
- Diagrama de Actividades con swimlanes para CU-07 (`Diagrama_Actividades_AgendarCita_GCM.svg`).
- Documento maestro de especificación UML en `docs/phase-3-uml/README.md`.

---

## [0.2.0] - 2026-10-20 - Fase 2: Requerimientos y Trazabilidad
### Added
- Especificación formal de Requisitos de Software bajo estándar IEEE Std 830-1998 (`ERS_SGCM_IEEE830_V6.docx` y `.pdf`).
- Matriz de Trazabilidad bidireccional (`Trazabilida_Matriz.MD`) que vincula Historias de Usuario, Requisitos Funcionales y Casos de Uso.
- Formalización de 8 Reglas de Negocio (RN-01 a RN-08).

---

## [0.1.0] - 2026-09-21 - Fase 1: Historias de Usuario y MoSCoW
### Added
- Catálogo de 10 Historias de Usuario (HU-01 a HU-10) en formato Gherkin (Dado-Cuando-Entonces).
- Clasificación de prioridades bajo metodología MoSCoW (7 Must Have, 2 Should Have, 1 Could Have).
- Definición de 4 épicas funcionales: Gestión de Pacientes, Gestión de Médicos, Gestión de Citas e Historia Clínica.
