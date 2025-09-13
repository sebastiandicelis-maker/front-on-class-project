Reto Reactivo — Front (estático)

Qué incluye
- Aplicación estática (HTML/JS/CSS) en `front/`.
- Páginas: Inicio (creación de "capacidades"), Admin, Persona.
- Cliente API configurable en `config.js` para apuntar a tus 5 microservicios.

Cómo usar
1) Abrir `index.html` en el navegador (doble clic) o servir con un servidor estático.
2) Edita `config.js` para apuntar a las URLs reales de tus microservicios.

Supuestos razonables
- Los microservicios exponen rutas REST estándar:
  - CAPACIDAD: POST/GET   -> {CAPACIDAD_BASE}/capacidades
  - PERSONA: GET          -> {PERSONA_BASE}/personas
  - BOOTCAMP: GET        -> {BOOTCAMP_BASE}/bootcamps
  - TECNOLOGIA: GET      -> {TECNOLOGIA_BASE}/tecnologias
  - REPORTE: GET         -> {REPORTE_BASE}/reportes

Siguientes pasos recomendados
- Conectar endpoints reales y ajustar payloads/respuestas según tus APIs.
- Añadir autenticación (JWT) y control de roles (admin/persona) en el cliente.
- Opcional: migrar a React + Vite para mejor escalabilidad. Puedo hacerlo por ti.

Notas técnicas
- No requiere instalación de dependencias; es un SPA modular ES Modules.
- Para desarrollo local con CORS activa, sirve los archivos con un servidor (ej: `npx http-server` o `python -m http.server`) o ajusta CORS en los microservicios.

Nota de pruebas: Si quieres probar la UI sin enviar la cabecera Authorization al backend, ajusta `SEND_AUTH` en `config.js` a `false`. Esto es útil si usas tokens falsos en `localStorage` para emular roles o si el backend no está disponible.
