const express = require('express');
const router = express.Router();
const aluguelController = require('../controllers/aluguelController');

// Listar aluguéis
router.get('/', aluguelController.listarAlugueis);

// Criar aluguel (cabeçalho)
router.post('/', aluguelController.criarAluguel);

// Adicionar item ao aluguel
router.post('/itens', aluguelController.adicionarItem);

// Obter aluguel com itens
router.get('/:id/itens', aluguelController.obterAluguelComItens);

// Remover item do aluguel
router.delete('/itens/:id', aluguelController.removerItem);

// Finalizar aluguel
router.put('/:id/finalizar', aluguelController.finalizarAluguel);

// Deletar aluguel
router.delete('/:id', aluguelController.deletarAluguel);

module.exports = router;