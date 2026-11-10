# 🏥 CliniGest SGCM - Mockup Interactivo de Alta Fidelidad

> **Fase:** Fase 5 – UI/UX & Prototipado Clínico  
> **Design System:** *Clinical Clarity* (`#002C3A`, `#016398`, `#0D5C75`, `#F8FAFC`)  
> **Tecnologías:** HTML5 Semántico + Tailwind CSS CDN + JavaScript ES6 (LocalStorage Persistence)  
> **Estado:** 100% Interactivo y Listo para Pruebas / Evaluación  

---

## 🚀 1. Cómo Probar Localmente (Sin Instalar Nada)

### Opción A (Doble Clic Directo)
Simplemente haz doble clic sobre el archivo [`mockup/index.html`](./index.html) para abrirlo directamente en Google Chrome, Edge, Firefox o Safari.

### Opción B (Servidor Local con Python)
Desde la terminal en la raíz del proyecto, ejecuta:
```bash
python -m http.server 3000
```
Y abre en tu navegador: [http://localhost:3000/mockup/](http://localhost:3000/mockup/)

---

## 🌐 2. Cómo Subir a una Prueba Gratuita (Vercel o Netlify)

El proyecto ya cuenta con las configuraciones [`vercel.json`](../vercel.json) y [`netlify.toml`](../netlify.toml) optimizadas.

### Despliegue en Vercel (1 Clic con GitHub):
1. Ingresa a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. Haz clic en **"Add New..."** &rarr; **"Project"**.
3. Selecciona el repositorio `Trujillo7915/Sistema_Clinica_Medica`.
4. En **Root Directory**, puedes dejarlo en blanco o seleccionar `./mockup`.
5. Haz clic en **"Deploy"**. En 30 segundos tendrás una URL pública gratuita (ej. `clinigest-sgcm.vercel.app`) lista para compartir y evaluar.

### Despliegue en Netlify (Arrastrar y Soltar):
1. Ingresa a [app.netlify.com/drop](https://app.netlify.com/drop).
2. Arrastra la carpeta `mockup` desde tu explorador de archivos directamente a la ventana del navegador.
3. ¡Listo! Netlify te generará una URL instantánea y gratuita sin necesidad de comandos.

---

## 🎯 3. Flujos Clínicos y Funcionalidades Interactivas

El mockup incluye simulación funcional completa de las 10 Historias de Usuario:

1. **Simulador de Dispositivos (Barra Superior):**
   - **🖥️ Desktop (1440px):** Marco de pantalla para estaciones de recepción y boxes médicos.
   - **📱 Móvil (390px):** Marco de smartphone (iPhone 14/15) para personal en ronda médica.
   - **🌐 100% Fluido:** Adaptación responsiva al tamaño completo de la ventana.
2. **Selector de Rol RBAC:**
   - Alterna instantáneamente entre **Médico Especialista (Box 03)**, **Recepción y Admisiones** y **Administrador**.
3. **Persistencia en LocalStorage:**
   - Al registrar un nuevo paciente (HU-01), aparece de inmediato en el directorio (HU-02).
   - Al agendar una cita (HU-07), se valida la regla **RN-02** (prevención de traslapes en bloques de 30 minutos).
   - Al cancelar una cita (HU-08), se activa el **Modal RN-03** exigiendo el motivo obligatorio antes de liberar el cupo.
   - Al atender una consulta médica (HU-09), se registran signos vitales y prescripción, guardándose en el expediente clínico (HU-10).
4. **Búsqueda Global Omnibar (`Ctrl + K`):**
   - Búsqueda predictiva en tiempo real con debouncing clasificando coincidencias por pacientes, médicos y citas.
5. **Catálogo de Toasts Semánticos:**
   - Botones para disparar y probar las notificaciones de Éxito, Advertencia, Error y Sincronización.
