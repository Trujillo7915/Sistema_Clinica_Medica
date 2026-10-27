# 🏥 SISTEMA DE GESTIÓN DE CLÍNICA MÉDICA (SGCM - MVP)

> **Estado Actual del Proyecto:** Fase 4 (Base de Datos y Persistencia) Culminada con Éxito  
> **Rama Activa de Desarrollo:** `dev`  
> **Autores:** Fabián Trujillo & Alexandra Garzón  
> **Estándares de Referencia:** IEEE Std 830-1998, UML 2.5, ANSI SQL / PostgreSQL 14+, Normalización 3FN, Clean Architecture & Conventional Commits.

---

## 📌 1. Visión General del Proyecto

El **Sistema de Gestión de Clínica Médica (SGCM)** es una solución integral de software diseñada para optimizar, centralizar y automatizar los flujos operativos y asistenciales de una institución de salud. Su alcance para la versión de Producto Mínimo Viable (MVP) cubre la gestión integral de pacientes, el catálogo de médicos facultativos, el agendamiento y control de colisiones en citas médicas, y el registro cronológico del expediente clínico.

El proyecto se desarrolla bajo un riguroso ciclo de vida de ingeniería de software dividido en **6 fases secuenciales con trazabilidad bidireccional completa**.

---

## 📍 2. ¿En qué Fase nos Encontramos?

Actualmente nos encontramos al **cierre exitoso de la FASE 4** y en transición hacia la **FASE 5 (Mockups y Prototipado)** y **FASE 6 (Implementación en Código)**:

```mermaid
flowchart LR
    F1[" Fase 1\nHistorias MoSCoW"] --> F2[" Fase 2\nERS IEEE 830"]
    F2 --> F3[" Fase 3\nModelado UML"]
    F3 --> F4[" Fase 4\nBase de Datos 3FN"]
    F4 --> F5["⏳ Fase 5\nMockups & UI"]
    F5 --> F6["⏳ Fase 6\nCódigo Funcional"]

    classDef done fill:#f0fdf4,stroke:#16a34a,stroke-width:2px,color:#166534,font-weight:bold;
    classDef current fill:#eff6ff,stroke:#2563eb,stroke-width:3px,color:#1e40af,font-weight:bold;
    classDef pending fill:#f8fafc,stroke:#94a3b8,stroke-width:2px,stroke-dasharray: 4 4,color:#64748b;

    class F1,F2,F3 done;
    class F4 current;
    class F5,F6 pending;
```

---

## 🚀 3. ¿Qué Hemos Aplicado y Cómo se ha Desarrollado?

A continuación se resume detalladamente el avance técnico acumulado por cada fase:

### 🔹 Fase 1: Historias de Usuario y Priorización MoSCoW
* **Ubicación:** [`docs/phase-1-user-story/historias_usuario_clinica.md`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-1-user-story/historias_usuario_clinica.md)
* **Qué se aplicó:**
  * Estructuración del sistema en **4 épicas de negocio**: Gestión de Pacientes, Gestión de Médicos, Gestión de Citas e Historia Clínica.
  * Definición de **10 Historias de Usuario (HU-01 a HU-10)** redactadas con criterios de aceptación verificables bajo el estándar **Gherkin** (*Dado - Cuando - Entonces*).
  * Priorización formal mediante metodología **MoSCoW**:
    * **Must Have (7):** HU-01, HU-02, HU-04, HU-05, HU-07 (Crítica), HU-09, HU-10.
    * **Should Have (2):** HU-03 (Actualizar paciente), HU-08 (Cancelar cita).
    * **Could Have (1):** HU-06 (Baja lógica de médico).

---

### 🔹 Fase 2: Requerimientos de Software (ERS) y Matriz de Trazabilidad
* **Ubicación:** [`docs/phase-2-requirements/`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-2-requirements/)
* **Qué se aplicó:**
  * Especificación formal de Requisitos bajo el estándar internacional **IEEE Std 830-1998** en versiones `.docx` y `.pdf`.
  * Catálogo de 10 Requisitos Funcionales (`RF-01` a `RF-10`) y Requisitos No Funcionales (seguridad, rendimiento, integridad).
  * **Matriz de Trazabilidad Bidireccional (`Trazabilida_Matriz.MD`):** Mapeo estricto $1:1$ entre Historias de Usuario, Requisitos Funcionales y Casos de Uso.
  * Formalización de **8 Reglas de Negocio Clave (RN-01 a RN-08)**:
    * `RN-02`: Prevención de colisiones de agenda médica (horario único por médico).
    * `RN-04`: Validación estricta de teléfono (mínimo 7 dígitos numéricos).
    * `RN-05`: Validación de edad laboral médica (18 a 99 años).
    * `RN-06`: Transición automática de estado de cita a `ATENDIDA` tras registrar diagnóstico.
    * `RN-08`: Bloqueo de baja médica si existen citas futuras agendadas.

---

### 🔹 Fase 3: Modelado Orientado a Objetos (UML 2.5)
* **Ubicación:** [`docs/phase-3-uml/`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-3-uml/)
* **Qué se aplicó:**
  * **Diagramas de Casos de Uso:** Modelo consolidado general y desglosado por módulo en gráficos vectoriales SVG interactivos.
  * **Diagrama de Clases de Dominio (`Diagrama_Clases_Dominio_GCM.svg`):**
    * Clase abstracta base `Persona`.
    * Subclases `Paciente` y `Medico` con herencia y métodos de validación propios.
    * Composición fuerte ($1:1$) entre `Paciente` e `HistoriaClinica`, y de esta última ($1:N$) hacia `RegistroConsulta`.
    * Asociación de servicio con `Cita` y enumerador de ciclo de vida `EstadoCita` (`AGENDADA`, `ATENDIDA`, `CANCELADA`).
  * **Diagrama de Secuencia (`Diagrama_Secuencia_AgendarCita_GCM.svg`):** Interacción temporal de CU-07 entre Boundary, Control, Entity y Database.
  * **Diagrama de Actividades (`Diagrama_Actividades_AgendarCita_GCM.svg`):** Flujo de trabajo con 4 carriles (*swimlanes*): Recepcionista, Frontend, Backend y Persistencia.

---

### 🔹 Fase 4: Diseño de Base de Datos y Persistencia (Recién Culminada)
* **Ubicación:** [`docs/phase-4-bd/`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/)
* **Qué se aplicó:**
  * **Punto 1 (Identificación de Entidades):** Clasificación de entidades fuertes (`pacientes`, `medicos`), débiles (`historias_clinicas`, `registros_consulta`) y transaccionales (`citas`).
  * **Punto 2 (Definición de Atributos):** Diccionario detallado de tipos SQL, nulabilidad (`NOT NULL`) y campos de auditoría inmutable (`created_at`).
  * **Punto 3 (Claves Primarias):** Combinación de claves de negocio naturales (`VARCHAR(20)` para cédulas) y claves subrogadas secuenciales (`BIGINT IDENTITY`).
  * **Punto 4 (Relaciones e Integridad Referencial):** Cardinalidades ($1:1$, $1:N$, $0..1:1$) y políticas de protección `ON DELETE CASCADE / RESTRICT / SET NULL`.
  * **Punto 5 (Normalización 3FN):** Descomposición rigurosa desde UNF pasando por 1FN y 2FN hasta 3FN, demostrando formalmente la eliminación de anomalías operativas.
  * **Diagramas Vectoriales en SVG:**
    * [`Modelo_Entidad_Relacion_SGCM.svg`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/diagrams/Modelo_Entidad_Relacion_SGCM.svg) (Conceptual).
    * [`Modelo_Logico_Relacional_SGCM.svg`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/diagrams/Modelo_Logico_Relacional_SGCM.svg) (Tablas relacionales con notación Crow's Foot).
  * **Scripts de Base de Datos:**
    * [`schema.sql`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/schema.sql): DDL con creación de tablas, índices de optimización B-Tree y restricciones `CHECK` / `UNIQUE`.
    * [`data.sql`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/data.sql): DML con semillas de prueba realistas cubriendo todos los casos de uso.

---

### 🔹 Gobernanza y Normas de Ingeniería de Software
* **Ubicación:** [`docs/standards/`](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/standards/)
* **Manuales creados:**
  * **`buenas-practicas.md`:** Clean Code, principios SOLID, inmutabilidad funcional obligatoria, funciones atómicas (<50 líneas) y tipado estricto.
  * **`reglas-proyecto.md`:** Flujo de ramas GitFlow, Conventional Commits, seguridad OWASP y testing AAA con cobertura mínima $\ge 80\%$.
  * **`manual-desarrollo.md`:** Arquitectura en capas limpia, guía de instalación y flujo TDD (*Red-Green-Refactor*).
  * **`control-cambios.md`:** Bitácora formal de versiones bajo *SemVer* y *Keep a Changelog*.

---

## 📁 4. Estructura del Repositorio

```text
├── docs/                     # Ciclo de análisis, diseño y gobernanza
│   ├── phase-1-user-story/   # Historias de Usuario y MoSCoW (Fase 1)
│   ├── phase-2-requirements/ # ERS IEEE 830 y Matriz de Trazabilidad (Fase 2)
│   ├── phase-3-uml/          # Modelado UML: Casos de uso, clases, secuencia, actividades (Fase 3)
│   ├── phase-4-bd/           # Diseño de base de datos relacional 3FN (Fase 4)
│   │   ├── README.md         # Índice maestro de la fase
│   │   ├── documentation/    # Especificación modular detallada (01 al 11 + Diccionario)
│   │   ├── scripts/          # Scripts SQL (schema, data, views, triggers, queries)
│   │   └── diagrams/         # Modelos vectoriales SVG (ERD y Relacional)
│   ├── phase-5-mockups/      # Wireframes y prototipos UI (Fase 5)
│   ├── reports/              # Informes formales de desarrollo y calidad de software
│   └── standards/            # Gobernanza técnica, reglas y manuales de desarrollo
├── src/                      # Código fuente de la solución (Fase 6)
│   ├── backend/              # Lógica de servidor y APIs REST
│   └── frontend/             # Interfaz web de usuario
├── .gitignore                # Archivos y dependencias ignoradas por Git
├── CHANGELOG.md              # Bitácora formal de versiones bajo SemVer
├── LICENSE                   # Licencia de software MIT
├── board-workflow.md         # Flujo de trabajo y mapa de carpetas
└── README.md                 # Presentación ejecutiva del proyecto
```

---

## 🛠️ 5. Ejecución Rápida del Esquema de Base de Datos

Para levantar la base de datos localmente en PostgreSQL:

```bash
# 1. Crear la base de datos (si no existe)
createdb -U postgres clinica_medica_db

# 2. Ejecutar el script DDL de creación de tablas e índices
psql -U postgres -d clinica_medica_db -f docs/phase-4-bd/scripts/schema.sql

# 3. Insertar los datos de prueba iniciales (Seeds)
psql -U postgres -d clinica_medica_db -f docs/phase-4-bd/scripts/data.sql
```

---

## 🎯 6. Próximos Pasos en el Roadmap

1. **Fase 5 (Mockups / Prototipado):** Elaboración de los wireframes e interfaces de usuario para los módulos de Pacientes, Médicos, Citas e Historial Clínico.
2. **Fase 6 (Desarrollo y Testing):** Construcción del código funcional en `src/` bajo TDD cumpliendo el estándar de cobertura $\ge 80\%$.
