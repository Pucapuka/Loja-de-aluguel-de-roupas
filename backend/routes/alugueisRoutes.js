const express = require('express');
const router = express.Router();
const aluguelController = require('../controllers/aluguelController');

// Listar todos os aluguéis
router.get('/', aluguelController.listarAlugueis);

// Obter aluguel específico (retorna linhas com item_id quando houver itens)
router.get('/:id', aluguelController.obterAluguelComItens);

// Obter aluguel completo (itens + pagamentos) - rota utilizada para detalhes
router.get('/:id/completo', aluguelController.obterAluguelCompleto);

// Criar novo aluguel (cabeçalho)
router.post('/', aluguelController.criarAluguel);

// Adicionar item ao aluguel (aceita aluguel_id no body)
router.post('/itens', aluguelController.adicionarItem);

// Remover item do aluguel por id do item
router.delete('/itens/:id', aluguelController.removerItem);

// Finalizar aluguel
router.patch('/:id/finalizar', aluguelController.finalizarAluguel);

// Deletar aluguel
router.delete('/:id', aluguelController.deletarAluguel);

module.exports = router;