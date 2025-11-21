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
    // Remove o banco de dados existente para recriar com estrutura correta
    db.serialize(() => {
        // Drop tables se existirem (em ordem correta por dependências)
        db.run(`DROP TABLE IF EXISTS aluguel_itens`);
        db.run(`DROP TABLE IF EXISTS alugueis`);
        db.run(`DROP TABLE IF EXISTS roupas`);
        db.run(`DROP TABLE IF EXISTS clientes`);

        // Tabela de roupas
        db.run(`CREATE TABLE IF NOT EXISTS roupas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            tamanho TEXT,
            cor TEXT,
            preco_aluguel REAL,
            status TEXT DEFAULT 'disponível'
        )`);

        // Tabela de clientes
        db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT,
            endereco TEXT,
            email TEXT
        )`);

        // Tabela de alugueis (ESTRUTURA CORRETA - sem roupa_id)
        db.run(`CREATE TABLE IF NOT EXISTS alugueis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            data_inicio TEXT,
            data_fim TEXT,
            valor_total REAL DEFAULT 0,
            status TEXT DEFAULT 'ativo',
            data_criacao TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        )`);

        // Tabela de itens do aluguel
        db.run(`CREATE TABLE IF NOT EXISTS aluguel_itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluguel_id INTEGER NOT NULL,
            roupa_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL DEFAULT 1,
            valor_unitario REAL NOT NULL,
            total_parcial REAL NOT NULL,
            FOREIGN KEY (aluguel_id) REFERENCES alugueis(id) ON DELETE CASCADE,
            FOREIGN KEY (roupa_id) REFERENCES roupas(id)
        )`);

        console.log('✅ Tabelas criadas com estrutura correta');
        
        // Insere alguns dados de exemplo
        db.run(`INSERT OR IGNORE INTO clientes (nome, telefone, email) VALUES 
                ('João Silva', '(11) 99999-9999', 'joao@email.com'),
                ('Maria Santos', '(11) 88888-8888', 'maria@email.com')`);
                
        db.run(`INSERT OR IGNORE INTO roupas (nome, tamanho, cor, preco_aluguel, status) VALUES 
                ('Vestido Longo', 'M', 'Preto', 50.00, 'disponível'),
                ('Terno Social', 'G', 'Azul Marinho', 80.00, 'disponível'),
                ('Blazer Feminino', 'P', 'Branco', 40.00, 'disponível')`);
    });
}

module.exports = db;