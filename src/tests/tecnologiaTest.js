import * as api from '../api.js';

export async function runTecnologiaTest() {
  const unique = 'AUTO-TEC-' + Date.now();
  const payload = { nombre: unique, descripcion: 'Creada por UI test tecnologia' };
  const created = await api.createTecnologia(payload);
  let createdId = created && (created.id || created._id || created["id"] || null);
  const list = await api.getTecnologias();
  const found = Array.isArray(list) && list.find(i => (i.nombre === unique) || (i.nombre && i.nombre.indexOf(unique) !== -1));
  return { ok: !!found, payload, created, found };
}
