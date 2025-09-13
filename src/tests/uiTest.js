import * as api from '../api.js';

export async function runUiTest() {
  const unique = 'AUTO-' + Date.now();
  const payload = { nombre: unique, descripcion: 'Creada por UI test' };
  const created = await api.createCapacidad(payload);
  // some backends return the created object, others an id; handle both
  let createdId = created && (created.id || created._id || created["id"] || null);
  // fetch list
  const list = await api.getCapacidades();
  const found = Array.isArray(list) && list.find(i => (i.nombre === unique) || (i.nombre && i.nombre.indexOf(unique) !== -1));
  return { ok: !!found, payload, created, found };
}
