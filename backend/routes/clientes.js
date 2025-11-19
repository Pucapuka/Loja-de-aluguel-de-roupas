const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar clientes
router.get('/', (req, res) => {
  db.all('SELECT * FROM clientes', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Criar cliente
router.post('/', (req, res) => {
  const { nome, telefone, email } = req.body;
  db.run(
    'INSERT INTO clientes (nome, telefone, email) VALUES (?, ?, ?)',
    [nome, telefone, email],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// Atualizar cliente
router.put('/:id', (req, res) => {
  const { nome, telefone, email } = req.body;
  db.run(
    'UPDATE clientes SET nome=?, telefone=?, email=? WHERE id=?',
    [nome, telefone, email, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ changes: this.changes });
    }
  );
});

// Deletar cliente
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM clientes WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ changes: this.changes });
  });
});

module.exports = router;
