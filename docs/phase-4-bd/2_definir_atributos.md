# FASE 4 — PUNTO 2: DEFINICIÓN DE ATRIBUTOS Y TIPOS DE DATOS
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Autores:** Fabián Trujillo, Alexandra Garzón  
**Trazabilidad:** Historias de Usuario (HU-01 a HU-10), ERS IEEE 830 (V6) y Reglas de Negocio (RN-01 a RN-08).  
**Fase del Ciclo de Vida:** Fase 4 — Base de Datos y Persistencia.

---

## 1. Introducción

Los **atributos** definen las propiedades, características cualitativas y cuantitativas o datos elementales que describen a cada una de las entidades identificadas. Para garantizar un diseño relacional robusto, cada atributo debe contar con un **tipo de dato físico** óptimo, una **definición de nulabilidad** estricta (`NULL` / `NOT NULL`) y **restricciones de dominio** que reflejen las reglas de negocio de la clínica.

---

## 2. Diccionario de Atributos por Entidad

### 2.1. Entidad: `PACIENTE` (`pacientes`)

Almacena la información de contacto y demográfica de los usuarios atendidos.

| Atributo | Tipo Lógico | Tipo Físico SQL | Nulo | Valor por Defecto | Restricción / Regla de Negocio |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`id`** | Cadena alfanumérica | `VARCHAR(20)` | **NO** | Ninguno | Identificación legal / Cédula. No vacía. |
| **`nombre`** | Texto corto | `VARCHAR(100)` | **NO** | Ninguno | Nombre completo. Longitud $> 0$. |
| **`edad`** | Entero | `INT` | **NO** | Ninguno | $0 \le \text{edad} \le 125$ años. |
| **`telefono`** | Cadena numérica | `VARCHAR(20)` | **NO** | Ninguno | **RN-04:** Mínimo 7 dígitos (`LENGTH >= 7`). Solo caracteres numéricos. |
| **`direccion`** | Texto descriptivo | `VARCHAR(255)` | **NO** | Ninguno | Dirección de residencia del paciente. |
| **`created_at`**| Marca temporal | `TIMESTAMP` | **NO** | `CURRENT_TIMESTAMP` | Fecha y hora de alta para auditoría del registro. |

---

### 2.2. Entidad: `MEDICO` (`medicos`)

Catalogo de profesionales y facultativos que prestan servicio en la institución.

| Atributo | Tipo Lógico | Tipo Físico SQL | Nulo | Valor por Defecto | Restricción / Regla de Negocio |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`id`** | Cadena alfanumérica | `VARCHAR(20)` | **NO** | Ninguno | Cédula o tarjeta profesional médica. |
| **`nombre`** | Texto corto | `VARCHAR(100)` | **NO** | Ninguno | Nombre y apellidos del profesional. |
| **`edad`** | Entero | `INT` | **NO** | Ninguno | **RN-05:** Edad laboral médica obligatoria ($18 \le \text{edad} \le 99$). |
| **`telefono`** | Cadena numérica | `VARCHAR(20)` | **NO** | Ninguno | **RN-04:** Mínimo 7 dígitos numéricos de contacto. |
| **`especialidad`**| Texto categorizado | `VARCHAR(100)` | **NO** | Ninguno | Área médica habilitada (ej. Medicina General, Cardiología). |
| **`activo`** | Booleano | `BOOLEAN` | **NO** | `TRUE` | **RN-01, RN-08:** Bandera de baja lógica. `TRUE` = Activo, `FALSE` = Inactivo. |
| **`created_at`**| Marca temporal | `TIMESTAMP` | **NO** | `CURRENT_TIMESTAMP` | Fecha de vinculación al sistema. |

---

### 2.3. Entidad: `HISTORIA_CLINICA` (`historias_clinicas`)

Expediente clínico individual vinculado $1:1$ de manera obligatoria a un único paciente.

| Atributo | Tipo Lógico | Tipo Físico SQL | Nulo | Valor por Defecto | Restricción / Regla de Negocio |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`id`** | Entero largo | `BIGINT IDENTITY` | **NO** | Generado automáticamente | Clave primaria autoincremental única. |
| **`paciente_id`**| Cadena alfanumérica | `VARCHAR(20)` | **NO** | Ninguno | Clave foránea al paciente; restricción `UNIQUE` ($1:1$). |
| **`fecha_creacion`**| Fecha | `DATE` | **NO** | `CURRENT_DATE` | Fecha formal de apertura del expediente. |
| **`created_at`**| Marca temporal | `TIMESTAMP` | **NO** | `CURRENT_TIMESTAMP` | Timestamp de auditoría. |

---

### 2.4. Entidad: `CITA` (`citas`)

Registro transaccional de turnos médicos programados.

| Atributo | Tipo Lógico | Tipo Físico SQL | Nulo | Valor por Defecto | Restricción / Regla de Negocio |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`id`** | Entero largo | `BIGINT IDENTITY` | **NO** | Generado automáticamente | Identificador o radicado de cita único. |
| **`paciente_id`**| Cadena alfanumérica | `VARCHAR(20)` | **NO** | Ninguno | Clave foránea hacia `pacientes(id)`. |
| **`medico_id`** | Cadena alfanumérica | `VARCHAR(20)` | **NO** | Ninguno | Clave foránea hacia `medicos(id)`. |
| **`fecha_hora`** | Fecha y hora | `TIMESTAMP` | **NO** | Ninguno | **RN-02:** Combinación única `(medico_id, fecha_hora)` para prevenir sobreagendamiento. |
| **`estado`** | Enumeración de texto | `VARCHAR(15)` | **NO** | `'AGENDADA'` | Dominio restringido: `'AGENDADA'`, `'ATENDIDA'`, `'CANCELADA'`. |
| **`motivo`** | Texto descriptivo | `VARCHAR(255)` | SÍ | `NULL` | Razón o síntoma inicial que motiva la consulta. |
| **`created_at`**| Marca temporal | `TIMESTAMP` | **NO** | `CURRENT_TIMESTAMP` | Registro de creación del agendamiento. |

---

### 2.5. Entidad: `REGISTRO_CONSULTA` (`registros_consulta`)

Acto de valoración clínica, diagnóstico y prescripción emitido por el médico tratante.

| Atributo | Tipo Lógico | Tipo Físico SQL | Nulo | Valor por Defecto | Restricción / Regla de Negocio |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **`id`** | Entero largo | `BIGINT IDENTITY` | **NO** | Generado automáticamente | Clave primaria única del registro. |
| **`historia_clinica_id`** | Entero largo | `BIGINT` | **NO** | Ninguno | Clave foránea hacia `historias_clinicas(id)`. |
| **`cita_id`** | Entero largo | `BIGINT` | SÍ | `NULL` | **RN-06:** Vínculo con la cita atendida; restricción `UNIQUE` (una cita solo genera un registro). |
| **`medico_id`** | Cadena alfanumérica | `VARCHAR(20)` | **NO** | Ninguno | Clave foránea hacia `medicos(id)` (médico tratante responsable). |
| **`fecha_hora`** | Fecha y hora | `TIMESTAMP` | **NO** | Ninguno | Momento exacto de realización de la consulta médica. |
| **`diagnostico`**| Texto sin límite | `TEXT` | **NO** | Ninguno | Conclusión clínica del facultativo (`LENGTH > 0`). |
| **`tratamiento`**| Texto sin límite | `TEXT` | **NO** | Ninguno | Indicaciones, medicamentos y prescripción (`LENGTH > 0`). |
| **`created_at`**| Marca temporal | `TIMESTAMP` | **NO** | `CURRENT_TIMESTAMP` | Marca temporal inmutable de registro. |

---

## 3. Justificación de los Tipos Físicos de Datos

1. **`VARCHAR(20)` para Identificadores de Personas (`pacientes.id`, `medicos.id`):** Permite almacenar números de cédula, documentos de extranjería, pasaportes o códigos profesionales que pueden contener guiones o letras, otorgando flexibilidad sin desperdicio de almacenamiento.
2. **`BIGINT GENERATED ALWAYS AS IDENTITY` para Entidades Operativas:** Cumple con el estándar SQL:2003 para llaves subrogadas autoincrementales, soportando miles de millones de citas y registros sin agotamiento de rango.
3. **`TEXT` para `diagnostico` y `tratamiento`:** En PostgreSQL y motores modernos, `TEXT` almacena cadenas de longitud variable sin límite artificial arbitrario (a diferencia de `VARCHAR(255)`), permitiendo diagnósticos extensos y planes de tratamiento detallados.
4. **`TIMESTAMP` con Zona Horaria / Servidor:** Asegura precisión al segundo para la prevención de colisiones en la agenda médica y auditoría médica.

---

## 4. Próximo Paso

Con los atributos definidos, corresponde formalizar la selección de claves primarias e índices en [**`3_definir_claves_primarias.md`**](file:///c:/Users/USUARIO/Desktop/Sistema_Clinica_Medica/docs/phase-4-bd/3_definir_claves_primarias.md).
