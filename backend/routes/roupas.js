const express = require('express');
const router = express.Router();
const db = require('../db');

// listar roupas
router.get('/', (req, res) => {
  db.all('SELECT * FROM roupas', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// criar roupa
router.post('/', (req, res) => {
  const { nome, tamanho, cor, preco_aluguel, status } = req.body;
  db.run(
    'INSERT INTO roupas (nome, tamanho, cor, preco_aluguel, status) VALUES (?, ?, ?, ?, ?)',
    [nome, tamanho, cor, preco_aluguel, status],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// atualizar roupa
router.put('/:id', (req, res) => {
  const { nome, tamanho, cor, preco_aluguel, status } = req.body;
  db.run(
    'UPDATE roupas SET nome=?, tamanho=?, cor=?, preco_aluguel=?, status=? WHERE id=?',
    [nome, tamanho, cor, preco_aluguel, status, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ changes: this.changes });
    }
  );
});

// deletar roupa
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM roupas WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ changes: this.changes });
  });
});

module.exports = router;
