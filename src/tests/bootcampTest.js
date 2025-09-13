import * as api from '../api.js';

export async function runBootcampTest() {
  const unique = 'AUTO-BOOT-' + Date.now();
  const payload = { nombre: unique, descripcion: 'Creado por UI test bootcamp' };
  const created = await api.createBootcamp(payload);
  let createdId = created && (created.id || created._id || null);
  const list = await api.getBootcamps();
  const found = Array.isArray(list) && list.find(i => (i.nombre === unique) || (i.nombre && i.nombre.indexOf(unique) !== -1));
  return { ok: !!found, payload, created, found };
}
