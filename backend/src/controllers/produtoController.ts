import { Request, Response } from 'express';
import { db } from '../services/db';

// Listar todos os produtos
export const listarProdutos = async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM produtos');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao listar produtos' });
  }
};

// Criar novo produto
export const criarProduto = async (req: Request, res: Response) => {
  const { tipo, tamanho, cor, preco, disponibilidade } = req.body;

  try {
    const result = await db.query(
      'INSERT INTO produtos (tipo, tamanho, cor, preco, disponibilidade) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [tipo, tamanho, cor, preco, disponibilidade]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
};

// Atualizar um produto
export const atualizarProduto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { tipo, tamanho, cor, preco, disponibilidade } = req.body;

  try {
    const result = await db.query(
      'UPDATE produtos SET tipo = $1, tamanho = $2, cor = $3, preco = $4, disponibilidade = $5 WHERE id = $6 RETURNING *',
      [tipo, tamanho, cor, preco, disponibilidade, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar produto' });
  }
};

// Deletar um produto
export const deletarProduto = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM produtos WHERE id = $1', [id]);
    res.status(200).json({ message: 'Produto deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar produto' });
  }
};
