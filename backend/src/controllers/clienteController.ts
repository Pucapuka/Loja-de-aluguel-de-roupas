import { Request, Response } from 'express';
import { db } from '../services/db';

export const listarClientes = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM clientes');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};
