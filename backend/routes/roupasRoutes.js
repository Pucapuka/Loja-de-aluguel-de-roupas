const express = require('express');
const router = express.Router();
const roupaController = require('../controllers/roupaController');

// Listar roupas
router.get('/', roupaController.listarRoupas);

// Criar roupa
router.post('/', roupaController.criarRoupa);

// Atualizar roupa
router.put('/:id', roupaController.atualizarRoupa);

// Deletar roupa
router.delete('/:id', roupaController.deletarRoupa);

module.exports = router;