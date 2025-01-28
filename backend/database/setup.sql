-- Criação do banco de dados
CREATE DATABASE loja_aluguel;

-- Conecte-se ao banco de dados
\c loja_aluguel;

-- Tabela de Clientes
CREATE TABLE clientes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(15),
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Produtos
CREATE TABLE produtos (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- Ex: Vestido, Terno, Bolsa
    tamanho VARCHAR(20),
    cor VARCHAR(30),
    preco NUMERIC(10, 2) NOT NULL,
    disponibilidade BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Aluguéis
CREATE TABLE alugueis (
    id SERIAL PRIMARY KEY,
    cliente_id INT NOT NULL,
    produto_id INT NOT NULL,
    data_retirada DATE NOT NULL,
    data_devolucao DATE,
    valor_total NUMERIC(10, 2),
    finalizado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes (id) ON DELETE CASCADE,
    FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE
);
