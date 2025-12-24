const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/produtos', require('./routes/produtosRoutes'));
app.use('/api/clientes', require('./routes/clientesRoutes'));
app.use('/api/alugueis', require('./routes/alugueisRoutes'));
app.use('/api/pagamentos', require('./routes/pagamentosRoutes'));

const PORT = 5000;
let server = null;

/**
 * 🔑 START SERVER — AGORA AWAITABLE
 */
function startServer() {
  return new Promise((resolve, reject) => {
    if (server) return resolve();

    //mode dev: 127.0.0.1; mode .deb: 0.0.0.0
    const tryListen = (port) => {
      server = app.listen(port, '0.0.0.0', () => {
        console.log(`🚀 Backend rodando na porta ${port}`);
        resolve();
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          console.warn(`⚠️ Porta ${port} ocupada, tentando ${port + 1}`);
          tryListen(port + 1);
        } else {
          reject(err);
        }
      });
    };

    tryListen(PORT);
  });
}

/**
 * STOP SERVER
 */
function stopServer() {
    if (!server) return;

    server.close(() => {
        console.log('🛑 Backend finalizado');
        server = null;
    });
}

//👉 Permite rodar standalone (dev)
if (require.main === module) {
    startServer();
}

module.exports = { startServer, stopServer };
