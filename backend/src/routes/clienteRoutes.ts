import { Router } from 'express';
import { listarClientes, obterCliente, criarCliente, atualizarCliente, excluirCliente } from '../controllers/clienteController';

const router = Router();

// Definição das rotas
router.get('/', listarClientes);
router.get('/:id', obterCliente);
router.post('/', criarCliente);
router.put('/:id', atualizarCliente);
router.delete('/:id', excluirCliente);

export default router;
