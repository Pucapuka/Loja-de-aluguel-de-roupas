const express = require('express');
const router = express.Router();
const pagamentoController = require('../controllers/pagamentoController');

// ✅ ROTAS CORRETAS - Certifique-se de que está EXATAMENTE assim:

// Listar pagamentos de um aluguel
router.get('/aluguel/:aluguel_id', pagamentoController.listarPagamentos);

// Adicionar pagamento
router.post('/', pagamentoController.adicionarPagamento);

// Obter resumo
router.get('/aluguel/:aluguel_id/resumo', pagamentoController.obterResumoPagamentos);

// Atualizar pagamento
router.put('/:id', pagamentoController.atualizarPagamento);

// Marcar como pago
router.patch('/:id/pagar', pagamentoController.marcarComoPago);

// Remover pagamento
router.delete('/:id', pagamentoController.removerPagamento);

// ✅ VERIFIQUE se esta linha está no FINAL do arquivo:
module.exports = router;