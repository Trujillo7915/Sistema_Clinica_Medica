# 09. Módulo de Mensajes de Error, Confirmación y Estados del Sistema (SGCM)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Mensajes de Error, Confirmación y Feedback Visual  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** Reglas de Negocio RN-01 a RN-08 | RNF-02 (Usabilidad y Cero Pérdida de Datos) | Manejo de Excepciones  

---

## 📌 1. Propósito del Módulo

Garantizar una comunicación transparente, inequívoca y oportuna entre el sistema y el usuario clínico. Todo evento relevante (éxito, advertencia operativa, error de validación o confirmación destructiva) cuenta con un patrón visual estandarizado que protege la integridad de los datos asistenciales.

---

## 💬 2. Catálogo de Patrones de Feedback y Notificación

### 2.1. Modales de Confirmación Crítica
- **Modal de Cancelación de Cita (RN-03):**
  - **Encabezado:** Ícono de alerta ámbar/rojo con título "*¿Confirmar cancelación de cita médica?*".
  - **Cuerpo:** Identificación del paciente, médico, fecha y hora de la cita a cancelar. Campo de texto obligatorio para ingresar el *Motivo de Cancelación* (ej. "Inasistencia del paciente", "Urgencia médica").
  - **Botones:** Botón secundario "*Conservar Cita*" y botón destructivo "*Confirmar y Liberar Cupo*" (Rojo `#DC2626`).
- **Modal de Descarte de Cambios Clínicos:**
  - Se activa si el médico intenta abandonar la ficha de consulta con signos vitales o diagnósticos sin guardar.
  - Opciones: "*Continuar Editando*" vs "*Descartar Cambios*".

### 2.2. Notificaciones Flotantes (Toast Notifications)
Ubicadas en la esquina superior derecha en Desktop y como banner flotante inferior (*SnackBar*) en Mobile:

| Tipo de Toast | Color de Acento | Icono | Duración | Ejemplo de Uso |
| :--- | :---: | :---: | :---: | :--- |
| **Éxito (Success)** | Verde `#047857` / `#D1FAE5` | `check_circle` | 4 segundos | *"Paciente PAC-1020029712 registrado correctamente en el sistema."* |
| **Advertencia (Warning)** | Ámbar `#D97706` / `#FEF3C7` | `warning` | 6 segundos | *"El paciente tiene tiempo de espera en sala superior a 20 minutos."* |
| **Error (Danger)** | Rojo `#DC2626` / `#FEE2E2` | `error` | Persistente (requiere cierre manual) | *"Conflicto de horario: El Dr. Gómez ya tiene una cita asignada en ese bloque (RN-02)."* |
| **Informativo (Info)** | Azul `#016398` / `#E0F2FE` | `info` | 4 segundos | *"Sesión clínica sincronizada con el servidor central."* |

### 2.3. Validación Inline en Formularios
- **Campo Válido:** Borde sutil neutro Slate-300 o verde suave al perder foco.
- **Campo Inválido:** Borde rojo `#DC2626`, fondo tenue `#FEF2F2`, icono de error en el extremo derecho del input y texto descriptivo bajo el campo con peso 500 (12px).
- **Prevención de Envío:** El botón de acción permanece deshabilitado o muestra un resumen accesible de campos pendientes arriba del botón.

### 2.4. Estados Vacíos (Empty States)
Cuando una tabla o listado no contiene datos, se muestra una ilustración clínica estilizada, título empático y botón de acción sugerida:
- *Agenda sin citas:* "No hay citas programadas para esta fecha" + Botón "*+ Agendar Cita*".
- *Búsqueda sin coincidencias:* "No se encontraron pacientes con el documento ingresado" + Botón "*+ Registrar Paciente*".
- *Sala de espera vacía:* "Todos los pacientes han sido atendidos o se encuentran en consultorio".

### 2.5. Pantallas de Error del Sistema (HTTP Status)
- **Error 404 (No Encontrado):** "La ruta o ficha solicitada no existe o fue reubicada". Botón "*Volver al Dashboard*".
- **Error 403 (Acceso Denegado):** "No cuenta con los privilegios requeridos para acceder a este módulo clínico".
- **Error 500 (Error del Servidor):** "Ocurrió una inconsistencia en el servidor. El código de incidente fue registrado para auditoría". Botón "*Reintentar Operación*".

---

## 🖥️ 3. Especificación Desktop ($1440 \times 900$ px)

- Los modales utilizan un fondo oscuro semitransparente con desenfoque (*backdrop-blur-sm*) que enfoca la atención del usuario.
- Ancho de modal estándar de 520px para confirmaciones y 720px para formularios modales.
- Tecla `Escape` cierra modales no destructivos; las confirmaciones críticas requieren clic explícito en botones.

---

## 📱 4. Especificación Mobile ($390 \times 844$ px)

- Los modales críticos se adaptan a **Bottom Sheets** táctiles anclados a la parte inferior de la pantalla.
- Botones de acción en ancho completo apilados verticalmente (acción principal arriba con 48px de altura, cancelar abajo).
- Toasts aparecen en la zona inferior con elevación shadow-lg respetando el margen de la Bottom Navigation Bar.

---

## 📂 5. Directorios de Assets y Prototipos

- `desktop/`: Mockups de modales de confirmación, toasts flotantes y empty states en desktop.
- `mobile/`: Mockups de bottom sheets de error, alertas y notificaciones adaptadas a smartphones.
