# HISTORIAS DE USUARIO

## Sistema de Gestión de Clínica Médica

### Integrantes

- Fabián Trujillo
- Alexandra Garzón

---

## Índice

1. [Introducción y alcance](#1-introducción-y-alcance)
2. [Backlog priorizado (MoSCoW)](#2-backlog-priorizado-moscow)
3. [Épica - Gestión de Pacientes](#3-épica---gestión-de-pacientes)
   - [HU-01 - Registrar paciente](#hu-01---registrar-paciente)
   - [HU-02 - Consultar pacientes](#hu-02---consultar-pacientes)
   - [HU-03 - Actualizar datos de un paciente](#hu-03---actualizar-datos-de-un-paciente)
4. [Épica - Gestión de Médicos](#4-épica---gestión-de-médicos)
   - [HU-04 - Registrar médico](#hu-04---registrar-médico)
   - [HU-05 - Consultar médicos](#hu-05---consultar-médicos)
   - [HU-06 - Eliminar médico](#hu-06---eliminar-médico)
5. [Épica - Gestión de Citas](#5-épica---gestión-de-citas)
   - [HU-07 - Agendar cita](#hu-07---agendar-cita)
   - [HU-08 - Cancelar cita](#hu-08---cancelar-cita)
6. [Épica - Historia Clínica](#6-épica---historia-clínica)
   - [HU-09 - Registrar diagnóstico y tratamiento](#hu-09---registrar-diagnóstico-y-tratamiento)
   - [HU-10 - Consultar historial clínico](#hu-10---consultar-historial-clínico)

---

## 1. Introducción y alcance

Se dividieron en cuatro épicas: Pacientes, Médicos, Citas e Historia Clínica. Cada historia tiene su rol, la funcionalidad que se necesita, el valor de negocio y los criterios de aceptación escritos en formato Gherkin (Dado / Cuando / Entonces).

## 2. Backlog priorizado (MoSCoW)

Para priorizar se tuvo en cuenta el valor, la frecuencia de uso, el riesgo y las dependencias entre historias. Las Must Have son el flujo mínimo para que el sistema funcione (registrar y consultar pacientes y médicos, agendar citas, registrar y consultar historia clínica); las Should Have permiten mantener actualizados los datos; y las Could Have son casos que se usan poco, como eliminar un médico.

| HU | Historia de usuario | Épica | Prioridad (MoSCoW) |
|---|---|---|---|
| HU-01 | Registrar paciente | Pacientes | Must Have |
| HU-02 | Consultar pacientes | Pacientes | Must Have |
| HU-04 | Registrar médico | Médicos | Must Have |
| HU-05 | Consultar médicos | Médicos | Must Have |
| HU-07 | Agendar cita | Citas | Must Have (Crítica) |
| HU-09 | Registrar diagnóstico y tratamiento | Historia clínica | Must Have |
| HU-10 | Consultar historial clínico | Historia clínica | Must Have |
| HU-03 | Actualizar datos de un paciente | Pacientes | Should Have |
| HU-08 | Cancelar cita | Citas | Should Have |
| HU-06 | Eliminar médico | Médicos | Could Have (Baja) |

## 3. Épica - Gestión de Pacientes

### HU-01 - Registrar paciente

**Prioridad:** MUST HAVE

**Historia de usuario:**  
Como recepcionista quiero registrar un nuevo paciente con sus datos básicos para poder agendarle citas y crear su historia clínica.

**Criterios de aceptación:**

- **Dado** que estoy en el módulo de pacientes, **cuando** ingreso el ID, nombre, edad, teléfono y dirección, **entonces** el sistema registra al paciente y lo confirmará en pantalla.
- **Dado** que ingreso un teléfono con letras o con menos de 7 dígitos, **cuando** intento registrar el paciente, **entonces** el sistema muestra un mensaje de error y no lo guarda.
- **Dado** que dejo el campo nombre vacío, **cuando** intento registrar el paciente, **entonces** el sistema no permite continuar hasta que ingrese un valor válido.

### HU-02 - Consultar pacientes

**Prioridad:** MUST HAVE

**Historia de usuario:**  
Como recepcionista o médico quiero ver el listado de pacientes registrados para ubicar rápidamente su información antes de una cita o consulta.

**Criterios de aceptación:**

- **Dado** que existen pacientes registrados, **cuando** accedo a la opción "Consultar pacientes", **entonces** el sistema muestra la lista completa con ID, nombre, edad, teléfono y dirección.
- **Dado** que no hay pacientes registrados, **cuando** accedo a la opción "Consultar pacientes", **entonces** el sistema muestra un mensaje indicando que no hay registros.

### HU-03 - Actualizar datos de un paciente

**Prioridad:** SHOULD HAVE

**Historia de usuario:**  
Como recepcionista quiero modificar los datos de un paciente existente para mantener su información actualizada.

**Criterios de aceptación:**

- **Dado** que ingreso el ID de un paciente existente, **cuando** modifico uno o varios campos con datos válidos, **entonces** el sistema actualiza solo esos campos y confirma el cambio.
- **Dado** que ingreso el ID de un paciente que no existe, **cuando** intento actualizarlo, **entonces** el sistema muestra un mensaje indicando que no fue encontrado.

## 4. Épica - Gestión de Médicos

### HU-04 - Registrar médico

**Prioridad:** MUST HAVE

**Historia de usuario:**  
Como administrador quiero registrar un nuevo médico con su especialidad para poder asignarle citas y pacientes.

**Criterios de aceptación:**

- **Dado** que ingreso un ID único, nombre, edad, teléfono y especialidad válidos, **cuando** registro al médico, **entonces** el sistema lo guarda y lo confirma en pantalla.
- **Dado** que ingreso una edad fuera del rango permitido, **cuando** intento registrar al médico, **entonces** el sistema solicita un valor válido antes de continuar.
- **Dado** que dejo el campo especialidad vacío, **cuando** intento registrar al médico, **entonces** el sistema no permite continuar hasta que ingrese un valor válido.

### HU-05 - Consultar médicos

**Prioridad:** MUST HAVE

**Historia de usuario:**  
Como recepcionista quiero ver el listado de médicos registrados para saber a quién puedo asignar una cita según su especialidad.

**Criterios de aceptación:**

- **Dado** que existen médicos registrados, **cuando** accedo a la opción "Consultar médicos", **entonces** el sistema muestra la lista con ID, nombre, edad, teléfono y especialidad.
- **Dado** que no hay médicos registrados, **cuando** accedo a la opción "Consultar médicos", **entonces** el sistema muestra un mensaje indicando que no hay registros.

### HU-06 - Eliminar médico

**Prioridad:** COULD HAVE

**Historia de usuario:**  
Como administrador quiero eliminar un médico del sistema para dar de baja a quienes ya no laboran en la clínica.

**Criterios de aceptación:**

- **Dado** que ingreso el ID de un médico existente sin citas futuras "AGENDADA", **cuando** confirmo la eliminación, **entonces** el sistema lo elimina y lo confirma en pantalla.
- **Dado** que ingreso el ID de un médico existente con una o más citas futuras "AGENDADA", **cuando** intento eliminarlo, **entonces** el sistema muestra una advertencia y solicita reasignar o cancelar esas citas antes de continuar.
- **Dado** que ingreso el ID de un médico inexistente, **cuando** intento eliminarlo, **entonces** el sistema muestra un mensaje de error sin realizar cambios.

## 5. Épica - Gestión de Citas

### HU-07 - Agendar cita

**Prioridad:** MUST HAVE

**Historia de usuario:**  
Como recepcionista quiero agendar una cita entre un paciente y un médico disponible para organizar la atención médica.

**Criterios de aceptación:**

- **Dado** que ingreso un ID de paciente válido, un ID de médico válido, fecha y hora válidas, **cuando** confirmo el agendamiento, **entonces** el sistema crea la cita con estado "AGENDADA", le asigna un ID y lo confirma en pantalla.
- **Dado** que ingreso un ID de paciente o médico inexistente, **cuando** intento agendar la cita, **entonces** el sistema muestra un mensaje de error y no la crea.
- **Dado** que ingreso una fecha u hora con formato inválido, **cuando** intento agendar la cita, **entonces** el sistema solicita el dato nuevamente hasta recibir un formato correcto.
- **Dado** que el médico seleccionado ya tiene una cita "AGENDADA" en la misma fecha y hora, **cuando** intento agendar la nueva cita, **entonces** el sistema muestra un mensaje de conflicto de agenda y no la crea.

### HU-08 - Cancelar cita

**Prioridad:** SHOULD HAVE

**Historia de usuario:**  
Como recepcionista quiero cancelar una cita previamente agendada para liberar el espacio si el paciente no puede asistir.

**Criterios de aceptación:**

- **Dado** que ingreso el ID de una cita en estado "AGENDADA", **cuando** confirmo la cancelación, **entonces** el sistema cambia su estado a "CANCELADA" y lo confirma en pantalla.
- **Dado** que ingreso el ID de una cita que ya está cancelada o no existe, **cuando** intento cancelarla, **entonces** el sistema muestra un mensaje indicando que no fue posible.

## 6. Épica - Historia Clínica

### HU-09 - Registrar diagnóstico y tratamiento

**Prioridad:** MUST HAVE

**Historia de usuario:**  
Como médico quiero registrar el diagnóstico y tratamiento de un paciente atendido para dejar constancia de la atención brindada y dar seguimiento en futuras visitas.

**Criterios de aceptación:**

- **Dado** que ingreso un ID de paciente válido, un ID de médico válido, fecha, diagnóstico y tratamiento, **cuando** confirmo el registro, **entonces** el sistema agrega el registro a la historia clínica del paciente y lo confirma en pantalla.
- **Dado** que ingreso un ID de paciente o médico inexistente, **cuando** intento registrar el diagnóstico, **entonces** el sistema muestra un mensaje de error y no lo guarda.

### HU-10 - Consultar historial clínico

**Prioridad:** MUST HAVE

**Historia de usuario:**  
Como médico quiero consultar el historial clínico completo de un paciente para conocer sus diagnósticos y tratamientos previos antes de atenderlo.

**Criterios de aceptación:**

- **Dado** que ingreso el ID de un paciente con historial registrado, **cuando** consulto su historia clínica, **entonces** el sistema muestra todos sus registros ordenados con fecha, médico, diagnóstico y tratamiento.
- **Dado** que ingreso el ID de un paciente sin registros clínicos, **cuando** consulto su historia clínica, **entonces** el sistema indica que aún no tiene registros.
- **Dado** que ingreso un ID de paciente inexistente, **cuando** intento consultar su historia clínica, **entonces** el sistema muestra un mensaje de error.
