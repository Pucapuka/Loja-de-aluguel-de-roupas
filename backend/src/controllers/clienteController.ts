import { Request, Response } from 'express';
import db from '../services/db';

// ✅ Listar todos os clientes
export const listarClientes = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM clientes');
    client.release();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar clientes', details: err });
  }
};

// ✅ Obter um cliente pelo ID
export const obterCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM clientes WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar cliente', details: err });
  }
};

// ✅ Criar um novo cliente
export const criarCliente = async (req: Request, res: Response): Promise<void> => {
  const { nome, telefone, email } = req.body;

  if (!nome || !email || !telefone) {
    res.status(400).json({ error: 'Nome, telefone e e-mail são obrigatórios' });
    return;
  }

  try {
    const client = await db.connect();
    const query = 'INSERT INTO clientes (nome, telefone, email) VALUES ($1, $2, $3) RETURNING *';
    const values = [nome, telefone, email];

    const result = await client.query(query, values);
    client.release();

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar cliente', details: err });
  }
};

// ✅ Atualizar um cliente pelo ID
export const atualizarCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { nome, telefone, email } = req.body;

  try {
    const client = await db.connect();
    const query = 'UPDATE clientes SET nome = $1, telefone = $2, email = $3 WHERE id = $4 RETURNING *';
    const values = [nome, telefone, email, id];

    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar cliente', details: err });
  }
};

// ✅ Excluir um cliente pelo ID
export const excluirCliente = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await db.connect();
    const query = 'DELETE FROM clientes WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Cliente não encontrado' });
      return;
    }

    res.status(200).json({ message: 'Cliente excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir cliente', details: err });
  }
};
