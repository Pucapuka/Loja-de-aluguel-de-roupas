require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const produtosRoutes = require('./routes/produtosRoutes');
app.use('/api/produtos', produtosRoutes);

const clientesRoutes = require('./routes/clientesRoutes');
app.use('/api/clientes', clientesRoutes);

const alugueisRoutes = require('./routes/alugueisRoutes');
app.use('/api/alugueis', alugueisRoutes);

const pagamentosRoutes = require('./routes/pagamentosRoutes');
app.use('/api/pagamentos', pagamentosRoutes);

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

// Rota de debug para verificar tabelas
app.get('/api/debug-tables', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
            tables: tables.map(t => t.name),
            alugueis_count: '?',
            clientes_count: '?',
            produtos_count: '?',
            aluguel_itens_count: '?'
        });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados em: ${path.join(require('os').homedir(), '.loja-roupas', 'loja.db')}`);
});