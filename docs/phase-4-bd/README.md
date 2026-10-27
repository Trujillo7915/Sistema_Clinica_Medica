# FASE 4 — DISEÑO DE BASE DE DATOS Y PERSISTENCIA (SGCM)
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Autores:** Fabián Trujillo, Alexandra Garzón  
**Trazabilidad:** Historias de Usuario (HU-01 a HU-10), ERS IEEE 830 (V6), Reglas de Negocio (RN-01 a RN-08) y Diagrama de Clases UML.  
**Motor Objetivo:** PostgreSQL 14+ / Compatible con ANSI SQL, MySQL 8+ y SQLite 3.

---

## 🗺️ Mapa de la Fase 4 (Paso a Paso Modular)

Esta fase contiene el desarrollo paso a paso del modelado y la persistencia relacional:

1. [**Punto 1: Identificación de Entidades**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/1_identificar_entidades.md)
   * Clasificación de entidades fuertes (`PACIENTE`, `MEDICO`), débiles (`HISTORIA_CLINICA`, `REGISTRO_CONSULTA`) y transaccionales (`CITA`).
2. [**Punto 2: Definición de Atributos y Tipos de Datos**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/2_definir_atributos.md)
   * Diccionario de campos, tipos SQL, nulabilidad (`NOT NULL`) y valores por defecto (`DEFAULT`).
3. [**Punto 3: Definición de Claves Primarias e Indexación**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/3_definir_claves_primarias.md)
   * Claves naturales vs subrogadas (`BIGINT IDENTITY`), estrategia de indexación B-Tree y unicidad.
4. [**Punto 4: Definición de Relaciones y Cardinalidades**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/4_definir_relaciones.md)
   * Cardinalidades ($1:1$, $1:N$, $0..1$), Claves Foráneas y acciones `ON DELETE CASCADE / RESTRICT / SET NULL`.
5. [**Punto 5: Proceso Formal de Normalización (1FN, 2FN, 3FN)**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/5_normalizacion.md)
   * Descomposición formal desde UNF hasta 3FN, demostrando la eliminación de anomalías de inserción, borrado y modificación.

---

## 📊 Diagramas Vectoriales de Alta Fidelidad (.svg)

* [**`Modelo_Entidad_Relacion_SGCM.svg`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/diagrams/Modelo_Entidad_Relacion_SGCM.svg): Diagrama Entidad-Relación Conceptual.
* [**`Modelo_Logico_Relacional_SGCM.svg`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/diagrams/Modelo_Logico_Relacional_SGCM.svg): Diagrama Lógico Relacional de Tablas con notación Crow's Foot.

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

* **Script DDL de Creación:** [**`schema.sql`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/schema.sql)
  * Creación ordenada de tablas, índices de rendimiento y restricciones `CHECK` / `UNIQUE`.
* **Script DML de Datos de Prueba:** [**`data.sql`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/data.sql)
  * Inserción de 5 pacientes, 5 médicos (con especialidades diversas y caso de baja lógica), 5 historias clínicas, 5 citas en diferentes estados y 4 registros clínicos evolutivos.
