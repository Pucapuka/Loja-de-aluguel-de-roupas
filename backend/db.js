require('dotenv').config();
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
        // Tabela de produtos
        db.run(`CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            nome TEXT NOT NULL,
            tamanho TEXT,
            cor TEXT,
            preco_aluguel REAL,
            estoque INTEGER DEFAULT 0
        )`);

        // Tabela de clientes
        db.run(`CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE,
            telefone TEXT,
            endereco TEXT,
            email TEXT,
            data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela de alugueis
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
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL DEFAULT 1,
            valor_unitario REAL NOT NULL,
            total_parcial REAL NOT NULL,
            FOREIGN KEY (aluguel_id) REFERENCES alugueis(id) ON DELETE CASCADE,
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        )`);

            // Tabela para pagamentos fractionados
        db.run(`CREATE TABLE IF NOT EXISTS pagamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluguel_id INTEGER NOT NULL,
            valor REAL NOT NULL,
            forma_pagamento TEXT NOT NULL,
            data_vencimento DATE,
            data_pagamento DATE,
            status TEXT DEFAULT 'pendente',
            observacao TEXT,
            FOREIGN KEY (aluguel_id) REFERENCES alugueis (id) ON DELETE CASCADE
        )`);
        
        console.log('✅ Estrutura de tabelas verificada/criada');
        
        // VERIFICAR se precisa inserir dados de exemplo
        checkAndInsertSampleData();
    });
}

function checkAndInsertSampleData() {
    // Verificar se já existem produtos no banco
    db.get("SELECT COUNT(*) as count FROM produtos", [], (err, row) => {
        if (err) {
            console.error('❌ Erro ao verificar dados:', err.message);
            return;
        }
        
        if (row.count === 0) {
            console.log('📝 Inserindo dados de exemplo...');
            insertSampleData();
        } else {
            console.log(`✅ Banco já contém ${row.count} produtos (não inserindo dados de exemplo)`);
            
            // Apenas mostrar contagem atual
            showDataCounts();
        }
    });
}

function insertSampleData() {
    // Clientes - usar INSERT OR IGNORE para evitar erros de duplicação
    db.run(`INSERT OR IGNORE INTO clientes (nome, cpf, telefone, email, endereco) VALUES 
            ('João Silva', '12345678901', '(11) 99999-9999', 'joao@email.com', 'Rua A, 123 - Centro'),
            ('Maria Santos', '98765432100', '(11) 88888-8888', 'maria@email.com', 'Av. B, 456 - Jardim'),
            ('Pedro Oliveira', '11122233344', '(11) 77777-7777', 'pedro@email.com', 'Travessa C, 789 - Vila Nova')`, 
    function(err) {
        if (err) {
            console.error('❌ Erro ao inserir clientes:', err.message);
        } else {
            console.log(`✅ ${this.changes} clientes de exemplo inseridos`);
        }
    });
    
    // Produtos - usar INSERT OR IGNORE para evitar erros de duplicação
    db.run(`INSERT OR IGNORE INTO produtos (codigo, nome, tamanho, cor, preco_aluguel, estoque) VALUES 
            ('P-001', 'Vestido Longo Elegante', 'M', 'Preto', 50.00, 5),
            ('P-002', 'Terno Social', 'G', 'Azul Marinho', 80.00, 3),
            ('P-003', 'Blazer Feminino', 'P', 'Branco', 40.00, 0),
            ('P-004', 'Vestido Curto Festa', 'P', 'Vermelho', 35.00, 2),
            ('P-005', 'Smoking', 'M', 'Preto', 100.00, 1),
            ('P-006', 'Saia Longa', 'M', 'Azul', 30.00, 4),
            ('P-007', 'Calça Social', 'G', 'Cinza', 45.00, 2),
            ('P-008', 'Camisa Social', 'M', 'Branco', 25.00, 6)`, 
    function(err) {
        if (err) {
            console.error('❌ Erro ao inserir produtos:', err.message);
        } else {
            console.log(`✅ ${this.changes} produtos de exemplo inseridos`);
            
            // Mostrar contagem final
            showDataCounts();
        }
    });
}

function showDataCounts() {
    // Verifica se os dados foram inseridos corretamente
    db.get("SELECT COUNT(*) as count FROM produtos", [], (err, row) => {
        if (!err) {
            console.log(`📊 ${row.count} produtos no banco`);
        }
    });
    
    db.get("SELECT COUNT(*) as count FROM clientes", [], (err, row) => {
        if (!err) {
            console.log(`👥 ${row.count} clientes no banco`);
        }
    });
    
    db.get("SELECT COUNT(*) as count FROM alugueis", [], (err, row) => {
        if (!err) {
            console.log(`📦 ${row.count} aluguéis no banco`);
        }
    });
}

module.exports = db;