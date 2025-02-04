import { Router, Request, Response, NextFunction } from 'express';
import { listarAlugueis, criarAluguel, finalizarAluguel } from '../controllers/aluguelController';

const router = Router();

// Middleware para validar ID nos parâmetros
const validarId = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) {
    res.status(400).json({ error: 'ID inválido' });
    return;
  }
  next();
};

// Rotas
router.get('/', listarAlugueis);
router.post('/', criarAluguel);
router.put('/:id/finalizar', validarId, finalizarAluguel);

export default router;
