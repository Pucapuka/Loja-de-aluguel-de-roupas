const express = require('express');
const router = express.Router();
const db = require('../db');

// Listar aluguéis
router.get('/', (req, res) => {
  db.all('SELECT * FROM alugueis', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

// Criar aluguel
router.post('/', (req, res) => {
  const { roupa_id, cliente_id, data_inicio, data_fim, valor_total } = req.body;
  db.run(
    'INSERT INTO alugueis (roupa_id, cliente_id, data_inicio, data_fim, valor_total) VALUES (?, ?, ?, ?, ?)',
    [roupa_id, cliente_id, data_inicio, data_fim, valor_total],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ id: this.lastID });
    }
  );
});

// Atualizar aluguel
router.put('/:id', (req, res) => {
  const { roupa_id, cliente_id, data_inicio, data_fim, valor_total } = req.body;
  db.run(
    'UPDATE alugueis SET roupa_id=?, cliente_id=?, data_inicio=?, data_fim=?, valor_total=? WHERE id=?',
    [roupa_id, cliente_id, data_inicio, data_fim, valor_total, req.params.id],
    function (err) {
      if (err) return res.status(500).json(err);
      res.json({ changes: this.changes });
    }
  );
});

// Deletar aluguel
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM alugueis WHERE id=?', [req.params.id], function (err) {
    if (err) return res.status(500).json(err);
    res.json({ changes: this.changes });
  });
});

module.exports = router;
