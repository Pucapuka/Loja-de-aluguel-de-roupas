import { Router } from 'express';
import { listarProdutos, obterProduto, criarProduto, atualizarProduto, excluirProduto } from '../controllers/produtoController';

const router = Router();

router.get('/', listarProdutos);
router.get('/:id', obterProduto);
router.post('/', criarProduto);
router.put('/:id', atualizarProduto);
router.delete('/:id', excluirProduto);

export default router;
