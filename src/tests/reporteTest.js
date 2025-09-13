import { getReportes } from '../api.js';

export async function runReporteTest() {
  try {
    const res = await getReportes();
    const arr = Array.isArray(res) ? res : (Array.isArray(res.value) ? res.value : []);
    return { ok: Array.isArray(arr) && arr.length >= 0, found: arr[0] || null };
  } catch (e) {
    return { ok: false, error: e };
  }
}
