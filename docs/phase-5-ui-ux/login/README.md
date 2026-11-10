# 03. Módulo de Autenticación y Acceso Profesional (Login)

**Fase:** Fase 5 – UI/UX & Prototipado  
**Módulo:** Login / Autenticación Institucional  
**Design System:** *Clinical Clarity*  
**Trazabilidad:** Precondición transversal de seguridad para CU-01 a CU-10 | Control de Acceso Basado en Roles (RBAC: Recepción, Médico, Administrador) | RNF-01 (Seguridad y Privacidad)  

---

## 📌 1. Propósito del Módulo

Garantizar el acceso seguro, cifrado e inequívoco de los profesionales de la clínica al sistema, validando credenciales institucionales y asignando los permisos correspondientes según su rol operativo.

---

## 🎨 2. Componentes y Elementos de Interfaz

1. **Branding e Identidad Institucional:** Logotipo oficial CliniGest con emblema de salud en Primary Deep Cyan `#002C3A`.
2. **Campo de Identificador de Usuario:** Entrada para número de identificación, usuario o correo electrónico corporativo (`@clinigest.com`).
3. **Campo de Contraseña Segura:** Input enmascarado con botón de alternancia de visibilidad (icono de ojo) y soporte para gestores de contraseñas seguros.
4. **Selector de Rol Institucional (opcional para entornos multi-rol):** Dropdown o tabs para Recepción, Médico Asistencial, o Administración.
5. **Acciones:**
   - Botón Principal: **Iniciar Sesión** (`w-full`, color Primary `#002C3A`, hover `#0D5C75`).
   - Enlace secundario: "¿Olvidó su contraseña? Contactar soporte técnico".
6. **Manejo de Errores Visuales:** Alerta inline con borde rojo e icono de advertencia ante credenciales incorrectas o cuenta bloqueada por intentos fallidos.

---

## 🖼️ 3. Catálogo Visual de Mockups

### Vista Desktop ($1440 \times 900$ px)
Distribución a pantalla dividida (*split screen*): a la izquierda, fotografía clínica institucional y lema de excelencia médica; a la derecha, tarjeta de autenticación centrada con sombras sutiles.
![Login CliniGest Desktop](./desktop/login.png)

### Vista Mobile ($390 \times 844$ px)
Diseño vertical en una sola columna con espaciado ergonómico para digitación con pulgares, teclado numérico/alfanumérico adaptativo y botón de acción al alcance natural.
![Login CliniGest Mobile](./mobile/login.png)

---

## 📂 4. Directorios de Assets

- `desktop/login.png`: Captura en alta fidelidad de la interfaz de escritorio.
- `mobile/login.png`: Captura responsiva para smartphones y tablets de triaje.
