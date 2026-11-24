# REGLAS DEL PROYECTO, CONTROL DE VERSIONES Y SEGURIDAD
## Sistema de Gestión de Clínica Médica (SGCM)

Este documento define el marco normativo y técnico para la colaboración en equipo, ramas en Git, mensajes de commit, seguridad y calidad de pruebas.

---

## 1. Flujo de Ramas en Git (GitFlow Simplificado)

El proyecto opera bajo el siguiente esquema de ramas:
1. **`main`:** Rama protegida de producción. Solo contiene versiones estables y liberadas mediante Pull Request y pruebas aprobadas.
2. **`dev`:** Rama activa de integración de desarrollo. Todo nuevo desarrollo o fase se integra aquí.
3. **`feature/<nombre-feature>`:** Ramas efímeras creadas a partir de `dev` para implementar una Historia de Usuario específica (ej. `feature/hu-07-agendar-cita`).
4. **`fix/<nombre-bug>`:** Corrección puntual de errores identificados en pruebas.

---

## 2. Convención de Mensajes de Commit (Conventional Commits)

Todo commit debe seguir el formato formal:
```
<tipo>(<alcance opcional>): <descripción imperativa en presente>

[cuerpo explicativo opcional]
```

### Tipos Permitidos:
* **`feat:`** Una nueva funcionalidad para el usuario.
* **`fix:`** Corrección de un defecto o bug.
* **`docs:`** Cambios exclusivamente en documentación (markdown, diagramas).
* **`refactor:`** Refactorización de código que no altera el comportamiento externo.
* **`test:`** Adición o corrección de pruebas unitarias o de integración.
* **`chore:`** Tareas rutinarias de configuración, dependencias o tooling.

*Ejemplo:* `feat(citas): implementar validacion de conflicto de horario para medico`

---

## 3. Políticas Obligatorias de Seguridad

* **Cero Secretos en el Repositorio:** Prohibido commitear contraseñas, llaves de API, tokens o cadenas de conexión a base de datos.
  * Todas las credenciales se cargan mediante variables de entorno (`.env`).
  * El archivo `.env` debe estar ignorado en `.gitignore`; en su lugar se debe proveer `.env.example`.
* **Prevención de Inyección SQL:** Todas las consultas a base de datos deben utilizar sentencias preparadas y parámetros vinculados (*parameterized queries*) o a través de un ORM/Query Builder seguro. Jamás concatenar cadenas en consultas SQL.
* **Sanitización contra XSS:** Todo dato renderizado en la interfaz debe sanitizarse para evitar ejecución de scripts maliciosos.

---

## 4. Requisitos y Métricas de Testing

* **Patrón AAA (Arrange - Act - Assert):** Toda prueba unitaria o de integración debe estructurarse en las 3 secciones claras:
  1. **Arrange:** Preparar datos, mocks y dependencias.
  2. **Act:** Ejecutar el método o servicio bajo prueba.
  3. **Assert:** Verificar que el resultado y efectos secundarios cumplan con los criterios de aceptación.
* **Cobertura Mínima Exigida:** **80%+** en lógica de negocio (`Service` y `Domain`).
* **Casos Obligatorios a Cubrir:**
  * Camino feliz (*Happy Path*).
  * Casos límite (*Edge Cases*, ej. edades mínimas y máximas, límites de cadenas).
  * Casos de fallo esperado y manejo de excepciones (*Error Handling*).
