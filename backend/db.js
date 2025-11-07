const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database', 'loja.db');
const db = new sqlite3.Database(dbPath);

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
});

module.exports = db;
