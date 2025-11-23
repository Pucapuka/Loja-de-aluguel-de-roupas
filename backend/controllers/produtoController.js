const db = require('../db');

const produtoController = {
    // Listar produtos - ordenado por ID DESC (mais recente primeiro)
    listarProdutos: (req, res) => {
        db.all('SELECT * FROM produtos ORDER BY id DESC', [], (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows);
        });
    },

    // Obter produto por ID
    obterProduto: (req, res) => {
        const { id } = req.params;
        db.get('SELECT * FROM produtos WHERE id = ?', [id], (err, row) => {
            if (err) return res.status(500).json({ error: err.message });
            if (!row) return res.status(404).json({ error: 'Produto não encontrado' });
            res.json(row);
        });
    },

    // Criar produto
    criarProduto: (req, res) => {
        const { codigo, nome, tamanho, cor, preco_aluguel, estoque } = req.body;
        
        if (!codigo || !nome) {
            return res.status(400).json({ error: 'Código e nome são obrigatórios' });
        }

        db.run(
            'INSERT INTO produtos (codigo, nome, tamanho, cor, preco_aluguel, estoque) VALUES (?, ?, ?, ?, ?, ?)',
            [codigo, nome, tamanho, cor, preco_aluguel || 0, estoque || 0],
            function(err) {
                if (err) {
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({ error: 'Código do produto já existe' });
                    }
                    return res.status(500).json({ error: err.message });
                }
                res.json({ 
                    id: this.lastID,
                    message: 'Produto criado com sucesso'
                });
            }
        );
    },

    // Atualizar produto
    atualizarProduto: (req, res) => {
        const { id } = req.params;
        const { codigo, nome, tamanho, cor, preco_aluguel, estoque } = req.body;
        
        db.run(
            'UPDATE produtos SET codigo=?, nome=?, tamanho=?, cor=?, preco_aluguel=?, estoque=? WHERE id=?',
            [codigo, nome, tamanho, cor, preco_aluguel, estoque, id],
            function(err) {
                if (err) return res.status(500).json({ error: err.message });
                if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
                res.json({ 
                    changes: this.changes,
                    message: 'Produto atualizado com sucesso'
                });
            }
        );
    },

    // Deletar produto
    deletarProduto: (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM produtos WHERE id=?', [id], function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Produto não encontrado' });
            res.json({ 
                changes: this.changes,
                message: 'Produto deletado com sucesso'
            });
        });
    }
};

module.exports = produtoController;