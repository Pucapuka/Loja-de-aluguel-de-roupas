const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

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

// Rota de informações (opcional - para debug)
app.get('/api/info', (req, res) => {
    const os = require('os');
    const userHomeDir = os.homedir();
    const appDataDir = path.join(userHomeDir, '.loja-roupas');
    
    res.json({
        databasePath: path.join(appDataDir, 'loja.db'),
        appDataDir: appDataDir,
        status: 'online'
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados em: ${path.join(require('os').homedir(), '.loja-roupas', 'loja.db')}`);
});