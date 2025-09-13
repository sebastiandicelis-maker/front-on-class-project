import * as api from '../api.js';
import { setLoading, toast } from '../ui.js';
import { openModal } from '../modal.js';

export async function renderBootcamp(container) {
  container.innerHTML = `
    <h2>Bootcamps</h2>
    <section id="form-wrap">
      <form id="boot-form">
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
          <button class="primary" type="submit">Crear bootcamp</button>
          <button id="refresh-boot" type="button">Refrescar lista</button>
        </div>
      </form>
    </section>

    <section class="list" id="list-bootcamps">
      <h3>Bootcamps existentes</h3>
      <div id="boots"></div>
    </section>

    <div id="pager-boot" style="text-align:center; margin-top:16px"></div>
  `;

  const form = container.querySelector('#boot-form');
  const submitBtn = form.querySelector('button.primary');

  let currentPage = 1;
  const pageSize = 5;

  function renderPager(totalItems, page, totalPages) {
    const pager = container.querySelector('#pager-boot');
    if (!pager) return;
    pager.innerHTML = '';
    const prev = document.createElement('button'); prev.textContent = 'Prev';
    const next = document.createElement('button'); next.textContent = 'Next';
    prev.disabled = page <= 1; next.disabled = page >= totalPages;
    prev.addEventListener('click', () => { currentPage = Math.max(1, page - 1); loadList(); });
    next.addEventListener('click', () => { currentPage = Math.min(totalPages, page + 1); loadList(); });
    const info = document.createElement('span'); info.className = 'muted'; info.style.margin = '0 8px';
    info.textContent = `Página ${page} de ${totalPages} (${totalItems} items)`;
    pager.appendChild(prev); pager.appendChild(info); pager.appendChild(next);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = { nombre: fd.get('nombre'), descripcion: fd.get('descripcion') };
    try {
      setLoading(submitBtn, true);
      const res = await api.createBootcamp(payload);
      const createdId = res && (res.id || res._id || null);
      toast('Bootcamp creado' + (createdId ? (' (id ' + createdId + ')') : ''));
      form.reset(); currentPage = 1; await loadList();
    } catch (err) { console.error(err); toast('Error al crear bootcamp', { error: true }); }
    finally { setLoading(submitBtn, false); }
  });

  const refreshBtn = container.querySelector('#refresh-boot');
  refreshBtn.addEventListener('click', loadList);

  await loadList();

  async function loadList() {
    const wrap = container.querySelector('#boots');
    wrap.innerHTML = '<div class="card"><div class="skeleton" style="height:60px"></div></div>';
    setLoading(refreshBtn, true);
    try {
      const list = await api.getBootcamps();
      if (!list || !Array.isArray(list)) { wrap.innerHTML = '<div class="card">No se pudo recuperar la lista.</div>'; toast('No se pudo recuperar la lista', { error: true }); return; }
      const sorted = list.slice().sort((a,b) => { const ida = (a.id!=null)?Number(a.id):(a._id?Number(a._id):0); const idb = (b.id!=null)?Number(b.id):(b._id?Number(b._id):0); return idb-ida; });
      const totalItems = sorted.length; const totalPages = Math.max(1, Math.ceil(totalItems / pageSize)); if (currentPage>totalPages) currentPage=totalPages;
      const start = (currentPage-1)*pageSize; const pageItems = sorted.slice(start, start+pageSize);
      const html = pageItems.map(c=>{
        const idVal = (c.id!=null)?c.id:((c._id!=null)?c._id:(c.idBootcamp||''));
        return `<div class="card" data-id="${escapeHtml(String(idVal))}"><strong>${escapeHtml(c.nombre||'')}</strong><div>${escapeHtml(c.descripcion||'')}</div><div style="margin-top:8px"><button class="edit">Editar</button><button class="del">Eliminar</button></div></div>`;
      }).join('');
      wrap.innerHTML = html;
      renderPager(totalItems, currentPage, totalPages);
    } catch (err) { console.error(err); wrap.innerHTML = '<div class="card">Error cargando bootcamps.</div>'; toast('Error cargando bootcamps', { error: true }); }
    finally { setLoading(refreshBtn, false); }
  }

  // delegación para editar/eliminar
  document.addEventListener('click', async (ev) => {
    const del = ev.target.closest && ev.target.closest('.del');
    const edit = ev.target.closest && ev.target.closest('.edit');
    if (!del && !edit) return; const card = ev.target.closest('.card'); if (!card) return; const id = card.getAttribute('data-id'); if (!id) return;
    if (del) { if (!confirm('Eliminar este bootcamp?')) return; try { await (await import('../api.js')).deleteBootcamp(id); toast('Eliminado'); const root = document.getElementById('app'); const refreshBtn = root.querySelector('#refresh-boot'); if (refreshBtn) refreshBtn.click(); } catch (e){ console.error(e); toast('Error al eliminar', { error: true }); } }
    if (edit) { const current = { nombre: card.querySelector('strong').textContent, descripcion: card.querySelector('div').textContent }; openModal('Editar bootcamp', { nombre: { label:'Nombre', value: current.nombre, required:true }, descripcion: { label:'Descripción', value: current.descripcion, required:false } }, async (payload) => { try { await (await import('../api.js')).updateBootcamp(id, payload); toast('Actualizado'); const root = document.getElementById('app'); const refreshBtn = root.querySelector('#refresh-boot'); if (refreshBtn) refreshBtn.click(); } catch (e) { console.error(e); toast('Error al actualizar', { error: true }); } }); }
  });

  function escapeHtml(s) { return String(s).replace(/[&<>\"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }
}
