**ESPECIFICACIÓN DE REQUISITOS SOFTWARE (ERS)**

Sistema de Gestión de Clínica Médica (SGCM - MVP)

**Estándar:** IEEE Std 830-1998 (complementado con Especificación de Casos de Uso)

**Autores del Proyecto:** Fabián Trujillo, Alexandra Garzón

**Versión del Documento:** V4

> Esta versión ajusta el documento a dos cosas que definimos como equipo: la arquitectura real con la que vamos a desplegar el MVP (backend en Java, frontend en HTML/CSS/JavaScript) y una revisión más cuidadosa de las Historias de Usuario, para que cada requisito funcional tenga una historia que lo respalde. El registro de qué cambiamos y por qué está en el Apéndice 4.2. Los puntos que todavía no hemos cerrado como equipo quedan listados en el Apéndice 4.4, para decidirlos antes de pasar a diseño.

# TABLA DE CONTENIDO

- **1. INTRODUCCIÓN**
  - 1.1. Propósito
  - 1.2. Ámbito del Sistema
  - 1.3. Definiciones, Acrónimos y Abreviaturas
  - 1.4. Referencias
  - 1.5. Visión General del Documento
- **2. DESCRIPCIÓN GENERAL**
  - 2.1. Perspectiva del Producto
  - 2.2. Funciones del Producto
  - 2.3. Características de los Usuarios
  - 2.4. Restricciones
  - 2.5. Suposiciones y Dependencias
  - 2.6. Requisitos Futuros
- **3. REQUISITOS ESPECÍFICOS**
  - 3.1. Interfaces Externas
  - 3.2. Requisitos Funcionales
    - 3.2.1. Épica 1: Gestión de Pacientes
    - 3.2.2. Épica 2: Gestión de Médicos
    - 3.2.3. Épica 3: Gestión de Citas
    - 3.2.4. Épica 4: Historia Clínica
  - 3.3. Requisitos de Rendimiento
  - 3.4. Restricciones de Diseño
  - 3.5. Atributos del Sistema (Requisitos No Funcionales)
  - 3.6. Otros Requisitos
- **4. APÉNDICES**
  - 4.1. Apéndice A: Estructura de Navegación Web
  - 4.2. Apéndice B: Registro de Cambios y Decisiones
  - 4.3. Apéndice C: Especificación de Casos de Uso
  - 4.4. Apéndice D: Cuestiones Abiertas y Supuestos Pendientes de Validación

---

## 1. INTRODUCCIÓN

### 1.1. Propósito

El propósito de este documento es definir la Especificación de Requisitos Software (ERS) para el Sistema de Gestión de Clínica Médica (Versión MVP). Está dirigido a desarrolladores, arquitectos de software, especialistas de QA/testing y coordinadores del proyecto para guiarlos en las fases de diseño, construcción, validación y mantenimiento del software.

### 1.2. Ámbito del Sistema

- **Nombre del Sistema:** Sistema de Gestión de Clínica Médica (SGCM).
- **Naturaleza del Sistema:** Aplicación **web cliente-servidor**. Backend en **Java** (lógica de negocio y persistencia) y frontend en **HTML, CSS y JavaScript** (interfaz de usuario en navegador).
- **Lo que HACE el sistema:** Permite la administración básica operativa de una clínica: registro y actualización de pacientes, registro y baja lógica de médicos, agendamiento y cancelación de citas médicas con validación estricta de solapamiento de horarios, registro de diagnósticos y tratamientos por consulta, y visualización cronológica del historial clínico.
- **Lo que NO HACE el sistema:** No procesa pagos, no realiza facturación electrónica, no gestiona inventario de medicamentos, no envía notificaciones SMS/email, y no genera reportes operativos en esta fase MVP (ver 2.6).
- **Beneficios u Objetivos:** Automatizar los procesos operativos de recepción y consulta médica para reducir errores en asignación de citas, prevenir sobreagendamiento y mantener la trazabilidad de las historias clínicas.

### 1.3. Definiciones, Acrónimos y Abreviaturas

| Término / Acrónimo | Definición |
|---|---|
| **ERS / SRS** | Especificación de Requisitos Software (Software Requirements Specification). |
| **MVP** | Producto Mínimo Viable (Minimum Viable Product). |
| **HU** | Historia de Usuario. |
| **MoSCoW** | Técnica de priorización de requisitos: **Must have, Should have, Could have, Would have**. Usamos además un **calificador opcional entre paréntesis** para matizar urgencia/riesgo dentro de un mismo nivel (p. ej. "Must Have (Crítica)", "Could Have (Baja)"). Este calificador es informativo y no reemplaza el nivel base de MoSCoW. |
| **QA** | Quality Assurance (Garantía de Calidad de Software). |
| **Gherkin** | Lenguaje DSL formateado en Dado/Cuando/Entonces para pruebas de comportamiento (BDD). |
| **CU** | Caso de Uso. |

### 1.4. Referencias

1. IEEE Std 830-1998: IEEE Recommended Practice for Software Requirements Specifications.
2. Documento fuente: "HISTORIAS DE USUARIO - Sistema de Gestión de Clínica Médica" (Autores: Fabián Trujillo, Alexandra Garzón) — base de todas las épicas, HU y criterios de aceptación de este documento.
3. Stack tecnológico definido por el equipo: backend Java, frontend HTML/CSS/JavaScript.

### 1.5. Visión General del Documento

Este documento está estructurado según la norma IEEE 830-1998. La Sección 2 brinda una vista contextual de alto nivel. La Sección 3 (núcleo del documento) contiene la especificación detallada, unívoca y verificable de los requisitos funcionales y no funcionales, derivada directamente de nuestras Historias de Usuario. La Sección 4 aporta los apéndices técnicos: navegación web, registro de decisiones, casos de uso y cuestiones abiertas.

## 2. DESCRIPCIÓN GENERAL

### 2.1. Perspectiva del Producto

El producto es una **aplicación web cliente-servidor**: el frontend (HTML, CSS, JavaScript) se ejecuta en el navegador del usuario y consume la lógica de negocio expuesta por el backend (Java), el cual gestiona el flujo de atención clínica y la persistencia de datos.

```
+-----------------------------+        +--------------------------------------+
|   FRONTEND (Navegador)      |  HTTP  |         BACKEND (Java)               |
|   HTML + CSS + JavaScript   +------->+  Lógica de negocio y validaciones    |
+-----------------------------+        |                                       |
                                        |  +------------+  +----------------+  |
                                        |  | Pacientes  |  |   Médicos      |  |
                                        |  +-----+------+  +-------+--------+  |
                                        |        |                 |          |
                                        |        +--------+--------+          |
                                        |                 |                   |
                                        |         +-------v--------+          |
                                        |         |     Citas      |          |
                                        |         +-------+--------+          |
                                        |                 |                   |
                                        |         +-------v--------+          |
                                        |         | Historia Clínica|         |
                                        |         +----------------+          |
                                        +---------------------------------------+
                                                        |
                                                +-------v--------+
                                                |  Persistencia   |
                                                | (BD relacional  |
                                                |  o en memoria)  |
                                                +----------------+
```

### 2.2. Funciones del Producto

A alto nivel, el sistema proporciona las siguientes funciones agrupadas por módulos, todas accedidas mediante la interfaz web:

1. **Gestión de Pacientes:** Registrar nuevos pacientes, consultar listado general y actualizar datos de contacto/dirección.
2. **Gestión de Médicos:** Registrar personal médico, listar médicos registrados y eliminar/dar de baja a un médico (verificando la inexistencia de citas activas agendadas).
3. **Gestión de Citas:** Agendar citas validando existencia de entidades y disponibilidad de horario del médico; cancelar citas preexistentes.
4. **Historia Clínica:** Registrar diagnósticos y tratamientos derivados de una atención médica previa vinculada a una cita; consultar el historial clínico cronológico por paciente.
5. **Navegación:** Interfaz web con secciones/páginas correspondientes a cada uno de los 4 módulos anteriores, permitiendo moverse entre ellos desde una pantalla principal (ver Apéndice 4.1).

Dejamos "Reportes del Sistema" fuera del alcance del MVP (ver 2.6): todavía no tenemos una Historia de Usuario que lo respalde, así que preferimos no comprometerlo como requisito hasta escribirla.

### 2.3. Características de los Usuarios

| Rol de Usuario | Descripción y Responsabilidades | Nivel Técnico |
|---|---|---|
| **Recepcionista** | Usuario operativo. Encargado de matricular pacientes, gestionar citas y actualizar datos de contacto. | Medio - Bajo |
| **Médico** | Usuario especialista. Encargado de consultar listados, revisar historial clínico y registrar diagnósticos/tratamientos. | Medio |
| **Administrador del Sistema** | Encargado de la gestión de personal médico, mantenimiento, alta/baja de profesionales. | Medio - Alto |

Todavía no tenemos autenticación/autorización en el MVP (ver 2.6), así que por ahora estos roles son conceptuales: cómo se selecciona el rol activo en la interfaz web queda pendiente de decidir (Apéndice 4.4, Ítem 5).

### 2.4. Restricciones

- **Dominio / Reglas de Negocio:** No se permite la eliminación de médicos que tengan citas en estado AGENDADA.
- **Integridad de Datos:** No se permite el agendamiento de dos citas para el mismo médico en la misma fecha y hora (conflicto de agenda).
- **Flujo Clínico:** No se permite registrar una consulta médica (diagnóstico y tratamiento) si no existe una cita asociada entre el paciente y el médico.
- **Formato de Teléfono:** Numérico estricto, con una longitud mínima de 7 dígitos. Todavía no hemos definido un máximo (Apéndice 4.4, Ítem 2).

### 2.5. Suposiciones y Dependencias

- Asumimos que el ID de pacientes, médicos y citas son únicos dentro del sistema (Primary Keys).
- Asumimos una ejecución con almacenamiento en memoria o base de datos relacional local para garantizar las relaciones entre Paciente, Médico, Cita y Consulta.
- Asumimos comunicación HTTP entre el frontend (HTML/CSS/JS) y el backend (Java); el protocolo/formato exacto (p. ej. API REST con JSON) lo definimos como equipo más adelante (Apéndice 4.4, Ítem 6).

### 2.6. Requisitos Futuros

- **Reportes del Sistema:** generación de métricas operativas (total de citas por estado, volumen de atenciones por médico, consolidado de pacientes). Lo dejamos para una fase posterior al MVP; si decidimos incluirlo antes, hay que escribir la Historia de Usuario correspondiente.
- Integración con módulo de facturación y cobro de consultas.
- Sistema de notificaciones automáticas por correo electrónico o WhatsApp para recordatorio de citas.
- Roles de usuario con autenticación mediante JWT o OAuth2 y control de acceso basado en roles (RBAC).

## 3. REQUISITOS ESPECÍFICOS

### 3.1. Interfaces Externas

- **Interfaz de Usuario (Web):** Frontend construido en HTML, CSS y JavaScript. Todavía no hemos decidido si usamos un framework de frontend (Angular, React, Vue, etc.); mientras tanto asumimos JavaScript sin framework.
- **Interfaz de Software (Backend):** Aplicación en Java responsable de la lógica de negocio, validaciones y persistencia. El framework Java (Spring, Jakarta EE, Servlets puros, etc.) todavía no lo definimos (Apéndice 4.4, Ítem 6).
- **Comunicación Frontend–Backend:** vía HTTP; el formato de intercambio (p. ej. JSON sobre una API REST) lo definimos como parte del diseño técnico.
- **Interfaz de Persistencia:** motor de persistencia (SQL/NoSQL o repositorio en memoria), según lo definido en 2.5.

### 3.2. Requisitos Funcionales

#### 3.2.1. Épica 1: Gestión de Pacientes

**[RF-01] Registrar Paciente (Prioridad: Must Have / HU-01)**

*Descripción:* El sistema debe permitir el registro de un nuevo paciente requiriendo ID, nombre, edad, teléfono y dirección.

- **RF-01.1 (Exitoso):** Dado que el usuario está en el módulo de pacientes, cuando ingresa un ID único, nombre válido, edad, teléfono (numérico de mínimo 7 dígitos) y dirección, entonces el sistema guarda al paciente y muestra confirmación.
- **RF-01.2 (Validación Teléfono):** Dado que se ingresa un teléfono con letras o menos de 7 dígitos, cuando se intenta registrar, entonces el sistema despliega un mensaje de error y no persiste el registro.
- **RF-01.3 (Validación Nombre):** Dado que se deja el campo de nombre vacío, cuando se intenta registrar, entonces el sistema bloquea el flujo solicitando un valor válido.

**[RF-02] Consultar Pacientes (Prioridad: Must Have / HU-02)**

*Descripción:* El sistema debe listar la totalidad de pacientes almacenados con sus datos principales.

- **RF-02.1:** Dado que existen pacientes registrados, cuando se ejecuta "Consultar pacientes", entonces el sistema muestra el listado con ID, Nombre, Edad, Teléfono y Dirección.
- **RF-02.2:** Dado que no hay pacientes registrados, cuando se ejecuta "Consultar pacientes", entonces se muestra el mensaje: "No hay registros de pacientes disponibles".

**[RF-03] Actualizar Datos de Paciente (Prioridad: Should Have / HU-03)**

*Descripción:* El sistema debe permitir modificar los datos de contacto/dirección de un paciente mediante su ID.

- **RF-03.1:** Dado un ID de paciente existente, cuando se modifican uno o más campos válidos, entonces el sistema actualiza únicamente dichos campos y muestra confirmación.
- **RF-03.2:** Dado un ID de paciente inexistente, cuando se intenta actualizar, entonces se notifica "Paciente no encontrado".

#### 3.2.2. Épica 2: Gestión de Médicos

**[RF-04] Registrar Médico (Prioridad: Must Have / HU-04)**

*Descripción:* El sistema debe registrar un profesional médico con ID, nombre, edad, teléfono y especialidad.

- **RF-04.1:** Dado un ID único, nombre, edad dentro del rango laboral permitido *(proponemos 18 a 99 años; todavía no lo confirmamos como equipo, ver Apéndice 4.4, Ítem 1)*, teléfono válido y especialidad no vacía, cuando se confirma el registro, entonces el sistema lo guarda satisfactoriamente.
- **RF-04.2:** Dado una edad fuera de rango, cuando se intenta registrar, entonces el sistema solicita nuevamente el dato.
- **RF-04.3:** Dado la especialidad vacía, cuando se intenta registrar, entonces el sistema exige ingresar un valor no nulo.

**[RF-05] Consultar Médicos (Prioridad: Must Have / HU-05)**

*Descripción:* Muestra la lista de médicos disponibles en la clínica.

- **RF-05.1:** Dado que hay médicos guardados, cuando se consulta la opción, entonces despliega ID, Nombre, Edad, Teléfono y Especialidad.
- **RF-05.2:** Dado la ausencia de médicos, cuando se consulta, entonces se emite el mensaje "No hay médicos registrados".

**[RF-06] Eliminar Médico (Prioridad: Could Have (Baja) / HU-06)**

*Descripción:* Permite dar de baja un médico evaluando integridad referencial y de agenda.

- **RF-06.1:** Dado un ID de médico existente sin citas futuras en estado AGENDADA, cuando se confirma la eliminación, entonces el sistema remueve el registro.
- **RF-06.2:** Dado un ID de médico existente con citas futuras AGENDADA, cuando se intenta eliminar, entonces el sistema rechaza la operación e instruye reasignar o cancelar dichas citas.
- **RF-06.3:** Dado un ID no existente, cuando se solicita eliminar, entonces reporta error.

#### 3.2.3. Épica 3: Gestión de Citas

**[RF-07] Agendar Cita (Prioridad: Must Have (Crítica) / HU-07)**

*Descripción:* Creación de vínculo de atención entre un Paciente y un Médico en una Fecha/Hora dada.

- **RF-07.1:** Dado ID Paciente válido, ID Médico válido, Fecha y Hora sin colisión, cuando se agenda, entonces se genera la cita con ID único y estado AGENDADA.
- **RF-07.2:** Dado un ID de Paciente o Médico inexistente, cuando se intenta agendar, entonces el sistema cancela el proceso informando la invalidez del id.
- **RF-07.3:** Dado un formato erróneo de Fecha/Hora (p. ej. letras o fechas pasadas), cuando se ingresa, entonces se solicita reingreso de formato correcto.
- **RF-07.4 (Conflicto de Agenda):** Dado que el médico ya posee una cita en estado AGENDADA exactamente en la misma Fecha y Hora, cuando se procesa la solicitud, entonces el sistema rechaza el agendamiento emitiendo una alerta de sobreagendamiento.

**[RF-08] Cancelar Cita (Prioridad: Should Have / HU-08)**

*Descripción:* Transición de estado de una cita activa a cancelada.

- **RF-08.1:** Dado un ID de cita en estado AGENDADA, cuando se procesa la cancelación, entonces cambia su estado a CANCELADA.
- **RF-08.2:** Dado un ID de cita inexistente o previamente CANCELADA, cuando se solicita la acción, entonces el sistema notifica la imposibilidad de la operación.

Nos falta decidir qué pasa si alguien intenta cancelar una cita que ya quedó en estado ATENDIDA; lo dejamos para conversarlo como equipo (Apéndice 4.4, Ítem 3).

#### 3.2.4. Épica 4: Historia Clínica

**[RF-09] Registrar Diagnóstico y Tratamiento (Prioridad: Must Have / HU-09)**

*Descripción:* Permite al médico documentar la atención brindada a un paciente asociada a una cita previa.

- **RF-09.1:** Dado un ID de paciente válido y un ID de médico válido, con una cita asociada entre ambos, junto con fecha, diagnóstico y tratamiento, cuando se guarda, entonces se anexa una nueva entrada a la Historia Clínica del paciente y la cita asociada pasa a estado ATENDIDA.
- **RF-09.2:** Dado un ID de paciente o médico inexistente, o ausencia de una cita asociada entre ambos, cuando se intenta guardar, entonces el sistema arroja un error de validación.

**[RF-10] Consultar Historial Clínico (Prioridad: Must Have / HU-10)**

*Descripción:* Recuperación y ordenamiento del expediente clínico de un paciente.

- **RF-10.1:** Dado un ID de paciente con atenciones previas, cuando se consulta su historial, entonces el sistema retorna la lista cronológica de consultas (Fecha, Médico, Diagnóstico, Tratamiento).
- **RF-10.2:** Dado un ID de paciente válido sin atenciones, cuando se consulta, entonces informa "El paciente no registra entradas en su historial clínico".
- **RF-10.3:** Dado un ID de paciente no registrado, cuando se consulta, entonces emite alerta de paciente no encontrado.

### 3.3. Requisitos de Rendimiento

- **Tiempo de Respuesta:** Las búsquedas, registros y validaciones de solapamiento en memoria/BD deben resolverse en menos de 200 ms por transacción.
- **Capacidad:** El sistema en esta fase MVP debe soportar la gestión simultánea de al menos 1,000 pacientes, 100 médicos y 5,000 citas sin degradación de rendimiento.

### 3.4. Restricciones de Diseño

- **Tecnología de Backend:** Java.
- **Tecnología de Frontend:** HTML, CSS y JavaScript.
- **Paradigma de Programación:** Orientado a Objetos (POO), natural en Java, garantizando encapsulamiento, abstracción y modularidad en la capa de backend.
- **Consistencia:** Manejo explícito de excepciones y aprovechamiento del tipado fuerte de Java para evitar fallos en tiempo de ejecución.

### 3.5. Atributos del Sistema (Requisitos No Funcionales)

- **Mantenibilidad:** Arquitectura limpia en capas en el backend (Servicios/Lógica de Negocio, Dominio/Modelos, Persistencia/DAO) más una capa de presentación web, para facilitar pruebas y escalabilidad.
- **Fiabilidad:** Las reglas de negocio (p. ej. solapamiento de horarios y eliminación de médicos) deben ser probadas con una cobertura de pruebas unitarias superior al 85%.
- **Usabilidad:** Interfaz web intuitiva, clara y con mensajes descriptivos de éxito/error.

### 3.6. Otros Requisitos

- **Manejo de Errores y Logs:** Ninguna excepción no controlada (p. ej. `NullPointerException`, `IndexOutOfBoundsException`) debe detener abruptamente la ejecución del backend. Todo error debe ser capturado y presentado como mensaje amable al usuario en el frontend.

## 4. APÉNDICES

### 4.1. Apéndice A: Estructura de Navegación Web

Sitemap del frontend, alineado a nuestros 4 módulos:

```
Inicio (Home)
 ├── Pacientes
 │     ├── Registrar paciente        (RF-01)
 │     ├── Consultar pacientes       (RF-02)
 │     └── Actualizar paciente       (RF-03)
 ├── Médicos
 │     ├── Registrar médico          (RF-04)
 │     ├── Consultar médicos         (RF-05)
 │     └── Eliminar médico           (RF-06)
 ├── Citas
 │     ├── Agendar cita              (RF-07)
 │     └── Cancelar cita             (RF-08)
 └── Historia Clínica
       ├── Registrar diagnóstico/tratamiento (RF-09)
       └── Consultar historial clínico       (RF-10)
```

El diseño visual (layout, componentes, framework de frontend) todavía no lo hemos definido; este apéndice describe solo la estructura de navegación, no el diseño gráfico.

### 4.2. Apéndice B: Registro de Cambios y Decisiones

Este registro documenta los ajustes que hicimos entre versiones del ERS, para que quede memoria de por qué el documento se ve como se ve hoy.

**V2 → V3:**

| # | Sección | Qué encontramos | Qué decidimos |
|---|---|---|---|
| 1 | Sección 4 | La Tabla de Contenido prometía apéndices que no estaban desarrollados en el cuerpo del documento. | Redactamos la Sección 4 completa. |
| 2 | RF-07 | Usábamos "Must Have - Crítica", que no encajaba en la escala MoSCoW tal como la habíamos definido. | La normalizamos a "Must Have" *(ajustado de nuevo en V4, ver Ítem 13)*. |
| 3 | Diagrama 2.1 | El diagrama no incluía el módulo de Reportes, que sí mencionábamos en el texto. | Lo agregamos al diagrama *(retirado de nuevo en V4, ver Ítem 10)*. |
| 4 | RF-09.1 | Dejábamos dos formas distintas de identificar la atención (ID de cita o paciente+médico), sin decir cuál usar. | Fijamos el ID de cita como identificador único *(corregido en V4, ver Ítem 11)*. |
| 5 | RF-01.2 / 2.4 | Solo definíamos un mínimo de dígitos para el teléfono, sin máximo. | Agregamos un rango de 7 a 10 dígitos *(revertido en V4, ver Ítem 12)*. |
| 6 | RF-08 | No contemplábamos qué pasa si alguien cancela una cita ya ATENDIDA. | Agregamos RF-08.3 con un rechazo automático *(retirado en V4, ver Ítem 14)*. |
| 7 | Sección 2.2 | Decíamos "6 secciones principales" sin que el número cuadrara con los módulos documentados. | Ajustamos la descripción y la detallamos en el Apéndice A. |
| 8 | Metadatos | Marcábamos el documento como "revisado y corregido" sin dejar registro de qué se corrigió. | Empezamos este registro de cambios. |

**V3 → V4** (después de revisar de nuevo las Historias de Usuario y de definir la arquitectura del MVP):

| # | Sección | Qué encontramos | Qué decidimos |
|---|---|---|---|
| 9 | 2.1, 2.2, 3.1, 3.4, Apéndice A | Todo el documento asumía un menú de consola (CLI). | Actualizamos arquitectura e interfaces a una aplicación web: backend Java, frontend HTML/CSS/JavaScript. El Apéndice A pasó de "menú CLI" a "estructura de navegación web". |
| 10 | 2.2, 3.2.5, Diagrama 2.1 | Teníamos una Épica de "Reportes del Sistema" (RF-11) sin ninguna Historia de Usuario que la respaldara. | La sacamos del alcance comprometido del MVP y la pasamos a "Requisitos Futuros" (2.6). |
| 11 | RF-09.1 | En V3 habíamos fijado el ID de cita como identificador único, pero al revisar HU-09 vimos que en realidad identificamos la atención por paciente + médico con cita asociada. | Corregimos RF-09 para que coincida con la Historia de Usuario real. |
| 12 | RF-01.2 / 2.4 | El máximo de 10 dígitos que habíamos puesto en V3 no salía de ninguna historia de usuario ni de una decisión de equipo. | Lo quitamos; dejamos solo el mínimo de 7 dígitos y anotamos el máximo como pendiente. |
| 13 | RF-06, RF-07 | En V3 quitamos los calificadores "(Crítica)" y "(Baja)" pensando que eran un error, pero es una convención que usamos consistentemente en las HU. | Los restauramos y los documentamos en 1.3. |
| 14 | RF-08 | En V3 agregamos RF-08.3 (rechazar cancelar una cita ATENDIDA) sin haberlo discutido como equipo. | Lo bajamos de requisito formal a pregunta abierta (Apéndice 4.4, Ítem 3). |
| 15 | RF-04.1 | El rango de edad del médico (18-99) nunca lo pusimos por escrito en una historia de usuario. | Lo dejamos marcado como propuesta pendiente de confirmar (Apéndice 4.4, Ítem 1). |

### 4.3. Apéndice C: Especificación de Casos de Uso

*(Usamos la plantilla que definimos como equipo, aplicada a los 10 requisitos funcionales que sí tienen Historia de Usuario.)*

**CU-01**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Registrar Paciente |
| **Identificador** | CU-01 |
| **Actores** | Recepcionista |
| **Tipo** | Primario (Must Have) |
| **Referencias** | RF-01 / HU-01 |
| **Precondición** | El usuario tiene acceso a la sección "Pacientes" de la interfaz web. |
| **Postcondición** | El paciente queda registrado con un ID único, disponible para agendar citas y futuras consultas o actualizaciones. |
| **Descripción** | **Flujo básico:** 1) El recepcionista accede a "Registrar paciente". 2) El sistema solicita ID, nombre, edad, teléfono y dirección. 3) El recepcionista ingresa los datos. 4) El sistema valida el teléfono (numérico, mínimo 7 dígitos) y que el nombre no esté vacío. 5) El sistema guarda el paciente y confirma. **Flujos alternos:** A1 (teléfono inválido) → error, no se guarda; A2 (nombre vacío) → se bloquea el guardado. |
| **Resumen** | Permite registrar un nuevo paciente con sus datos básicos para que pueda ser atendido en la clínica. |

**CU-02**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Consultar Pacientes |
| **Identificador** | CU-02 |
| **Actores** | Recepcionista, Médico |
| **Tipo** | Primario (Must Have) |
| **Referencias** | RF-02 / HU-02 |
| **Precondición** | El usuario ha accedido a la sección "Pacientes". |
| **Postcondición** | Se muestra el listado de pacientes (o el mensaje de ausencia de registros); no se modifican datos. |
| **Descripción** | **Flujo básico:** 1) El usuario selecciona "Consultar pacientes". 2) El sistema recupera todos los pacientes. 3) Se muestran ID, nombre, edad, teléfono y dirección. **Flujo alterno:** A1 (sin registros) → mensaje "No hay registros de pacientes disponibles". |
| **Resumen** | Permite visualizar el listado completo de pacientes registrados. |

**CU-03**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Actualizar Datos de Paciente |
| **Identificador** | CU-03 |
| **Actores** | Recepcionista |
| **Tipo** | Secundario (Should Have) |
| **Referencias** | RF-03 / HU-03 |
| **Precondición** | Debe existir el paciente y el usuario conoce su ID. |
| **Postcondición** | Los campos de contacto/dirección quedan actualizados; el resto de la información permanece intacta. |
| **Descripción** | **Flujo básico:** 1) Se ingresa el ID del paciente. 2) El sistema verifica que exista. 3) Se modifican uno o más campos. 4) El sistema guarda y confirma. **Flujo alterno:** A1 (ID inexistente) → "Paciente no encontrado", sin cambios. |
| **Resumen** | Permite mantener actualizados los datos de contacto de un paciente ya registrado. |

**CU-04**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Registrar Médico |
| **Identificador** | CU-04 |
| **Actores** | Administrador del Sistema |
| **Tipo** | Primario (Must Have) |
| **Referencias** | RF-04 / HU-04 |
| **Precondición** | El usuario tiene acceso a la sección "Médicos". |
| **Postcondición** | El médico queda registrado con un ID único, disponible para ser asignado a citas. |
| **Descripción** | **Flujo básico:** 1) Se selecciona "Registrar médico". 2) El sistema solicita ID, nombre, edad, teléfono y especialidad. 3) Se ingresan los datos. 4) El sistema valida rango de edad *(propuesto 18–99, pendiente de confirmar)* y especialidad no vacía. 5) Se guarda y confirma. **Flujos alternos:** A1 (edad fuera de rango) → se solicita de nuevo; A2 (especialidad vacía) → se exige valor. |
| **Resumen** | Permite registrar un nuevo profesional médico en la clínica. |

**CU-05**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Consultar Médicos |
| **Identificador** | CU-05 |
| **Actores** | Recepcionista |
| **Tipo** | Primario (Must Have) |
| **Referencias** | RF-05 / HU-05 |
| **Precondición** | El usuario ha accedido a la sección "Médicos". |
| **Postcondición** | Se muestra el listado de médicos (o el mensaje de ausencia de registros). |
| **Descripción** | **Flujo básico:** 1) Se selecciona "Consultar médicos". 2) El sistema recupera los médicos. 3) Se muestran ID, nombre, edad, teléfono y especialidad. **Flujo alterno:** A1 (sin registros) → "No hay médicos registrados". |
| **Resumen** | Permite visualizar el listado de médicos disponibles para asignación de citas. |

**CU-06**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Eliminar Médico |
| **Identificador** | CU-06 |
| **Actores** | Administrador del Sistema |
| **Tipo** | Opcional (Could Have - Baja) |
| **Referencias** | RF-06 / HU-06 |
| **Precondición** | Debe existir el médico y el usuario conoce su ID. |
| **Postcondición** | El médico queda eliminado si no tiene citas AGENDADA; en caso contrario, no se modifica ningún dato. |
| **Descripción** | **Flujo básico:** 1) Se ingresa el ID del médico. 2) El sistema verifica que exista y no tenga citas AGENDADA. 3) Se elimina y confirma. **Flujos alternos:** A1 (citas activas) → se rechaza, se solicita reasignar/cancelar; A2 (ID inexistente) → error, sin cambios. |
| **Resumen** | Permite dar de baja a un médico que ya no labora en la clínica, si no tiene compromisos de agenda activos. |

**CU-07**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Agendar Cita |
| **Identificador** | CU-07 |
| **Actores** | Recepcionista |
| **Tipo** | Primario (Must Have - Crítica) |
| **Referencias** | RF-07 / HU-07 |
| **Precondición** | El paciente y el médico deben existir previamente en el sistema. |
| **Postcondición** | Se crea una nueva cita con ID único y estado AGENDADA. |
| **Descripción** | **Flujo básico:** 1) Se ingresan ID de paciente, ID de médico, fecha y hora. 2) Se valida existencia de ambos. 3) Se valida formato de fecha/hora y que no sea pasada. 4) Se valida que el médico no tenga otra cita AGENDADA en ese horario. 5) Se crea la cita y confirma. **Flujos alternos:** A1 (entidad inexistente) → se cancela el proceso; A2 (formato inválido) → se solicita reingreso; A3 (conflicto de agenda) → se rechaza con alerta de sobreagendamiento. |
| **Resumen** | Permite crear el vínculo de atención entre un paciente y un médico en una fecha y hora específicas. |

**CU-08**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Cancelar Cita |
| **Identificador** | CU-08 |
| **Actores** | Recepcionista |
| **Tipo** | Secundario (Should Have) |
| **Referencias** | RF-08 / HU-08 |
| **Precondición** | Debe existir una cita previamente agendada. |
| **Postcondición** | La cita cambia a estado CANCELADA si procede; en caso contrario, su estado no se modifica. |
| **Descripción** | **Flujo básico:** 1) Se ingresa el ID de la cita. 2) El sistema verifica que exista y esté AGENDADA. 3) Se cambia el estado a CANCELADA y confirma. **Flujo alterno:** A1 (inexistente o ya cancelada) → se notifica que la operación no es posible. *(Todavía nos falta decidir qué pasa con una cita ATENDIDA, ver Apéndice 4.4, Ítem 3.)* |
| **Resumen** | Permite liberar un espacio de agenda cuando el paciente no puede asistir a una cita ya programada. |

**CU-09**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Registrar Diagnóstico y Tratamiento |
| **Identificador** | CU-09 |
| **Actores** | Médico |
| **Tipo** | Primario (Must Have) |
| **Referencias** | RF-09 / HU-09 |
| **Precondición** | El paciente y el médico deben existir, con una cita asociada entre ambos. |
| **Postcondición** | Se anexa una nueva entrada a la historia clínica del paciente y la cita asociada pasa a ATENDIDA. |
| **Descripción** | **Flujo básico:** 1) El médico ingresa ID de paciente, ID de médico, fecha, diagnóstico y tratamiento. 2) El sistema valida existencia de ambos y de una cita asociada. 3) Se guarda el registro y se actualiza la cita a ATENDIDA. 4) Se confirma. **Flujo alterno:** A1 (datos inválidos o sin cita asociada) → error, no se guarda. |
| **Resumen** | Permite al médico dejar constancia formal de la atención brindada a un paciente. |

**CU-10**

| Campo | Detalle |
|---|---|
| **Caso de Uso** | Consultar Historial Clínico |
| **Identificador** | CU-10 |
| **Actores** | Médico |
| **Tipo** | Primario (Must Have) |
| **Referencias** | RF-10 / HU-10 |
| **Precondición** | El usuario conoce el ID del paciente a consultar. |
| **Postcondición** | Se muestra el historial clínico del paciente (o el mensaje correspondiente); no se modifican datos. |
| **Descripción** | **Flujo básico:** 1) Se ingresa el ID del paciente. 2) El sistema verifica que exista. 3) Se recuperan y ordenan cronológicamente las entradas. 4) Se muestran fecha, médico, diagnóstico y tratamiento. **Flujos alternos:** A1 (sin historial) → se informa que no hay entradas; A2 (paciente inexistente) → alerta de no encontrado. |
| **Resumen** | Permite a un médico revisar el historial médico completo de un paciente antes de atenderlo. |

### 4.4. Apéndice D: Cuestiones Abiertas y Supuestos Pendientes de Validación

Estos puntos los dejamos abiertos a propósito para discutirlos como equipo antes de pasar a diseño/construcción:

1. **Rango de edad del médico (18–99 años):** lo propusimos por practicidad, pero nunca lo pusimos por escrito en una historia de usuario. Confirmar el rango real.
2. **Longitud máxima del teléfono:** solo tenemos el mínimo de 7 dígitos. Definir si aplica un máximo y cuál.
3. **Cancelación de una cita en estado ATENDIDA:** no la contemplamos en HU-08. Definir si debe rechazarse, permitirse, o requerir una confirmación especial.
4. **Alcance de "Reportes del Sistema":** todavía no tiene una historia de usuario. Decidir si entra al MVP (y en tal caso escribir la HU) o si se queda como trabajo futuro.
5. **Diferenciación de roles sin autenticación:** tenemos los roles definidos (2.3), pero el RBAC es trabajo futuro (2.6). Definir cómo se selecciona el rol activo en la interfaz web mientras no haya autenticación real (p. ej. un selector simple sin control de seguridad).
6. **Detalles técnicos del stack:** framework de frontend (si usamos alguno), framework de backend en Java (Spring, Jakarta EE, Servlets, etc.) y formato de comunicación (p. ej. API REST con JSON). Definirlos antes de arrancar el diseño técnico detallado.
