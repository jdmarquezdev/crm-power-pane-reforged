# Dynamics 365 Power Pane Reforged

Dynamics 365 Power Pane Reforged is a helper tool designed to integrate seamlessly with Microsoft Dynamics 365. It allows developers, testers, and power users to manipulate forms, retrieve information, and perform diagnostic tasks with ease.

This extension supports **Google Chrome**, **Microsoft Edge**, and **Mozilla Firefox**.

([Leer en Español](#dynamics-365-power-pane-reforged-español))

---

## 🚀 New Features & Fixes (v0.3.0)
This version is a modernized fork of the original extension, focused on stability, security, and performance:
*   **Fix:** Resolved issues with non-functional buttons caused by race conditions in script loading.
*   **Security:** Removed unsafe `eval()` calls, replacing them with secure JSON parsing (CSP compliant).
*   **Privacy:** Replaced deprecated clipboard commands with the modern `navigator.clipboard` API.
*   **Async:** Converted blocking synchronous requests (user info, roles) to asynchronous non-blocking calls using `Promise.all`.
*   **UI/UX:** Improved hover effects and layout for the version/language selector to prevent visual glitches.
*   **Localization:** Full support for English and Spanish.

## 🛠 Installation (Developer Mode)

### Google Chrome / Microsoft Edge
1.  Clone or download this repository.
2.  Open your browser and navigate to extensions management (`chrome://extensions` or `edge://extensions`).
3.  Enable **Developer Mode** (top right corner or side menu).
4.  Click **Load unpacked**.
5.  Select the `dist/chrome` folder.
    *   *Note: If the `dist` folder does not exist, run the build command first.*

### Mozilla Firefox
1.  Open Firefox and navigate to `about:debugging#/runtime/this-firefox`.
2.  Click **Load Temporary Add-on...**.
3.  Select the `manifest.json` file inside the `dist/firefox` folder (you need to run the build for Firefox first).

## 📦 Build Instructions
Requirements: Node.js and NPM installed.

```bash
# Install dependencies
npm install

# Build for Chrome (also used for Edge)
npm run build-chrome

# Build for Firefox
npm run build-firefox

# Build for Edge (Legacy)
npm run build-edge
```

## ⚖️ Attribution & Credits
This project is a fork and continuation of the excellent **[CRM Power Pane](https://github.com/onurmenal/crm-power-pane)**, originally created by **[Onur Menal](https://github.com/onurmenal)**.

We have built upon his solid foundation to fix compatibility issues with modern browser security standards (Manifest V3, CSP) and recent updates to the Dynamics 365 platform.

## 📄 License
This project is licensed under the **ISC License**.

## ⚠️ Disclaimer
This software is provided "as is", without warranty of any kind. It is not an official Microsoft product. Use it at your own risk, preferably in Sandbox/Dev environments first.

---

<a name="es"></a>

# Dynamics 365 Power Pane Reforged (Español)

Dynamics 365 Power Pane Reforged es una herramienta auxiliar diseñada para integrarse perfectamente con Microsoft Dynamics 365. Permite a desarrolladores, testers y superusuarios manipular formularios, recuperar información y realizar tareas de diagnóstico con facilidad.

Esta extensión es compatible con **Google Chrome**, **Microsoft Edge** y **Mozilla Firefox**.

## 🚀 Nuevas Funcionalidades y Correcciones (v0.3.0)
Esta versión es un "fork" modernizado de la extensión original, enfocado en estabilidad, seguridad y rendimiento:
*   **Corrección:** Solucionados los problemas con botones no funcionales causados por condiciones de carrera en la carga de scripts.
*   **Seguridad:** Eliminadas las llamadas inseguras a `eval()`, reemplazándolas con análisis JSON seguro (compatible con CSP).
*   **Privacidad:** Reemplazados comandos de portapapeles obsoletos por la API moderna `navigator.clipboard`.
*   **Asíncrono:** Convertidas las peticiones síncronas bloqueantes (info de usuario, roles) a llamadas asíncronas no bloqueantes con `Promise.all`.
*   **UI/UX:** Mejorados efectos visuales (hover) y diseño del selector de versión/idioma para evitar solapamientos.
*   **Localización:** Soporte completo para Inglés y Español.

## 🛠 Instalación (Modo Desarrollador)

### Google Chrome / Microsoft Edge
1.  Clona o descarga este repositorio.
2.  Abre el navegador y ve a la gestión de extensiones (`chrome://extensions` o `edge://extensions`).
3.  Activa el **Modo de desarrollador** (esquina superior o menú lateral).
4.  Haz clic en **Cargar descomprimida** (Load unpacked).
5.  Selecciona la carpeta `dist/chrome`.
    *   *Nota: Si la carpeta `dist` no existe, ejecuta primero el comando de compilación.*

### Mozilla Firefox
1.  Abre Firefox y ve a `about:debugging#/runtime/this-firefox`.
2.  Haz clic en **Cargar complemento temporal...**.
3.  Selecciona el archivo `manifest.json` dentro de la carpeta `dist/firefox` (necesitas compilar para Firefox primero).

## 📦 Instrucciones de Compilación (Build)
Requisitos: Node.js y NPM instalados.

```bash
# Instalar dependencias
npm install

# Compilar para Chrome (usar también para Edge)
npm run build-chrome

# Compilar para Firefox
npm run build-firefox

# Compilar para Edge (Legacy)
npm run build-edge
```

## ⚖️ Atribución y Créditos
Este proyecto es un "fork" y continuación del excelente **[CRM Power Pane](https://github.com/onurmenal/crm-power-pane)**, creado originalmente por **[Onur Menal](https://github.com/onurmenal)**.

Hemos construido sobre su sólida base para arreglar problemas de compatibilidad con los estándares de seguridad modernos de los navegadores (Manifest V3, CSP) y actualizaciones recientes de la plataforma Dynamics 365.

## 📄 Licencia
Este proyecto está licenciado bajo la **Licencia ISC**.

## ⚠️ Aviso Legal
Este software se proporciona "tal cual", sin garantía de ningún tipo. No es un producto oficial de Microsoft. Úsalo bajo tu propio riesgo, preferiblemente primero en entornos de desarrollo (Sandbox).
