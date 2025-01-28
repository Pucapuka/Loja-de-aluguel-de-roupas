import { Router } from 'express';
import { listarProdutos, criarProduto, atualizarProduto, deletarProduto } from '../controllers/produtoController';

const router = Router();

// Rotas
router.get('/', listarProdutos);
router.post('/', criarProduto);
router.put('/:id', atualizarProduto);
router.delete('/:id', deletarProduto);

export default router;
