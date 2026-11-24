# GUÍAS DE INGENIERÍA, BUENAS PRÁCTICAS Y GOBERNANZA TÉCNICA (SGCM)
## Sistema de Gestión de Clínica Médica (SGCM)

Bienvenido a la sección de estándares de ingeniería de software y gobernanza técnica del proyecto. Este repositorio define las políticas obligatorias que rigen el diseño, desarrollo, pruebas, seguridad y versionamiento del software para todo el equipo.

---

## 📚 Estructura de Documentación

La carpeta `docs/standards/` contiene los siguientes manuales y normativas:

| Documento | Enlace | Propósito |
| :--- | :--- | :--- |
| **Buenas Prácticas de Código** | [**`buenas-practicas.md`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/standards/buenas-practicas.md) | Principios de diseño (Clean Code, SOLID, inmutabilidad, funciones atómicas, validación en bordes). |
| **Reglas del Proyecto & Calidad** | [**`reglas-proyecto.md`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/standards/reglas-proyecto.md) | Flujo Git, Conventional Commits, políticas de seguridad OWASP, cobertura de pruebas mínima (80%+). |
| **Manual de Desarrollo & Arquitectura** | [**`manual-desarrollo.md`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/standards/manual-desarrollo.md) | Arquitectura en capas, stack técnico, guía de instalación, onboarding y flujo TDD. |
| **Bitácora y Control de Cambios** | [**`control-cambios.md`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/standards/control-cambios.md) | Registro de versiones y cambios del proyecto bajo SemVer y formato Keep a Changelog. |

---

## 🎯 Pilares del Ciclo de Vida del Software (7 Puntos Mandatorios)

Todo módulo y servicio implementado en este sistema debe alinearse a los 7 puntos del ciclo de vida:
1. **Documentar requerimientos** (`docs/phase-1-user-story/`, `docs/phase-2-requirements/`).
2. **Diseñar modelo de datos y UML** (`docs/phase-3-uml/`, `docs/phase-4-bd/`).
3. **Desarrollar código limpio** cumpliendo SOLID, inmutabilidad y tipado estricto.
4. **Realizar testing automatizado** con patrón AAA y cobertura $\ge 80\%$.
5. **Elaborar informes de calidad y conformidad**.
6. **Mantener manuales técnicos y de usuario actualizados**.
7. **Gestionar la implementación y versionamiento** bajo SemVer.
