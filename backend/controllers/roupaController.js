const db = require('../db');

const roupaController = {
    // Listar roupas
    listarRoupas: (req, res) => {
        db.all('SELECT * FROM roupas ORDER BY nome', [], (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        });
    },

    // Criar roupa
    criarRoupa: (req, res) => {
        const { nome, tamanho, cor, preco_aluguel, status } = req.body;
        db.run(
            'INSERT INTO roupas (nome, tamanho, cor, preco_aluguel, status) VALUES (?, ?, ?, ?, ?)',
            [nome, tamanho, cor, preco_aluguel, status || 'disponível'],
            function(err) {
                if (err) return res.status(500).json(err);
                res.json({ id: this.lastID });
            }
        );
    },

    // Atualizar roupa
    atualizarRoupa: (req, res) => {
        const { id } = req.params;
        const { nome, tamanho, cor, preco_aluguel, status } = req.body;
        db.run(
            'UPDATE roupas SET nome=?, tamanho=?, cor=?, preco_aluguel=?, status=? WHERE id=?',
            [nome, tamanho, cor, preco_aluguel, status, id],
            function(err) {
                if (err) return res.status(500).json(err);
                res.json({ changes: this.changes });
            }
        );
    },

    // Deletar roupa
    deletarRoupa: (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM roupas WHERE id=?', [id], function(err) {
            if (err) return res.status(500).json(err);
            res.json({ changes: this.changes });
        });
    }
};

module.exports = roupaController;