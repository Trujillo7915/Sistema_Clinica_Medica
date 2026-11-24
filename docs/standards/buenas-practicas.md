# BUENAS PRÁCTICAS DE DESARROLLO Y CLEAN CODE
## Sistema de Gestión de Clínica Médica (SGCM)

Este documento establece las políticas de calidad de código y diseño que todo desarrollador debe acatar en el proyecto.

---

## 1. Principios Fundamentales de Diseño

### 1.1. SOLID
* **S (Single Responsibility Principle):** Cada módulo, clase o función debe tener una única razón para cambiar.
  * *Ejemplo:* Un `CitaController` solo orquesta solicitudes HTTP; la lógica de sobreagendamiento pertenece a `CitaService` y la persistencia a `CitaRepository`.
* **O (Open/Closed Principle):** Las entidades de software deben estar abiertas para extensión, pero cerradas para modificación.
* **L (Liskov Substitution Principle):** Las subclases (ej. `Paciente`, `Medico`) deben ser sustituibles por sus clases base (`Persona`) sin alterar el funcionamiento del sistema.
* **I (Interface Segregation Principle):** Crear interfaces específicas en lugar de interfaces monolíticas.
* **D (Dependency Inversion Principle):** Los módulos de alto nivel no deben depender de módulos de bajo nivel; ambos deben depender de abstracciones (inyección de dependencias).

### 1.2. KISS, DRY y YAGNI
* **KISS (Keep It Simple):** Privilegiar la solución más clara y directa. No sobre-complejizar con patrones no justificados.
* **DRY (Don't Repeat Yourself):** Extraer lógica duplicada en funciones o servicios reutilizables.
* **YAGNI (You Aren't Gonna Need It):** No implementar funcionalidades especulativas o no requeridas por las Historias de Usuario actuales.

---

## 2. Inmutabilidad (Crítico)

* **Regla estricta:** No mutar objetos o estructuras de datos en memoria existentes. Siempre retornar nuevas instancias con los valores modificados (`copy-on-write`).
* **Justificación:** Previene efectos secundarios colaterales (side effects), facilita la depuración y garantiza concurrencia segura en entornos multi-hilo.

```typescript
// ❌ INCORRECTO: Mutación de estado
function cancelarCita(cita: Cita): void {
  cita.estado = 'CANCELADA';
}

//  CORRECTO: Retorno inmutable
function cancelarCita(cita: Cita): Cita {
  return {
    ...cita,
    estado: 'CANCELADA',
    updatedAt: new Date()
  };
}
```

---

## 3. Modularidad, Tamaño y Complejidad Ciclomática

* **Funciones atómicas (<50 líneas):** Cada función debe realizar una tarea concreta, medible y comprensible a simple vista.
* **Límite de tamaño de archivo (<800 líneas):** Dividir módulos grandes en submódulos cohesivos y desacoplados.
* **Profundidad de anidamiento (<4 niveles):** Prohibido el anidamiento excesivo de `if/else`, `loops` o callbacks. Usar **retornos tempranos** (*early returns*).

```typescript
// ❌ INCORRECTO: Anidamiento profundo
function agendar(paciente, medico, fecha) {
  if (paciente) {
    if (medico) {
      if (medico.activo) {
        // Logica...
      }
    }
  }
}

//  CORRECTO: Early returns
function agendar(paciente, medico, fecha) {
  if (!paciente) throw new NotFoundError('Paciente no encontrado');
  if (!medico) throw new NotFoundError('Médico no encontrado');
  if (!medico.activo) throw new BusinessRuleError('El médico no se encuentra activo');

  // Flujo principal limpio
  return crearCita(paciente, medico, fecha);
}
```

---

## 4. Tipado Estricto y Validación en los Límites del Sistema

* **Tipado estricto:** Prohibido el uso de tipos genéricos permisivos (`any` en TypeScript o `Object` genérico sin tipar).
* **Validación en los bordes:** Validar exhaustivamente todo dato externo (parámetros de URL, cuerpos JSON, respuestas de servicios externos) antes de procesarlo en la lógica de negocio mediante esquemas (ej. Zod, Joi, Pydantic o DTOs validados con class-validator).

---

## 5. Manejo Exhaustivo de Errores

* **Nunca silenciar errores:** Queda prohibido el uso de bloques `catch` vacíos o ignorar excepciones.
* **Errores tipados y controlados:** Crear jerarquías de excepciones del dominio (`DomainException`, `EntityNotFoundException`, `ScheduleConflictException`).
* **Mensajes amigables para el usuario:** El cliente debe recibir un mensaje claro sin exponer detalles técnicos sensibles o trazas del servidor (Stack Traces).
