import { Router } from 'express';
import { listarAlugueis, criarAluguel, finalizarAluguel } from '../controllers/aluguelController';

const router = Router();

// Rotas
router.get('/', listarAlugueis);
router.post('/', criarAluguel);
router.put('/:id/finalizar', finalizarAluguel);

export default router;
