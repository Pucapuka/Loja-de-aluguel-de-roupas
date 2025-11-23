const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

// Listar produtos
router.get('/', produtoController.listarProdutos);

// Obter produto por ID
router.get('/:id', produtoController.obterProduto);

// Criar produto
router.post('/', produtoController.criarProduto);

// Atualizar produto
router.put('/:id', produtoController.atualizarProduto);

// Deletar produto
router.delete('/:id', produtoController.deletarProduto);

module.exports = router;