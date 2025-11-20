const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const os = require('os');

// Definir caminho do banco na pasta home do usuário
const userHomeDir = os.homedir();
const appDataDir = path.join(userHomeDir, '.loja-roupas');
const dbPath = path.join(appDataDir, 'loja.db');

// Criar diretório se não existir
if (!fs.existsSync(appDataDir)) {
    fs.mkdirSync(appDataDir, { recursive: true });
    console.log(`📁 Diretório de dados criado: ${appDataDir}`);
}

// Conectar ao banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar com o banco de dados:', err.message);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite em:', dbPath);
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS roupas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tamanho TEXT,
            cor TEXT,
            preco_aluguel REAL,
            status TEXT DEFAULT 'disponível'
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT,
            endereco TEXT,
            email TEXT
        )`);

        db.run(`CREATE TABLE IF NOT EXISTS alugueis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            roupa_id INTEGER NOT NULL,
            cliente_id INTEGER NOT NULL,
            data_inicio TEXT,
            data_fim TEXT,
            valor_total REAL,
            FOREIGN KEY (roupa_id) REFERENCES roupas(id),
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )`);
        
        console.log('✅ Tabelas verificadas/criadas com sucesso');
    });
}

module.exports = db;