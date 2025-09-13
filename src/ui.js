// UI helpers: setLoading and toast
export function setLoading(button, isLoading) {
  if (!button) return;
  if (isLoading) {
    button.setAttribute('disabled', '');
    const sp = document.createElement('span');
    sp.className = 'spinner';
    sp.style.marginLeft = '8px';
    sp.setAttribute('data-ui-spinner','');
    button.appendChild(sp);
  } else {
    button.removeAttribute('disabled');
    const sp = button.querySelector('[data-ui-spinner]');
    if (sp) sp.remove();
  }
}

export function toast(msg, opts = {}) {
  const t = document.createElement('div');
  t.className = 'toast' + (opts.error ? ' error' : '');
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), opts.duration || 3500);
}
