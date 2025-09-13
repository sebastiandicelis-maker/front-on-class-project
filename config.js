/*
  Archivo de configuración usado por la app estática.
  Sustituye las URLs por las de tus microservicios.
  Ejemplo:
    window.__CONFIG__ = {
      PERSONA_BASE: 'http://localhost:3001/api',
      BOOTCAMP_BASE: 'http://localhost:3002/api',
      CAPACIDAD_BASE: 'http://localhost:3003/api',
      TECNOLOGIA_BASE: 'http://localhost:3004/api',
      REPORTE_BASE: 'http://localhost:3005/api'
    }
*/

window.__CONFIG__ = window.__CONFIG__ || {
  PERSONA_BASE: 'http://localhost:3001/api',
  BOOTCAMP_BASE: 'http://localhost:8083/bootcamp',
  // Endpoint base para servicio Capacidad (ajustado a la URL que proporcionaste)
  // Cuando usas el proxy (`start:proxy`) dejaremos la base relativa para
  // que las peticiones vayan al mismo origen (ej: http://127.0.0.1:8001/capacidad)
  // y así evitar errores CORS.
  CAPACIDAD_BASE: 'http://localhost:8080/capacidad',
  // Base para autenticación (ajusta si tu auth está en otro servicio)
  AUTH_BASE: '',
  // Si quieres que el front ENVÍE la cabecera Authorization, pon true.
  // Útil para pruebas: establecer a false para omitir Authorization y probar UI sin backend.
  SEND_AUTH: false,
  // Indica si el backend requiere autenticación/autorización para los endpoints.
  // Pon a false si tus endpoints no requieren auth (útil en desarrollo).
  AUTH_REQUIRED: false,
  // Use a relative base when using the dev proxy (same-origin) to avoid CORS.
  // This should forward to your tecnologia service via the proxy (e.g. http://localhost:8081).
  TECNOLOGIA_BASE: 'http://localhost:8081/tecnologia',
  REPORTE_BASE: 'http://localhost:8082/reporte'
};
