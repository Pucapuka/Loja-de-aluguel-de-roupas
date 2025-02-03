import { Router } from 'express';
import { listarProdutos, obterProduto, criarProduto, atualizarProduto, excluirProduto } from '../controllers/produtoController';

const router = Router();

// Rotas
router.get('/produtos', listarProdutos);
router.get('/produtos/:id', obterProduto); // ❗ Adicionada a rota para obter um produto pelo ID
router.post('/produtos', criarProduto);
router.put('/produtos/:id', atualizarProduto);
router.delete('/produtos/:id', excluirProduto); // ❗ Corrigido o nome da função

export default router;
