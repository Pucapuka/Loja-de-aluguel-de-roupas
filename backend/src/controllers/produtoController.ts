import { Request, Response } from 'express';
import db from '../services/db';

// ✅ Listar todos os produtos
export const listarProdutos = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM produtos');
    client.release();
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produtos', details: err });
  }
};


// ✅ Obter um produto pelo ID
export const obterProduto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM produtos WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar produto', details: err });
  }
};

// ✅ Criar um novo produto
export const criarProduto = async (req: Request, res: Response): Promise<void> => {
  const { tipo, tamanho, cor, preco, disponibilidade } = req.body;

  try {
    const client = await db.connect();
    const query = 'INSERT INTO produtos (tipo, tamanho, cor, preco, disponibilidade) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [tipo, tamanho, cor, preco, disponibilidade];

    const result = await client.query(query, values);
    client.release();

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto', details: err });
  }
};

// ✅ Atualizar um produto pelo ID
export const atualizarProduto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { tipo, tamanho, cor, preco, disponibilidade } = req.body;

  try {
    const client = await db.connect();
    const query = 'UPDATE produtos SET tipo = $1, tamanho = $2, cor = $3, preco= $4, disponibilidade = $5 WHERE id = $6 RETURNING *';
    const values = [tipo, tamanho, cor, preco, disponibilidade, id];

    const result = await client.query(query, values);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto', details: err });
  }
};

// ✅ Excluir um produto pelo ID
export const excluirProduto = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const client = await db.connect();
    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);
    client.release();

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Produto não encontrado' });
      return;
    }

    res.status(200).json({ message: 'Produto excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir produto', details: err });
  }
};
