const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

// Listar clientes
router.get('/', clienteController.listarClientes);

// Criar cliente
router.post('/', clienteController.criarCliente);

// Atualizar cliente
router.put('/:id', clienteController.atualizarCliente);

// Deletar cliente
router.delete('/:id', clienteController.deletarCliente);

module.exports = router;