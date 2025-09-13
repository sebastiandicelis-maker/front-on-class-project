const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const PORT = process.env.PORT || 8001;
const TARGET = process.env.TARGET || 'http://localhost:8080';

const app = express();

// Log incoming requests (method + path) to help debug unexpected methods
app.use((req, res, next) => {
  console.log('[proxy] %s %s', req.method, req.originalUrl);
  next();
});

// Serve static files from current dir
app.use(express.static(path.join(__dirname, '.')));
// Dynamically read client config.js to map service bases to proxy routes
const fs = require('fs');
const vm = require('vm');

function readClientConfig() {
  const cfgPath = path.join(__dirname, 'config.js');
  try {
    const content = fs.readFileSync(cfgPath, 'utf8');
    const sandbox = { window: {} };
    vm.runInNewContext(content, sandbox);
    return sandbox.window.__CONFIG__ || {};
  } catch (e) {
    console.warn('[proxy] failed reading config.js', e && e.message);
    return {};
  }
}

const clientCfg = readClientConfig();

// For each <SERVICE>_BASE in config, create a proxy for route /<service>
Object.keys(clientCfg).forEach(k => {
  if (!k.endsWith('_BASE')) return;
  const val = clientCfg[k];
  const service = k.slice(0, -5).toLowerCase(); // remove _BASE
  const route = `/${service}`;
  if (!val) {
    console.log(`[proxy] ${k} empty, skipping ${route}`);
    return;
  }
  let origin;
  try {
    origin = new URL(val).origin;
  } catch (e) {
    origin = TARGET; // fallback
  }
  console.log(`[proxy] mapping ${route} -> ${origin} (from ${k})`);
  app.use(route, createProxyMiddleware({
    target: origin,
    changeOrigin: true,
    logLevel: 'warn',
    onProxyRes(proxyRes, req, res) {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
    }
  }));
  // also map a simple plural form: /<service>s -> same origin
  try {
    const routePlural = `${route}s`;
    console.log(`[proxy] also mapping ${routePlural} -> ${origin} (plural)`);
    app.use(routePlural, createProxyMiddleware({
      target: origin,
      changeOrigin: true,
      logLevel: 'warn',
      onProxyRes(proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,DELETE,OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization';
      }
    }));
  } catch (e) {
    // ignore
  }
});

// Ensure OPTIONS requests are handled (some servers require explicit handling)
app.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.sendStatus(204);
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Proxy server listening on http://127.0.0.1:${PORT}, forwarding API paths to ${TARGET}`);
});
