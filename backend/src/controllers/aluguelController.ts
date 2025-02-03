import { Request, Response } from 'express';
import db from '../services/db';

// Listar todos os aluguéis
export const listarAlugueis = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM alugueis');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar aluguéis' });
  }
};

// Criar um novo aluguel
export const criarAluguel = async (req: Request, res: Response) => {
  const { clienteId, produtoId, dataRetirada, dataDevolucao } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO alugueis (cliente_id, produto_id, data_retirada, data_devolucao, valor_total) VALUES ($1, $2, $3, $4, (SELECT preco FROM produtos WHERE id = $2)) RETURNING *',
      [clienteId, produtoId, dataRetirada, dataDevolucao]
    );
    await db.query('UPDATE produtos SET disponibilidade = false WHERE id = $1', [produtoId]); // Marca o produto como indisponível
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar aluguel' });
  }
};

// Finalizar um aluguel
export const finalizarAluguel = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'UPDATE alugueis SET finalizado = true WHERE id = $1 RETURNING *',
      [id]
    );
    await db.query('UPDATE produtos SET disponibilidade = true WHERE id = (SELECT produto_id FROM alugueis WHERE id = $1)', [id]); // Marca o produto como disponível
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao finalizar aluguel' });
  }
};
