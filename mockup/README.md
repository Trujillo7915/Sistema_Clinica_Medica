# 🏥 CliniGest SGCM — Aplicación Interactiva de Alta Fidelidad (Fase 5 Pre-Release)

> **Fase:** Fase 5 – UI/UX & Prototipado Funcional con Acabado de Producto Final  
> **Design System:** *Clinical Clarity* (`#002C3A`, `#016398`, `#0D5C75`, `#F8FAFC`)  
> **Trazabilidad 100% Completa:** `HU-01` a `HU-10` | `RF-01` a `RF-10` | `RN-01` a `RN-08` | Esquema PostgreSQL 3FN (Fase 4)  
> **Tecnologías:** HTML5 Semántico + Tailwind CSS + JavaScript ES6 (`ClinicStore` con persistencia en `localStorage`)  

---

## ✨ 1. Mejoras y Congruencia Total con el Proyecto Final

1. **Interfaz de Producto Final en Producción (`Modo App Completa` por defecto):**
   - Menú lateral organizado por dominios hospitalarios reales (*Centro de Mando*, *Gestión de Pacientes*, *Agenda y Turnos*, *Historia Clínica EHR*, *Cuerpo Médico & Admin*) con indicadores RBAC y contador en vivo de sala de espera.
   - Simulador integrado en la barra superior para alternar entre **🌐 App Completa (100% Fluido)**, **🖥️ Estación 1440×900** y **📱 Móvil 390px** (con Drawer deslizable y Bottom Navigation Bar).
2. **Pantalla de Login Institucional y Control RBAC Real:**
   - Overlay de autenticación institucional (`🔐 Pantalla Login` o botón de cierre de sesión en el Sidebar) con acceso rápido de 1 clic para **Dr. Roberto Gómez (Médico)**, **Alexandra Garzón (Recepción)** y **Fabián Trujillo (Administrador)**.
3. **Cobertura del 100% de las Historias de Usuario (`HU-01` a `HU-10`) y Reglas (`RN-01` a `RN-08`):**
   - **Portal de Inicio 100% Reactivo:** Todos los KPIs (`Citas Activas`, `En Sala de Espera`, `Consultas en Expediente`, `Facultativos Activos`) y la cola prioritaria se calculan en tiempo real desde `ClinicStore`.
   - **`HU-01`, `HU-02`, `HU-03` (Pacientes):** Cálculo automático de edad al elegir fecha de nacimiento, dirección obligatoria (`RF-01.1`), validación estricta **`RN-04`** (teléfono exclusivamente numérico $\ge 7$ dígitos) y **`RN-01`** (documento único e inmutable).
   - **`HU-04`, `HU-05`, `HU-06` (Médicos):** Campo obligatorio de **Edad Laboral (`18 a 99 años`, `RN-05`)**, filtro por especialidad y **Control de Baja de Facultativo (`HU-06`)** con validación **`RN-08`** (bloquea la baja si el médico tiene citas `AGENDADA` activas y permite la baja si tiene `0` citas pendientes).
   - **`HU-07`, `HU-08` y Matriz de Disponibilidad (`RN-02` / `RN-03`):** Selector dinámico de especialista y fecha que calcula en vivo los bloques libres/ocupados de 30 minutos. Al hacer clic en un bloque libre de la matriz, pre-carga automáticamente el médico, la fecha y la hora en `HU-07`. Al cancelar una cita en `HU-08` con motivo obligatorio (`RN-03`), el bloque queda libre de inmediato.
   - **`HU-09` y `HU-10` (Historia Clínica y Orden Médica):** Selector de cita activa, buscador rápido del catálogo **CIE-10**, transición automática de la cita a **`ATENDIDA` (`RN-06`)**, selector de paciente en el expediente y modal de **🖨️ Vista e Impresión de Orden / Fórmula Médica**.

---

## 🚀 2. Cómo Ejecutar Localmente

1. Haz doble clic directamente sobre [`mockup/index.html`](./index.html) para abrirlo en cualquier navegador moderno, o bien:
2. Levanta un servidor local desde la raíz del repositorio:
   ```bash
   python -m http.server 3000
   ```
   Y abre: `http://localhost:3000/mockup/`
