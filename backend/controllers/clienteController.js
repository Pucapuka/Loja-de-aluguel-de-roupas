const db = require('../db');

const clienteController = {
    // Listar clientes
    listarClientes: (req, res) => {
        db.all('SELECT * FROM clientes ORDER BY nome', [], (err, rows) => {
            if (err) return res.status(500).json(err);
            res.json(rows);
        });
    },

    // Criar cliente
    criarCliente: (req, res) => {
        const { nome, telefone, email, endereco } = req.body;
        db.run(
            'INSERT INTO clientes (nome, telefone, email, endereco) VALUES (?, ?, ?, ?)',
            [nome, telefone, email, endereco],
            function(err) {
                if (err) return res.status(500).json(err);
                res.json({ id: this.lastID });
            }
        );
    },

    // Atualizar cliente
    atualizarCliente: (req, res) => {
        const { id } = req.params;
        const { nome, telefone, email, endereco } = req.body;
        db.run(
            'UPDATE clientes SET nome=?, telefone=?, email=?, endereco=? WHERE id=?',
            [nome, telefone, email, endereco, id],
            function(err) {
                if (err) return res.status(500).json(err);
                res.json({ changes: this.changes });
            }
        );
    },

    // Deletar cliente
    deletarCliente: (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM clientes WHERE id=?', [id], function(err) {
            if (err) return res.status(500).json(err);
            res.json({ changes: this.changes });
        });
    }
};

module.exports = clienteController;