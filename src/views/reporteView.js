import { getReportes } from '../api.js';
import { toast } from '../ui.js';

function normalizeReporte(raw) {
  if (!raw || typeof raw !== 'object') return {};
  const r = Object.assign({}, raw);
  // id
  r.id = r.id || r._id || r.key || r.codigo || r.code || null;
  // title / name
  r.title = r.title || r.nombre || r.name || r.titulo || r.nombreBootcamp || '';
  // description / summary
  r.description = r.description || r.descripcion || r.desc || r.summary || r.body || '';
  // date fields
  // prefer fechaInicio/fechaFin for bootcamp reports
  r.startDate = r.startDate || r.fechaInicio || r.startDate || null;
  r.endDate = r.endDate || r.fechaFin || r.endDate || null;
  r.date = r.date || r.fecha || r.createdAt || r.created_at || r.startDate || null;
  // author
  r.author = r.author || r.autor || r.owner || r.usuario || r.author || r.bootcampId || '';
  // metrics commonly present in bootcamp report
  r.inscritos = r.cantidadInscritos != null ? r.cantidadInscritos : (r.inscritos != null ? r.inscritos : null);
  r.deserciones = r.cantidadDeserciones != null ? r.cantidadDeserciones : (r.deserciones != null ? r.deserciones : null);
  r.graduados = r.cantidadGraduados != null ? r.cantidadGraduados : (r.graduados != null ? r.graduados : null);
  return r;
}

export function renderReporte(container) {
  if (!container) return;
  container.innerHTML = `
    <section class="view reportes-view">
      <h2>Reportes</h2>
      <div class="report-controls">
        <button id="refresh-reportes">Refrescar</button>
        <input id="filter-reportes" placeholder="Filtrar por texto..." />
      </div>
      <div id="reportes-list" class="cards-grid">Cargando reportes...</div>
    </section>
  `;

  const listEl = container.querySelector('#reportes-list');
  const refreshBtn = container.querySelector('#refresh-reportes');
  const filterInput = container.querySelector('#filter-reportes');

  async function loadAndRender() {
    listEl.innerHTML = 'Cargando reportes...';
    try {
      const data = await getReportes();
  const raw = Array.isArray(data) ? data : (Array.isArray(data.value) ? data.value : (Array.isArray(data.Reportes) ? data.Reportes : []));
  const arr = (raw || []).map(normalizeReporte);
  renderList(arr, filterInput.value.trim());
    } catch (e) {
      console.error(e);
      listEl.innerHTML = '<div class="empty">No se pudieron obtener los reportes</div>';
      toast('Error cargando reportes', { error: true });
    }
  }

  function renderList(items, filter) {
    if (!items || items.length === 0) {
      listEl.innerHTML = '<div class="empty">No hay reportes</div>';
      return;
    }
    const f = (filter || '').toLowerCase();
    const filtered = items.filter(it => {
      if (!it) return false;
      const s = `${it.title || ''} ${it.description || ''} ${it.author || ''}`;
      return s.toLowerCase().includes(f);
    });
    // order by date (newest-first) else by title
    filtered.sort((a,b) => {
      const ta = a.date ? new Date(a.date).getTime() : 0;
      const tb = b.date ? new Date(b.date).getTime() : 0;
      if (ta && tb) return tb - ta;
      return (b.title || '').localeCompare(a.title || '');
    });

    listEl.innerHTML = '';
    for (const it of filtered) {
      const card = document.createElement('article');
      card.className = 'card report-card';
      const title = it.title || 'Sin título';
      const desc = it.description || '';
      const meta = [];
      // date range
      if (it.startDate || it.endDate) {
        const s = it.startDate ? new Date(it.startDate).toLocaleDateString() : '—';
        const e = it.endDate ? new Date(it.endDate).toLocaleDateString() : '—';
        meta.push(`${s} → ${e}`);
      } else if (it.date) {
        meta.push(new Date(it.date).toLocaleString());
      }
      if (it.author) meta.push(it.author);
      // metrics
      const metrics = [];
      if (typeof it.inscritos === 'number') metrics.push(`Inscritos: ${it.inscritos}`);
      if (typeof it.deserciones === 'number') metrics.push(`Deserciones: ${it.deserciones}`);
      if (typeof it.graduados === 'number') metrics.push(`Graduados: ${it.graduados}`);
      card.innerHTML = `
        <h3 class="card-title">${escapeHtml(title)}</h3>
        <div class="card-meta">${meta.join(' • ')}</div>
        <p class="card-desc">${escapeHtml(desc)}</p>
        <div class="report-metrics">${metrics.map(escapeHtml).join(' • ')}</div>
      `;
      listEl.appendChild(card);
    }
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
  }

  refreshBtn.addEventListener('click', loadAndRender);
  filterInput.addEventListener('input', () => {
    // local filter only
    const current = listEl.querySelectorAll('.report-card');
    // simply reload to apply filter on client-side dataset
    loadAndRender();
  });

  loadAndRender();
}
