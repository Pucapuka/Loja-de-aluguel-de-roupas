require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');


const app = express();
app.use(cors());
app.use(express.json());

// Rotas (ajustado para os nomes corretos)
const roupasRoutes = require('./routes/roupasRoutes');  // ← removido "Routes"
app.use('/api/roupas', roupasRoutes);

const clientesRoutes = require('./routes/clientesRoutes');  // ← removido "Routes"
app.use('/api/clientes', clientesRoutes);

const alugueisRoutes = require('./routes/alugueisRoutes');  // ← removido "Routes"
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

// Rota de debug para verificar tabelas
app.get('/api/debug-tables', (req, res) => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
            tables: tables.map(t => t.name),
            alugueis_count: '?',
            clientes_count: '?',
            roupas_count: '?',
            aluguel_itens_count: '?'
        });
    });
});

const PORT = process.env.port || 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Banco de dados em: ${path.join(require('os').homedir(), '.loja-roupas', 'loja.db')}`);
});