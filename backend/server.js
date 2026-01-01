const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos do frontend (React buildado)
app.use(express.static(path.join(__dirname, '../public')));

// Log de requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Rotas API
app.use('/api/produtos', require('./routes/produtosRoutes'));
app.use('/api/clientes', require('./routes/clientesRoutes'));
app.use('/api/alugueis', require('./routes/alugueisRoutes'));
app.use('/api/pagamentos', require('./routes/pagamentosRoutes'));

// Rota de health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    docker: process.env.DOCKER_ENV === 'true'
  });
});

// Rota fallback - sempre retorna o frontend para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('❌ Erro no servidor:', err.stack);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.DOCKER_ENV === 'true' ? '0.0.0.0' : '127.0.0.1';

app.listen(PORT, HOST, () => {
  console.log(`🚀 Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`📁 Frontend servido de: ${path.join(__dirname, '../public')}`);
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV}`);
  console.log(`🐳 Docker: ${process.env.DOCKER_ENV === 'true' ? 'Sim' : 'Não'}`);
});

module.exports = app;