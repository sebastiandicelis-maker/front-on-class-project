const cfg = window.__CONFIG__ || {};

function safeFetch(url, opts = {}) {
  const headers = Object.assign({}, opts.headers || {});
  // timeout in milliseconds (default 8000ms)
  const timeoutMs = typeof opts.timeout === 'number' ? opts.timeout : 8000;

  // Resolve finalUrl: if absolute and matches a configured *_BASE, rewrite to relative path
  let finalUrl;
  if (typeof url === 'string' && url.startsWith('http')) {
    finalUrl = url; // default
    try {
      for (const k of Object.keys(cfg || {})) {
        if (!k.endsWith('_BASE')) continue;
        const base = cfg[k];
        if (!base || typeof base !== 'string') continue;
        if (url.startsWith(base)) {
          let rel = url.slice(base.length);
          if (!rel.startsWith('/')) rel = '/' + rel;
          finalUrl = rel;
          break;
        }
      }
    } catch (e) {
      finalUrl = url;
    }
  } else {
    finalUrl = typeof url === 'string' ? (url.startsWith('/') ? url : ('/' + url)) : url;
  }

  const controller = new AbortController();
  const signal = controller.signal;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(finalUrl, Object.assign({}, opts, { headers, signal })).then(async res => {
    clearTimeout(timer);
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch { parsed = text; }
    if (!res.ok) {
      // 304 Not Modified: return parsed body if present
      if (res.status === 304) return parsed;
      const err = new Error(`HTTP ${res.status} ${res.statusText}`);
      err.status = res.status;
      err.body = parsed;
      throw err;
    }
    return parsed;
  }).catch(e => {
    clearTimeout(timer);
    if (e && e.name === 'AbortError') {
      const err = new Error('Request timed out');
      err.status = 0;
      try { if (window && window.__setGlobalStatus) window.__setGlobalStatus('Network timeout: servidor no responde', true); } catch {}
      throw err;
    }
    try { if (window && window.__setGlobalStatus) window.__setGlobalStatus('Network error: ' + (e && e.message ? e.message : String(e)), true); } catch {}
    throw e;
  });
}

export function getPersonas() {
  return safeFetch(`${cfg.PERSONA_BASE}/personas`);
}

export function getBootcamps() {
  return safeFetch(`${cfg.BOOTCAMP_BASE}/bootcamp`);
}

export function createBootcamp(payload) {
  const urlBase = `${cfg.BOOTCAMP_BASE}/bootcamp`;
  const urlCreate = `${cfg.BOOTCAMP_BASE}/bootcamp/create`;
  return safeFetch(urlBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(async (err) => {
    try {
      return await safeFetch(urlCreate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e2) {
      throw err;
    }
  });
}

export function updateBootcamp(id, payload) {
  const urlId = `${cfg.BOOTCAMP_BASE}/bootcamp/${encodeURIComponent(id)}`;
  const urlBase = `${cfg.BOOTCAMP_BASE}/bootcamp`;
  const urlUpdatePost = `${cfg.BOOTCAMP_BASE}/bootcamp/update`;
  return safeFetch(urlId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(async (err) => {
    try {
      const body = Object.assign({}, payload, { id });
      return await safeFetch(urlBase, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e2) {
      try {
        return await safeFetch(urlUpdatePost, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({ id }, payload))
        });
      } catch (e3) {
        throw err;
      }
    }
  });
}

export function deleteBootcamp(id) {
  const urlId = `${cfg.BOOTCAMP_BASE}/bootcamp/${encodeURIComponent(id)}`;
  const urlQuery = `${cfg.BOOTCAMP_BASE}/bootcamp?id=${encodeURIComponent(id)}`;
  const urlDeletePost = `${cfg.BOOTCAMP_BASE}/bootcamp/delete`;
  return safeFetch(urlId, { method: 'DELETE' }).catch(async (err) => {
    try {
      return await safeFetch(urlQuery, { method: 'DELETE' });
    } catch (e2) {
      try {
        return await safeFetch(urlDeletePost, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e3) {
        throw err;
      }
    }
  });
}

export function getCapacidades() {
  // add a cache-buster to avoid stale responses in some dev setups
  const url = `${cfg.CAPACIDAD_BASE}/capacidad?_=${Date.now()}`;
  return safeFetch(url).then(res => {
    // backend may return { value: [...] } or the array directly
    if (!res) return res;
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.value)) return res.value;
    if (Array.isArray(res.Value)) return res.Value;
    // fallback: if object with pagination, try to find array property
    for (const k of Object.keys(res)) {
      if (Array.isArray(res[k])) return res[k];
    }
    return res;
  });
}

export function createCapacidad(payload) {
  const urlBase = `${cfg.CAPACIDAD_BASE}/capacidad`;
  const urlCreate = `${cfg.CAPACIDAD_BASE}/capacidad/create`;
  return safeFetch(urlBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(async (err) => {
    // try alternative endpoint
    try {
      return await safeFetch(urlCreate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e2) {
      throw err;
    }
  });
}

export function updateCapacidad(id, payload) {
  // Try several patterns to accommodate different backend conventions
  const urlId = `${cfg.CAPACIDAD_BASE}/capacidad/${encodeURIComponent(id)}`;
  const urlBase = `${cfg.CAPACIDAD_BASE}/capacidad`;
  const urlUpdatePost = `${cfg.CAPACIDAD_BASE}/capacidad/update`;
  return safeFetch(urlId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(async (err) => {
    // try PUT to base with id in body
    try {
      const body = Object.assign({}, payload, { id });
      return await safeFetch(urlBase, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e2) {
      // try POST to /capacidad/update with id in body
      try {
        return await safeFetch(urlUpdatePost, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({ id }, payload))
        });
      } catch (e3) {
        throw err;
      }
    }
  });
}

export function deleteCapacidad(id) {
  const urlId = `${cfg.CAPACIDAD_BASE}/capacidad/${encodeURIComponent(id)}`;
  const urlQuery = `${cfg.CAPACIDAD_BASE}/capacidad?id=${encodeURIComponent(id)}`;
  const urlDeletePost = `${cfg.CAPACIDAD_BASE}/capacidad/delete`;
  return safeFetch(urlId, { method: 'DELETE' }).catch(async (err) => {
    // try DELETE with query param
    try {
      return await safeFetch(urlQuery, { method: 'DELETE' });
    } catch (e2) {
      // try POST fallback
      try {
        return await safeFetch(urlDeletePost, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e3) {
        throw err;
      }
    }
  });
}

export function getTecnologias() {
  // Try several common read endpoints to accommodate backend conventions.
  const base = cfg.TECNOLOGIA_BASE || '';
  const candidates = [
    `${base}/tecnologia?_=${Date.now()}`,
    `${base}/tecnologia/tecnologias?_=${Date.now()}`,
    `${base}/tecnologias?_=${Date.now()}`,
    `${base}?_=${Date.now()}`
  ];

  return (async () => {
    for (const url of candidates) {
      try {
        const res = await safeFetch(url, { method: 'GET' });
        if (!res) continue;
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.value)) return res.value;
        if (Array.isArray(res.Value)) return res.Value;
        for (const k of Object.keys(res)) {
          if (Array.isArray(res[k])) return res[k];
        }
        // if res is object but not array, return it (caller handles)
        return res;
      } catch (e) {
        // try next candidate
        continue;
      }
    }
    // final attempt without cache-buster
    try {
      return await safeFetch(`${base}/tecnologia`, { method: 'GET' });
    } catch (e) {
      throw new Error('No se pudo recuperar tecnologias (404/No route matched)');
    }
  })();
}

export function createTecnologia(payload) {
  const urlBase = `${cfg.TECNOLOGIA_BASE}/tecnologia`;
  const urlCreate = `${cfg.TECNOLOGIA_BASE}/tecnologia/create`;
  return safeFetch(urlBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(async (err) => {
    // try alternative endpoint
    try {
      return await safeFetch(urlCreate, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch (e2) {
      throw err;
    }
  });
}

export function updateTecnologia(id, payload) {
  const urlId = `${cfg.TECNOLOGIA_BASE}/tecnologia/${encodeURIComponent(id)}`;
  const urlBase = `${cfg.TECNOLOGIA_BASE}/tecnologia`;
  const urlUpdatePost = `${cfg.TECNOLOGIA_BASE}/tecnologia/update`;
  return safeFetch(urlId, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).catch(async (err) => {
    try {
      const body = Object.assign({}, payload, { id });
      return await safeFetch(urlBase, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
    } catch (e2) {
      try {
        return await safeFetch(urlUpdatePost, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(Object.assign({ id }, payload))
        });
      } catch (e3) {
        throw err;
      }
    }
  });
}

export function deleteTecnologia(id) {
  const urlId = `${cfg.TECNOLOGIA_BASE}/tecnologia/${encodeURIComponent(id)}`;
  const urlQuery = `${cfg.TECNOLOGIA_BASE}/tecnologia?id=${encodeURIComponent(id)}`;
  const urlDeletePost = `${cfg.TECNOLOGIA_BASE}/tecnologia/delete`;
  return safeFetch(urlId, { method: 'DELETE' }).catch(async (err) => {
    try {
      return await safeFetch(urlQuery, { method: 'DELETE' });
    } catch (e2) {
      try {
        return await safeFetch(urlDeletePost, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
      } catch (e3) {
        throw err;
      }
    }
  });
}
export function getReportes() {
  // add cache-buster and request-level no-cache to avoid 304 Not Modified responses
  const url = `${cfg.REPORTE_BASE}/reportes`;
  return safeFetch(url, { method: 'GET', cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }).then(res => {
    if (!res) return res;
    if (Array.isArray(res)) return res;
    if (Array.isArray(res.value)) return res.value;
    if (Array.isArray(res.Reportes)) return res.Reportes;
    // try to find any array property
    for (const k of Object.keys(res)) {
      if (Array.isArray(res[k])) return res[k];
    }
    return res;
  });
}
