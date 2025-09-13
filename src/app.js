import { renderHome } from './views/indexView.js';
import { renderAdmin } from './views/adminView.js';
import { renderPersona } from './views/personaView.js';
import { renderTecnologia } from './views/tecnologiaView.js';
import { renderBootcamp } from './views/bootcampView.js';
import { renderReporte } from './views/reporteView.js';
import { runUiTest } from './tests/uiTest.js';
import { runTecnologiaTest } from './tests/tecnologiaTest.js';
import { runBootcampTest } from './tests/bootcampTest.js';
import { runReporteTest } from './tests/reporteTest.js';
import { toast } from './ui.js';

const routes = {
  '/': renderHome,
  '/admin': renderAdmin,
  '/persona': renderPersona,
  '/tecnologia': renderTecnologia,
  '/bootcamp': renderBootcamp,
  '/reporte': renderReporte,
};

function onNavClick(e) {
  const r = e.target && e.target.getAttribute && e.target.getAttribute('data-route');
  if (r) location.hash = r;
}

document.querySelector('nav').addEventListener('click', onNavClick);

// render auth area (login/logout and role)
function renderAuthArea() {
  const a = document.getElementById('auth-area');
  if (!a) return;
  // Simple auth area: allow running the UI test and enable mock admin for testing
  const role = window.__MOCK_ROLE || '';
  a.innerHTML = `
    <button id="run-ui-test" title="Ejecutar prueba UI">Run UI Test</button>
  <button id="run-tec-test" title="Ejecutar prueba Tecnologias">Run Tec Test</button>
  <button id="run-boot-test" title="Ejecutar prueba Bootcamp">Run Boot Test</button>
  <button id="run-rep-test" title="Ejecutar prueba Reportes">Run Rep Test</button>
    <button id="mock-admin" title="Mock as admin">Mock Admin</button>
    <button id="clear-mock" title="Clear mock">Clear Mock</button>
    <span style="margin-left:8px; font-size:0.9rem; color:#044">Role: ${role || 'none'}</span>
  `;
}

renderAuthArea();

// install handlers for mock buttons
// handler for running the UI test only
document.addEventListener('click', (e) => {
  const runt = e.target && e.target.id === 'run-ui-test';
  if (!runt) return;
  (async () => {
    toast('Ejecutando prueba UI...');
    try {
      const res = await runUiTest();
      console.log('UI test result', res);
      if (res.ok) toast('Prueba OK: creado ' + (res.found && res.found.nombre ? res.found.nombre : '✓'));
      else toast('Prueba FAIL (no encontrado)', { error: true });
    } catch (e) { console.error(e); toast('Error en prueba UI', { error: true }); }
  })();
});

// handler for mock buttons
document.addEventListener('click', (e) => {
  const t = e.target && e.target.id;
  if (!t) return;
  if (t === 'run-tec-test') {
    (async () => {
      toast('Ejecutando prueba Tecnologias...');
      try {
        const res = await runTecnologiaTest();
        console.log('Tec test result', res);
        if (res.ok) toast('Prueba OK: tecnologia creada ' + (res.found && res.found.nombre ? res.found.nombre : '\u2713'));
        else toast('Prueba FAIL (no encontrado)', { error: true });
      } catch (e) { console.error(e); toast('Error en prueba Tecnologias', { error: true }); }
    })();
    return;
  }
  if (t === 'run-boot-test') {
    (async () => {
      toast('Ejecutando prueba Bootcamp...');
      try {
        const res = await runBootcampTest();
        console.log('Boot test result', res);
        if (res.ok) toast('Prueba OK: bootcamp creado ' + (res.found && res.found.nombre ? res.found.nombre : '\u2713'));
        else toast('Prueba FAIL (no encontrado)', { error: true });
      } catch (e) { console.error(e); toast('Error en prueba Bootcamp', { error: true }); }
    })();
    return;
  }
  if (t === 'run-rep-test') {
    (async () => {
      toast('Ejecutando prueba Reportes...');
      try {
        const res = await runReporteTest();
        console.log('Rep test result', res);
        if (res.ok) toast('Prueba OK: reportes cargados ' + (res.found && (res.found.nombre || res.found.title) ? (res.found.nombre || res.found.title) : '\u2713'));
        else toast('Prueba FAIL (no encontrado)', { error: true });
      } catch (e) { console.error(e); toast('Error en prueba Reportes', { error: true }); }
    })();
    return;
  }
  if (t === 'mock-admin') {
    window.__MOCK_ROLE = 'admin';
    toast('Mock: admin activado');
    renderAuthArea();
    location.hash = '/admin';
    return;
  }
  if (t === 'clear-mock') {
    delete window.__MOCK_ROLE;
    toast('Mock limpiado');
    renderAuthArea();
    return;
  }
});

function router() {
  const hash = location.hash.replace('#', '') || '/';
  const route = routes[hash] || routes['/'];
  const out = document.getElementById('app');
  route(out);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
window.addEventListener('hashchange', renderAuthArea);

// expose simple API for debugging in console
import * as api from './api.js';
window.__api = api;

// Global status banner helper
function setGlobalStatus(msg, isError) {
  const el = document.getElementById('global-status');
  if (!el) return;
  if (!msg) { el.style.display = 'none'; el.textContent = ''; return; }
  el.style.display = 'block';
  el.style.background = isError ? '#fee' : '#efe';
  el.style.color = isError ? '#600' : '#044';
  el.textContent = msg;
}

window.addEventListener('error', (ev) => {
  setGlobalStatus('Error en la aplicación: ' + (ev && ev.message ? ev.message : 'unknown'), true);
});

window.__setGlobalStatus = setGlobalStatus;
