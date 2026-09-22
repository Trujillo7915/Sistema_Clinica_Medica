# MATRIZ DE TRAZABILIDAD (HU ↔ RF ↔ CU)
## Sistema de Gestión de Clínica Médica (SGCM - MVP)

Esta matriz vincula formalmente las necesidades del usuario (Historias de Usuario) con las especificaciones técnicas (Requisitos Funcionales) y los escenarios de ejecución (Casos de Uso) definidos para el MVP.

### 📋 Convenciones de Prioridad (MoSCoW)
*   **Must Have:** Obligatorio para el despliegue del MVP.
*   **Should Have:** Deseable, aporta gran valor pero no bloquea la salida.
*   **Could Have:** Opcional o de baja prioridad para esta fase.

---

## 🗺️ Matriz de Relaciones Globales

| ID Historia de Usuario | Módulo / Épica | ID Requisito ERS | ID Caso de Uso | Nivel de Prioridad (MoSCoW) | Estado de Validación en V4 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **HU-01** | Gestión de Pacientes | **RF-01** | **CU-01** | Must Have | Validado con criterios de éxito y error |
| **HU-02** | Gestión de Pacientes | **RF-02** | **CU-02** | Must Have | Validado con control de base de datos vacía |
| **HU-03** | Gestión de Pacientes | **RF-03** | **CU-03** | Should Have | Validado para actualización por ID |
| **HU-04** | Gestión de Médicos | **RF-04** | **CU-04** | Must Have | *Pendiente (Validar rango edad 18-99)* |
| **HU-05** | Gestión de Médicos | **RF-05** | **CU-05** | Must Have | Validado con listado general |
| **HU-06** | Gestión de Médicos | **RF-06** | **CU-06** | Could Have (Baja) | Validado con integridad de agenda |
| **HU-07** | Gestión de Citas | **RF-07** | **CU-07** | Must Have (Crítica) | Validado con regla de sobreagendamiento |
| **HU-08** | Gestión de Citas | **RF-08** | **CU-08** | Should Have | *Pendiente (Definir bloqueo de cita ATENDIDA)* |
| **HU-09** | Historia Clínica | **RF-09** | **CU-09** | Must Have | Ajustado para usar Paciente + Médico |
| **HU-10** | Historia Clínica | **RF-10** | **CU-10** | Must Have | Validado con ordenamiento cronológico |

---

## 🔎 Detalle de Criterios de Aceptación por Requisito

### Épica 1: Gestión de Pacientes
*   **HU-01 ➔ RF-01 (CU-01):**
    *   `RF-01.1`: Registro exitoso con ID único, nombre, edad, teléfono (≥ 7 dígitos) y dirección.
    *   `RF-01.2`: Rechazo e impresión de error si el teléfono contiene letras o menos de 7 dígitos.
    *   `RF-01.3`: Bloqueo del flujo si el campo de nombre se envía vacío.
*   **HU-02 ➔ RF-02 (CU-02):**
    *   `RF-02.1`: Despliegue completo de la lista si existen registros de pacientes.
    *   `RF-02.2`: Mensaje *"No hay registros de pacientes disponibles"* si la persistencia está vacía.
*   **HU-03 ➔ RF-03 (CU-03):**
    *   `RF-03.1`: Modificación exclusiva de campos de contacto/dirección al buscar por ID existente.
    *   `RF-03.2`: Alerta de *"Paciente no encontrado"* si el ID ingresado no existe.

### Épica 2: Gestión de Médicos
*   **HU-04 ➔ RF-04 (CU-04):**
    *   `RF-04.1`: Registro exitoso con ID, nombre, especialidad y edad válida (Propuesta: 18 a 99 años).
    *   `RF-04.2`: Rechazo y solicitud de reingreso si la edad está fuera del rango permitido.
    *   `RF-04.3`: Bloqueo del guardado si el campo de especialidad se deja vacío.
*   **HU-05 ➔ RF-05 (CU-05):**
    *   `RF-05.1`: Muestra la lista de médicos (ID, Nombre, Edad, Teléfono, Especialidad).
    *   `RF-05.2`: Mensaje *"No hay médicos registrados"* si la consulta no devuelve datos.
*   **HU-06 ➔ RF-06 (CU-06):**
    *   `RF-06.1`: Eliminación exitosa si el médico no cuenta con citas futuras en estado `AGENDADA`.
    *   `RF-06.2`: Bloqueo de eliminación si el médico tiene citas `AGENDADA` activas. Exige reasignación.
    *   `RF-06.3`: Mensaje de error si el ID del médico no existe en el sistema.

### Épica 3: Gestión de Citas
*   **HU-07 ➔ RF-07 (CU-07):**
    *   `RF-07.1`: Creación de cita con ID único y estado inicial `AGENDADA` tras validar disponibilidad.
    *   `RF-07.2`: Cancelación inmediata del proceso si el ID del Paciente o del Médico no existen.
    *   `RF-07.3`: Validación estricta del formato de fecha/hora (bloqueo de letras o fechas pasadas).
    *   `RF-07.4`: Alerta de sobreagendamiento y rechazo si el médico ya tiene otra cita `AGENDADA` en el mismo bloque horario.
*   **HU-08 ➔ RF-08 (CU-08):**
    *   `RF-08.1`: Cambio de estado exitoso a `CANCELADA` si la cita original estaba `AGENDADA`.
    *   `RF-08.2`: Notificación de error si la cita no existe o ya se encuentra en estado `CANCELADA`.

### Épica 4: Historia Clínica
*   **HU-09 ➔ RF-09 (CU-09):**
    *   `RF-09.1`: Registro de diagnóstico/tratamiento anexado a la historia clínica. Transiciona el estado de la cita asociada a `ATENDIDA`.
    *   `RF-09.2`: Error si los IDs no existen o si no hay un registro de cita que vincule a ese médico con ese paciente.
*   **HU-10 ➔ RF-10 (CU-10):**
    *   `RF-10.1`: Retorno ordenado cronológicamente de todas las consultas médicas de un paciente.
    *   `RF-10.2`: Mensaje *"El paciente no registra entradas en su historial clínico"* si el ID existe pero no tiene consultas.
    *   `RF-10.3`: Alerta de paciente no encontrado si el ID ingresado no está registrado en el sistema.

---
*Documento de Control Interno generado para asegurar la cobertura de código y pruebas Unitarias/QA en el MVP.*
