# INFORME DE DESARROLLO Y CUMPLIMIENTO DE POLÍTICAS DE CALIDAD
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Fecha del Informe:** 2026-10-26  
**Versión de Entrega:** v0.4.0 (Hito de Finalización: Fase 4 - Base de Datos y Persistencia)  
**Elaborado por:** Equipo de Ingeniería (Fabián Trujillo & Alexandra Garzón)  
**Estado de Conformidad:**  **CONFORME / APROBADO PARA FASE 5**

---

## 1. Resumen Ejecutivo

El presente informe certifica el estado del desarrollo técnico, la calidad de los artefactos producidos y el cumplimiento estricto del ciclo de vida del software para el **Sistema de Gestión de Clínica Médica (SGCM)** en su versión de Producto Mínimo Viable (MVP).

A la fecha se han completado al 100% las **primeras 4 fases** del proyecto:
1. **Fase 1 (Historias de Usuario):** 10 HUs estructuradas en 4 épicas con criterios Gherkin y priorizadas bajo MoSCoW.
2. **Fase 2 (Requisitos ERS):** Especificación IEEE 830 V6 formal y Matriz de Trazabilidad $1:1$ con 8 Reglas de Negocio (RN-01 a RN-08).
3. **Fase 3 (Modelado UML):** Diagramas vectoriales de casos de uso general y modular, clases de dominio, secuencia y actividades con swimlanes.
4. **Fase 4 (Base de Datos):** Modelo conceptual (MER) y relacional (Crow's Foot) en SVG, normalización formal 3FN, scripts DDL (`schema.sql`), DML (`data.sql`), vistas (`views.sql`), triggers (`triggers.sql`) y batería de pruebas DQL (`queries.sql`), organizados en `documentation/`, `scripts/` y `diagrams/`.

---

## 2. Matriz de Trazabilidad de Requerimientos

| Requisito | Descripción | Historia Asociada | Caso de Uso | Estado de Implementación en BD |
| :--- | :--- | :---: | :---: | :---: |
| **RF-01** | Registro de Pacientes (validación teléfono $\ge 7$) | HU-01 | CU-01 |  Implementado (`pacientes`, `chk_pacientes_telefono_valido`) |
| **RF-02** | Consulta de Pacientes registrados | HU-02 | CU-02 |  Implementado (Índice y consulta DQL optimizada) |
| **RF-03** | Actualización de datos de contacto de Pacientes | HU-03 | CU-03 |  Implementado (Soporte DDL para update por PK) |
| **RF-04** | Registro de Médicos (edad 18-99 años, RN-05) | HU-04 | CU-04 |  Implementado (`medicos`, `chk_medicos_edad_laboral`) |
| **RF-05** | Consulta de Médicos activos por especialidad | HU-05 | CU-05 |  Implementado (`idx_medicos_especialidad_activo`) |
| **RF-06** | Baja médica lógica condicionada (RN-01, RN-08) | HU-06 | CU-06 |  Implementado (`activo = FALSE`, `ON DELETE RESTRICT`) |
| **RF-07** | Agendamiento de Citas sin colisión horaria (RN-02) | HU-07 | CU-07 |  Implementado (`uq_citas_medico_fecha_hora`) |
| **RF-08** | Cancelación oportuna de citas agendadas | HU-08 | CU-08 |  Implementado (`chk_citas_estado_valido`) |
| **RF-09** | Registro de diagnóstico y atención (RN-06) | HU-09 | CU-09 |  Implementado (`registros_consulta` + Trigger RN-06) |
| **RF-10** | Consulta cronológica de historia clínica | HU-10 | CU-10 |  Implementado (`idx_registros_historia_fecha`) |

---

## 3. Auditoría de Calidad y Buenas Prácticas

| Criterio de Calidad | Evaluación | Evidencia / Justificación Técnica |
| :--- | :---: | :--- |
| **Normalización Relacional** | **Excelente (3FN)** | Se demostró formalmente en `05_normalizacion.md` la ausencia de dependencias parciales y transitivas, eliminando anomalías de inserción, actualización y borrado. |
| **Integridad Referencial** | **Excelente** | 6 claves foráneas protegidas con acciones `CASCADE` (para expedientes), `RESTRICT` (para protección de citas y facultativos) y `SET NULL`. |
| **Modularidad de Archivos** | **Excelente** | Todos los documentos cumplen con el límite blando (<800 líneas) y están organizados en subcarpetas temáticas (`documentation/`, `scripts/`, `diagrams/`). |
| **Control de Versiones** | **Excelente** | Adopción de Conventional Commits (`feat:`, `docs:`, `test:`, `refactor:`) y paridad exacta de contribución entre ambos autores. |
| **Seguridad de Datos** | **Excelente** | Cero contraseñas hardcodeadas; archivo `.gitignore` configurado; tablas auditadas con `created_at`. |

---

## 4. Reporte de Métricas de Persistencia y Testing

* **Total de Tablas Implementadas:** 5 tablas principales (`pacientes`, `medicos`, `historias_clinicas`, `citas`, `registros_consulta`).
* **Total de Restricciones Integradas:**
  * 5 Claves Primarias (`pk_*`).
  * 6 Claves Foráneas (`fk_*`).
  * 3 Restricciones de Unicidad (`uq_*`).
  * 8 Restricciones de Chequeo de Dominio (`chk_*`).
* **Métricas de Scripts de Prueba (`queries.sql`):**
  * **Casos de Consulta Feliz (Happy Path):** 10 casos evaluados y aprobados (100% de HU-01 a HU-10).
  * **Casos de Prueba Negativa (Restricciones):** 3 pruebas de violación forzada (colisión horaria, edad fuera de rango y borrado restringido) verificadas con rechazo exitoso por el motor.
* **Automatización Integrada:**
  * 2 Vistas optimizadas (`v_agenda_citas_recepcion`, `v_historial_medico_completo`).
  * 2 Triggers PL/pgSQL (Apertura automática de historia clínica $1:1$ y auto-transición de cita a `ATENDIDA`).

---

## 5. Declaración de Conformidad Institucional

El equipo certifica que los artefactos generados para las Fases 1, 2, 3 y 4 del **Sistema de Gestión de Clínica Médica (SGCM)** satisfacen todas las políticas de calidad, trazabilidad y estándares de ingeniería exigidos por el marco de trabajo. 

El proyecto se declara formalmente **LISTO Y APTO** para iniciar la **Fase 5 (Mockups / Prototipado UI en Stitch)** y posterior implementación en código fuente en la Fase 6.
