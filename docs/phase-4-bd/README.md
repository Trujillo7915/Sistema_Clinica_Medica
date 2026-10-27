# FASE 4 — DISEÑO DE BASE DE DATOS Y PERSISTENCIA (SGCM)
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Autores:** Fabián Trujillo, Alexandra Garzón  
**Trazabilidad:** Historias de Usuario (HU-01 a HU-10), ERS IEEE 830 (V6), Reglas de Negocio (RN-01 a RN-08) y Diagrama de Clases UML.  
**Motor Objetivo:** PostgreSQL 14+ / Compatible con ANSI SQL, MySQL 8+ y SQLite 3.

---

## 🗺️ Mapa de la Fase 4 (Paso a Paso Modular)

Esta fase contiene el ciclo completo de modelado conceptual, lógico, físico, scripts ejecutables y gobernanza de persistencia relacional:

### Bloque A: Fundamentos y Análisis Conceptual
1. [**Punto 1: Identificación de Entidades**](1_identificar_entidades.md)
   * Clasificación de entidades fuertes (`PACIENTE`, `MEDICO`), débiles (`HISTORIA_CLINICA`, `REGISTRO_CONSULTA`) y transaccionales (`CITA`).
2. [**Punto 2: Definición de Atributos y Tipos de Datos**](2_definir_atributos.md)
   * Diccionario de campos, tipos SQL, nulabilidad (`NOT NULL`) y valores por defecto (`DEFAULT`).
3. [**Punto 3: Definición de Claves Primarias e Indexación**](3_definir_claves_primarias.md)
   * Claves naturales vs subrogadas (`BIGINT IDENTITY`), estrategia de indexación B-Tree y unicidad.
4. [**Punto 4: Definición de Relaciones y Cardinalidades**](4_definir_relaciones.md)
   * Cardinalidades ($1:1$, $1:N$, $0..1$), Claves Foráneas y acciones `ON DELETE CASCADE / RESTRICT / SET NULL`.
5. [**Punto 5: Proceso Formal de Normalización (1FN, 2FN, 3FN)**](5_normalizacion.md)
   * Descomposición formal desde UNF hasta 3FN, demostrando la eliminación de anomalías de inserción, borrado y modificación.

### Bloque B: Modelado Formal y Especificación Técnica
6. [**Punto 6: Especificación Formal del Modelo Entidad-Relación (MER)**](6_modelo_entidad_relacion.md)
   * Modelo conceptual formal, simbología Peter Chen/Crow's Foot, entidades fuertes/débiles/asociativas y matriz de cardinalidades.
7. [**Punto 7: Modelo Lógico Relacional (MLR)**](7_modelo_logico_relacional.md)
   * Esquema intensional de tablas, claves foráneas, reglas de transformación y matriz de integridad referencial.
8. [**Punto 8: Estructura DDL y Definición de Tablas**](8_crear_tablas_ddl.md)
   * Definición física DDL de las 5 tablas, tipos de almacenamiento, nulabilidad estricta y estrategia de índices B-Tree.
9. [**Punto 9: Restricciones de Integridad y Reglas de Negocio**](9_crear_restricciones.md)
   * Matriz de constraints (`CHECK`, `UNIQUE`, `FK`) vinculadas punto a punto con las reglas `RN-01` a `RN-08`.
10. [**Punto 10: Guía de Ejecución y Despliegue del Script SQL**](10_script_sql.md)
    * Manual de despliegue en PostgreSQL (`psql`, pgAdmin, Docker) y comandos de verificación post-instalación.
11. [**Punto 11: Catálogo y Trazabilidad de Datos de Prueba (DML)**](11_datos_prueba_dml.md)
    * Catálogo de semillas realistas y matriz de trazabilidad validando las 10 Historias de Usuario (HU-01 a HU-10).
12. [**Diccionario de Datos Consolidado y Volumetría**](diccionario_datos.md)
    * Catálogo formal de campos, tipos, longitudes, dominios y proyección de almacenamiento a 12 meses.

---

## 📊 Diagramas Vectoriales de Alta Fidelidad (.svg)

* [**`Modelo_Entidad_Relacion_SGCM.svg`**](diagrams/Modelo_Entidad_Relacion_SGCM.svg): Diagrama Entidad-Relación Conceptual.
* [**`Modelo_Logico_Relacional_SGCM.svg`**](diagrams/Modelo_Logico_Relacional_SGCM.svg): Diagrama Lógico Relacional de Tablas con notación Crow's Foot.

```mermaid
erDiagram
    PACIENTE ||--|| HISTORIA_CLINICA : "tiene (1:1)"
    PACIENTE ||--o{ CITA : "solicita (1:N)"
    MEDICO ||--o{ CITA : "atiende (1:N)"
    MEDICO ||--o{ REGISTRO_CONSULTA : "firma/registra (1:N)"
    HISTORIA_CLINICA ||--o{ REGISTRO_CONSULTA : "contiene (1:N)"
    CITA |o--o| REGISTRO_CONSULTA : "origina (0..1:1)"

    PACIENTE {
        string id PK "Cedula / Identificacion legal"
        string nombre "Nombre y apellido"
        int edad "Edad en anos"
        string telefono "Telefono (>= 7 digitos)"
        string direccion "Domicilio"
        timestamp created_at "Auditoria"
    }

    MEDICO {
        string id PK "Tarjeta profesional / Cedula"
        string nombre "Nombre del facultativo"
        int edad "Edad laboral (18 a 99)"
        string telefono "Telefono de contacto"
        string especialidad "Rama medica"
        boolean activo "Bandera de baja logica (RN-01, RN-08)"
        timestamp created_at "Auditoria"
    }

    HISTORIA_CLINICA {
        bigint id PK "Identificador secuencial"
        string paciente_id FK "Vinculo unico con Paciente (1:1)"
        date fecha_creacion "Fecha apertura"
        timestamp created_at "Auditoria"
    }

    CITA {
        bigint id PK "Radicado unico de turno"
        string paciente_id FK "Paciente agendado"
        string medico_id FK "Medico asignado"
        timestamp fecha_hora "Horario (RN-02)"
        string estado "AGENDADA | ATENDIDA | CANCELADA"
        string motivo "Motivo consulta"
        timestamp created_at "Auditoria"
    }

    REGISTRO_CONSULTA {
        bigint id PK "Id de evolucion clinica"
        bigint historia_clinica_id FK "Expediente del paciente"
        bigint cita_id FK "Cita origen (opcional)"
        string medico_id FK "Medico tratante"
        timestamp fecha_hora "Fecha del acto medico"
        text diagnostico "Juicio clinico"
        text tratamiento "Prescripcion y conducta"
        timestamp created_at "Auditoria"
    }
```

---

## 💾 Scripts de Base de Datos SQL

| Archivo SQL | Propósito Principal | Trazabilidad |
| :--- | :--- | :--- |
| [**`schema.sql`**](schema.sql) | Creación DDL de tablas, índices B-Tree y restricciones `CHECK` / `UNIQUE`. | RF-01 a RF-10 |
| [**`views.sql`**](views.sql) | Vistas optimizadas para recepción (`v_agenda_citas_recepcion`) e historia médica. | HU-07, HU-10 |
| [**`triggers.sql`**](triggers.sql) | Disparadores automáticos: alta de expediente (1:1) y transición a ATENDIDA (**RN-06**). | RN-06, RN-08 |
| [**`data.sql`**](data.sql) | Inserción de semillas realistas (5 pacientes, 5 médicos, 5 citas, 4 registros clínicos). | CP-01 a CP-10 |
| [**`queries.sql`**](queries.sql) | Batería DQL de validación funcional y pruebas negativas de reglas (**RN-01..RN-08**). | QA & Testing |
