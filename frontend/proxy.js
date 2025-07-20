const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Configuration du proxy
app.use('/', createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true,
}));

// Démarrage du serveur sur le port 80 (nécessite sudo)
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Redirecting to http://localhost:8080`);
});
