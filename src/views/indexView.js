import * as api from '../api.js';
import { setLoading, toast } from '../ui.js';
// CRUD available without auth
import { openModal } from '../modal.js';

export async function renderHome(container) {
  container.innerHTML = `
    <h2>Inicio — Capacidades</h2>
    <section id="form-wrap">
      <form id="cap-form">
        <div class="row">
          <div style="flex:1">
            <label>Nombre</label>
            <input type="text" name="nombre" required />
          </div>
        </div>
        <div>
          <label>Descripción</label>
          <textarea name="descripcion" rows="3"></textarea>
        </div>
        <div style="margin-top:8px">
          <button class="primary" type="submit">Crear capacidad</button>
          <button id="refresh" type="button">Refrescar lista</button>
        </div>
      </form>
    </section>

    <section class="list" id="list-capacidades">
      <h3>Capacidades existentes</h3>
      <div id="caps"></div>
    </section>

    <div id="pager" style="text-align:center; margin-top:16px"></div>
  `;

  const form = container.querySelector('#cap-form');
  const submitBtn = form.querySelector('button.primary');

  // pagination state
  let currentPage = 1;
  const pageSize = 5; // items per page

  function renderPager(totalItems, page, totalPages) {
    const pager = container.querySelector('#pager');
    if (!pager) return;
    pager.innerHTML = '';
    const prev = document.createElement('button');
    prev.textContent = 'Prev';
    const next = document.createElement('button');
    next.textContent = 'Next';
    prev.disabled = page <= 1;
    next.disabled = page >= totalPages;
    prev.addEventListener('click', () => {
      currentPage = Math.max(1, page - 1);
      loadList();
    });
    next.addEventListener('click', () => {
      currentPage = Math.min(totalPages, page + 1);
      loadList();
    });
    const info = document.createElement('span');
    info.className = 'muted';
    info.style.margin = '0 8px';
    info.textContent = `Página ${page} de ${totalPages} (${totalItems} items)`;
    pager.appendChild(prev);
    pager.appendChild(info);
    pager.appendChild(next);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = { nombre: fd.get('nombre'), descripcion: fd.get('descripcion') };
    try {
      setLoading(submitBtn, true);
      const res = await api.createCapacidad(payload);
      console.log('createCapacidad res', res);
      const createdId = res && (res.id || res._id || (res[0] && res[0].id) || null);
      toast('Capacidad creada' + (createdId ? (' (id ' + createdId + ')') : ''));
      form.reset();
      currentPage = 1;
      await loadList();
      const caps = await api.getCapacidades();
      const found = Array.isArray(caps) && caps.find(i => String(i.id || i._id || '') === String(createdId) || (i.nombre && i.nombre.indexOf(payload.nombre) !== -1));
      if (!found && createdId) setTimeout(async () => { await loadList(); }, 800);
    } catch (err) {
      console.error(err);
      const msg = (err && err.status) ? `Error ${err.status}` : 'Error al crear capacidad';
      toast(msg, { error: true });
    } finally { setLoading(submitBtn, false); }
  });

  const refreshBtn = container.querySelector('#refresh');
  refreshBtn.addEventListener('click', loadList);

  await loadList();

  async function loadList() {
    const wrap = container.querySelector('#caps');
    wrap.innerHTML = '<div class="card"><div class="skeleton" style="height:60px"></div></div>';
    setLoading(refreshBtn, true);
    try {
      const list = await api.getCapacidades();
      if (!list || !Array.isArray(list)) {
        wrap.innerHTML = '<div class="card">No se pudo recuperar la lista. Ver consola.</div>';
        console.warn('getCapacidades:', list);
        toast('No se pudo recuperar la lista', { error: true });
        return;
      }
      // sort newest first by id (or _id)
      const sorted = list.slice().sort((a,b) => {
        const ida = (a.id !== undefined && a.id !== null) ? Number(a.id) : (a._id !== undefined ? Number(a._id) : 0);
        const idb = (b.id !== undefined && b.id !== null) ? Number(b.id) : (b._id !== undefined ? Number(b._id) : 0);
        return idb - ida;
      });

      const totalItems = sorted.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
      if (currentPage > totalPages) currentPage = totalPages;
      const start = (currentPage - 1) * pageSize;
      const pageItems = sorted.slice(start, start + pageSize);

      const html = pageItems.map(c => {
        const idVal = (c.id !== undefined && c.id !== null) ? c.id : ((c._id !== undefined && c._id !== null) ? c._id : (c.idCapacidad || ''));
        return `
          <div class="card" data-id="${escapeHtml(String(idVal))}">
            <strong>${escapeHtml(c.nombre || '')}</strong>
            <div>${escapeHtml(c.descripcion || '')}</div>
            <div style="margin-top:8px"><button class="edit">Editar</button><button class="del">Eliminar</button></div>
          </div>`;
      }).join('');
      wrap.innerHTML = html;

      // render pagination controls
      renderPager(totalItems, currentPage, totalPages);
    } catch (err) {
      console.error(err);
      wrap.innerHTML = '<div class="card">Error cargando capacidades.</div>';
      toast('Error cargando capacidades', { error: true });
    } finally {
      setLoading(refreshBtn, false);
    }
  }
}

  // Delegación para editar/eliminar (solo admin)
  document.addEventListener('click', async (ev) => {
    const del = ev.target.closest && ev.target.closest('.del');
    const edit = ev.target.closest && ev.target.closest('.edit');
  if (!del && !edit) return;
    const card = ev.target.closest && ev.target.closest('.card');
    if (!card) return;
    const id = card.getAttribute('data-id');
    if (!id) return;

    if (del) {
      if (!confirm('Eliminar esta capacidad?')) return;
      try {
        await (await import('../api.js')).deleteCapacidad(id);
        toast('Eliminado');
        const root = document.getElementById('app');
        const refreshBtn = root.querySelector('#refresh');
        if (refreshBtn) refreshBtn.click();
      } catch (e) { console.error(e); toast('Error al eliminar', { error: true }); }
    }

    if (edit) {
      // abrir modal con valores actuales
      const current = {
        nombre: card.querySelector('strong').textContent,
        descripcion: card.querySelector('div').textContent
      };
      openModal('Editar capacidad', {
        nombre: { label: 'Nombre', value: current.nombre, required: true },
        descripcion: { label: 'Descripción', value: current.descripcion, required: false }
      }, async (payload) => {
        try {
          await (await import('../api.js')).updateCapacidad(id, payload);
          toast('Actualizado');
          const root = document.getElementById('app');
          const refreshBtn = root.querySelector('#refresh');
          if (refreshBtn) refreshBtn.click();
        } catch (e) { console.error(e); toast('Error al actualizar', { error: true }); }
      });
    }
  });

function escapeHtml(s) {
  return String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}
