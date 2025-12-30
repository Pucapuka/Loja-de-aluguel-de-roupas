use rusqlite::{Connection};
use std::sync::Mutex;


pub struct DbState {
    pub conn: Mutex<Connection>,
}

pub fn init_db(_app_handle: tauri::AppHandle) -> DbState {
    // Caminho do banco de dados na pasta do usuário
    let home_dir = dirs::home_dir().expect("Não foi possível acessar home");
    let db_path = home_dir.join(".loja-roupas").join("loja.db");

    // Criar diretório se não existir
    std::fs::create_dir_all(db_path.parent().unwrap()).expect("Não foi possível criar diretório do banco");

    // Conectar ao SQLite
    let conn = Connection::open(db_path).expect("Erro ao abrir banco SQLite");

    // Criar tabelas se não existirem
    conn.execute_batch(
        "
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codigo TEXT UNIQUE NOT NULL,
            nome TEXT NOT NULL,
            tamanho TEXT,
            cor TEXT,
            preco_aluguel REAL,
            estoque INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cpf TEXT UNIQUE,
            telefone TEXT,
            endereco TEXT,
            email TEXT,
            data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS alugueis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente_id INTEGER NOT NULL,
            data_inicio TEXT,
            data_fim TEXT,
            valor_total REAL DEFAULT 0,
            status TEXT DEFAULT 'ativo',
            data_criacao TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (cliente_id) REFERENCES clientes(id)
        );

        CREATE TABLE IF NOT EXISTS aluguel_itens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluguel_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL DEFAULT 1,
            valor_unitario REAL NOT NULL,
            total_parcial REAL NOT NULL,
            FOREIGN KEY (aluguel_id) REFERENCES alugueis(id) ON DELETE CASCADE,
            FOREIGN KEY (produto_id) REFERENCES produtos(id)
        );

        CREATE TABLE IF NOT EXISTS pagamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            aluguel_id INTEGER NOT NULL,
            valor REAL NOT NULL,
            forma_pagamento TEXT NOT NULL,
            data_vencimento DATE,
            data_pagamento DATE,
            status TEXT DEFAULT 'pendente',
            observacao TEXT,
            FOREIGN KEY (aluguel_id) REFERENCES alugueis(id) ON DELETE CASCADE
        );
        "
    ).expect("Erro ao criar tabelas");

    DbState {
        conn: Mutex::new(conn),
    }
}
