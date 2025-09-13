export function openModal(title, fields = {}, onSubmit) {
  const overlay = document.createElement('div');
  overlay.style.position = 'fixed';
  overlay.style.left = 0; overlay.style.top = 0; overlay.style.right = 0; overlay.style.bottom = 0;
  overlay.style.background = 'rgba(0,0,0,0.4)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = 9998;

  const box = document.createElement('div');
  box.style.background = '#fff';
  box.style.padding = '16px';
  box.style.borderRadius = '8px';
  box.style.minWidth = '320px';
  box.innerHTML = `<h3 style="margin-top:0">${title}</h3>`;

  const form = document.createElement('form');
  Object.keys(fields).forEach(k => {
    const label = document.createElement('label');
    label.textContent = fields[k].label || k;
    label.style.display = 'block';
    label.style.marginTop = '8px';
    const input = document.createElement('input');
    input.name = k;
    input.type = fields[k].type || 'text';
    input.value = fields[k].value || '';
    input.required = !!fields[k].required;
    input.style.width = '100%';
    input.style.padding = '8px';
    input.style.marginTop = '4px';
    form.appendChild(label);
    form.appendChild(input);
  });

  const actions = document.createElement('div');
  actions.style.marginTop = '12px';
  const ok = document.createElement('button'); ok.textContent = 'Guardar'; ok.className='primary';
  const cancel = document.createElement('button'); cancel.textContent = 'Cancelar'; cancel.style.marginLeft = '8px';
  actions.appendChild(ok); actions.appendChild(cancel);
  form.appendChild(actions);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {};
    for (const [k] of fd.entries()) payload[k] = fd.get(k);
    onSubmit(payload);
    overlay.remove();
  });
  cancel.addEventListener('click', (e) => { e.preventDefault(); overlay.remove(); });

  box.appendChild(form);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
  // focus first input
  const inp = form.querySelector('input'); if (inp) inp.focus();
}
