const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const roupasRoutes = require('./routes/roupas');
app.use('/api/roupas', roupasRoutes);

const clientesRoutes = require('./routes/clientes');
app.use('/api/clientes', clientesRoutes);

const alugueisRoutes = require('./routes/alugueis');
app.use('/api/alugueis', alugueisRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
