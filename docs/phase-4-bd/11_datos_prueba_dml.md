# FASE 4 — PUNTO 11: CATÁLOGO Y TRAZABILIDAD DE DATOS DE PRUEBA (DML)
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Autores:** Fabián Trujillo, Alexandra Garzón  
**Trazabilidad:** Historias de Usuario (HU-01 a HU-10), ERS IEEE 830 (V6), Reglas de Negocio (RN-01 a RN-08) y Script `data.sql`.  
**Fase del Ciclo de Vida:** Fase 4 — Base de Datos y Persistencia.

---

## 1. Introducción y Filosofía de Datos de Prueba

Un diseño de base de datos no está completo sin un conjunto de datos de prueba (**DML Seed Data**) cuidadosamente calibrado. En el **SGCM**, los datos contenidos en el script [`data.sql`](data.sql) no son valores aleatorios (lorem ipsum); representan **escenarios clínicos realistas** diseñados deliberadamente para validar:

1. El flujo feliz (**Happy Path**) de las 10 Historias de Usuario.
2. Los casos de borde (**Edge Cases**) de edad, estados y especialidades.
3. Las restricciones de integridad y Reglas de Negocio (**RN-01 a RN-08**).

---

## 2. Catálogo Descriptivo de Entidades y Registros

### 2.1. Catálogo de Pacientes (`pacientes`) — 5 Registros
Se diseñó una muestra demográficamente diversa para validar rangos de edad desde pediatría hasta geriatría:

| ID Paciente | Nombre y Apellidos | Edad | Teléfono | Dirección | Propósito Clínico y de Prueba |
| :--- | :--- | :---: | :--- | :--- | :--- |
| **`P-101`** | Carlos Andrés Mendoza | 34 | `3104567890` | Calle 45 # 12-34, Bogotá | Adulto joven; caso base con cita atendida y evolución clínica de hipertensión. |
| **`P-102`** | María Fernanda Gómez | 28 | `3159876543` | Carrera 7 # 115-40, Bogotá | Adulto joven; valida escenario de cita cancelada (HU-08). |
| **`P-103`** | Jorge Eduardo Ramírez | 62 | `3001234567` | Av. Esperanza # 50-21, Bogotá | Adulto mayor; paciente cardiópata con cita futura agendada (HU-07). |
| **`P-104`** | Valentina Ríos Castro | 19 | `3206549871` | Transversal 23 # 85-12, Bogotá| Joven en límite inferior de mayoría de edad con cita agendada. |
| **`P-105`** | Sofía Isabela Martínez | 8 | `3117894561` | Calle 134 # 9-60, Bogotá | Paciente pediátrica; valida atención infantil y dosificación en jarabe. |

---

### 2.2. Catálogo de Médicos (`medicos`) — 5 Registros
Incluye cobertura multidisciplinaria y el caso especial de un médico inactivo para pruebas de seguridad:

| ID Médico | Nombre del Facultativo | Edad | Especialidad | Activo | Propósito Clínico y de Prueba |
| :--- | :--- | :---: | :--- | :---: | :--- |
| **`M-201`** | Dra. Laura Camila Torres | 39 | Medicina General | `TRUE` | Médica de cabecera; facultativa asignada a turnos agendados y atendidos. |
| **`M-202`** | Dr. Roberto Silva Morales | 48 | Cardiología | `TRUE` | Especialista senior; atiende evaluaciones cardiovasculares complejas. |
| **`M-203`** | Dra. Diana Patricia Hoyos | 42 | Pediatría | `TRUE` | Especialista infantil; atiende a `P-105`. |
| **`M-204`** | Dr. Andrés Felipe Vargas | 35 | Dermatología | `TRUE` | Especialista disponible para interconsultas. |
| **`M-205`** | Dr. Guillermo León Pérez | 67 | Medicina General | `FALSE` | **Caso de Prueba Crítico (RN-01 / RN-08):** Médico dado de baja lógica; permite verificar que el sistema rechace agendarle nuevas citas. |

---

### 2.3. Catálogo de Citas Médicas (`citas`) — 5 Registros
Cubre todo el ciclo de vida de la entidad `Cita`:

| ID | Paciente | Médico | Fecha y Hora | Estado | Motivo Registrado |
| :---: | :---: | :---: | :--- | :---: | :--- |
| **1** | `P-101` | `M-201` | `2026-03-20 08:30:00` | `ATENDIDA` | Control de rutina e hipertensión (da origen al registro clínico 1). |
| **2** | `P-105` | `M-203` | `2026-03-22 10:00:00` | `ATENDIDA` | Fiebre persistente y tos seca en paciente pediátrica. |
| **3** | `P-102` | `M-204` | `2026-03-25 14:00:00` | `CANCELADA` | Consulta dermatológica cancelada por viaje (prueba de HU-08). |
| **4** | `P-103` | `M-202` | `2026-11-05 09:00:00` | `AGENDADA` | Evaluación cardiovascular post-esfuerzo (cita futura activa). |
| **5** | `P-104` | `M-201` | `2026-11-05 11:30:00` | `AGENDADA` | Revisión de cuadro gripal y certificación médica (futura activa). |

---

### 2.4. Catálogo de Registros de Consulta (`registros_consulta`) — 4 Registros
Evidencian formulaciones médicas farmacológicas reales y estructuradas:

| ID | Historia ID | Cita ID | Médico | Fecha/Hora | Diagnóstico Clínico | Conducta / Tratamiento Prescrito |
| :---: | :---: | :---: | :---: | :--- | :--- | :--- |
| **1** | 1 (`P-101`) | 1 | `M-201` | `2026-03-20 09:00:00` | Hipertensión arterial esencial grado 1 bajo control. | Continuar Losartán 50mg cada 12h. Dieta hiposódica y caminata 30 min diarios. |
| **2** | 1 (`P-101`) | `NULL` | `M-202` | `2026-04-10 16:15:00` | Ecocardiograma con fracción de eyección del 62%. Ritmo sinusal. | Buen pronóstico cardiaco. Próximo control en 6 meses. |
| **3** | 5 (`P-105`) | 2 | `M-203` | `2026-03-22 10:35:00` | Faringoamigdalitis viral aguda sin sobreinfección. | Acetaminofén jarabe 120mg/5ml (5ml c/6h por 3 días). Abundante hidratación. |
| **4** | 3 (`P-103`) | `NULL` | `M-202` | `2026-02-15 11:00:00` | Evaluación preliminar de palpitaciones ocasionales. | Orden de Holter cardiaco 24 horas y perfil lipídico completo en ayunas. |

---

## 3. Matriz de Trazabilidad: Historias de Usuario vs Datos de Prueba

| Historia de Usuario (Fase 1 / 2) | Registros de Prueba Asociados | Escenario Validado en Pruebas de QA | Resultado Esperado en Base de Datos |
| :--- | :--- | :--- | :--- |
| **HU-01: Registrar Paciente** | `P-101` a `P-105` | Inserción con validación de teléfono (≥ 7 dígitos) y edad válida. | Inserción exitosa; clave primaria única. |
| **HU-02: Consultar Pacientes** | `SELECT * FROM pacientes;` | Listado completo de usuarios registrados en el sistema. | Retorna exactamente 5 registros activos. |
| **HU-03: Actualizar Paciente** | `P-101` | Modificación de dirección o teléfono manteniendo ID inmutable. | `UPDATE` exitoso sin violar restricciones. |
| **HU-04: Registrar Médico** | `M-201` a `M-204` | Alta de profesionales con especialidad y edad laboral válida (**RN-05**). | Inserción exitosa; flag `activo = TRUE`. |
| **HU-05: Consultar Médicos** | `M-201` a `M-205` | Filtrado de médicos activos disponibles por especialidad (**RN-08**). | Excluye al médico inactivo `M-205`. |
| **HU-06: Eliminar/Baja Médico** | `M-205` | Aplicación de borrado lógico preservando integridad histórica (**RN-01**). | `activo = FALSE` sin violar FK en citas. |
| **HU-07: Agendar Cita** | Citas 4 y 5 | Creación de turnos futuros verificando no colisión horaria (**RN-02**). | Estado inicial `'AGENDADA'`. |
| **HU-08: Cancelar Cita** | Cita 3 | Liberación de turno cambiando estado a `'CANCELADA'` (**RN-07**). | Estado transiciona a `'CANCELADA'`. |
| **HU-09: Registrar Diagnóstico**| Registro 1 y 3 | Asentamiento de evolución vinculando cita origen y marcándola atendida (**RN-06**).| Cita pasa a `'ATENDIDA'`; registro enlazado. |
| **HU-10: Consultar Historial** | Historia 1 (`P-101` con 2 registros) | Consulta cronológica de antecedentes clínicos ordenados por fecha descendente. | Retorna 2 evoluciones ordenadas por fecha. |
