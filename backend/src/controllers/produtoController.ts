import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import db from '../services/db';

// ✅ Listar todos os produtos
export const listarProdutos = async (req: Request, res: Response): Promise<Response> => {
  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM produtos');
    client.release();
    return res.status(200).json(result.rows); // Retorna a resposta aqui
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar produtos', details: err });
  }
};

// ✅ Obter um produto pelo ID
export const obterProduto = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const client = await db.connect();
    const result = await client.query('SELECT * FROM produtos WHERE id = $1', [id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.status(200).json(result.rows[0]); // Retorna a resposta aqui
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar produto', details: err });
  }
};

// ✅ Criar um novo produto
export const criarProduto = [
  // Validações dos campos
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('preco').isNumeric().withMessage('Preço deve ser um número válido'),
  body('quantidade').isNumeric().withMessage('Quantidade deve ser um número válido'),

  // Função de criação
  async (req: Request, res: Response): Promise<Response> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Retorna a resposta aqui
    }

    const { nome, descricao, preco, quantidade } = req.body;

    try {
      const client = await db.connect();
      const query = 'INSERT INTO produtos (nome, descricao, preco, quantidade) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [nome, descricao, preco, quantidade];

      const result = await client.query(query, values);
      client.release();

      return res.status(201).json(result.rows[0]); // Retorna a resposta aqui
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao criar produto', details: err });
    }
  },
];

// ✅ Atualizar um produto pelo ID
export const atualizarProduto = [
  // Validações dos campos
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('preco').optional().isNumeric().withMessage('Preço deve ser um número válido'),
  body('quantidade').optional().isNumeric().withMessage('Quantidade deve ser um número válido'),

  // Função de atualização
  async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { nome, descricao, preco, quantidade } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // Retorna a resposta aqui
    }

    try {
      const client = await db.connect();
      const query = 'UPDATE produtos SET nome = $1, descricao = $2, preco = $3, quantidade = $4 WHERE id = $5 RETURNING *';
      const values = [nome, descricao, preco, quantidade, id];

      const result = await client.query(query, values);
      client.release();

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Produto não encontrado' });
      }

      return res.status(200).json(result.rows[0]); // Retorna a resposta aqui
    } catch (err) {
      return res.status(500).json({ error: 'Erro ao atualizar produto', details: err });
    }
  },
];

// ✅ Excluir um produto pelo ID
export const excluirProduto = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    const client = await db.connect();
    const query = 'DELETE FROM produtos WHERE id = $1 RETURNING *';
    const result = await client.query(query, [id]);
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    return res.status(200).json({ message: 'Produto excluído com sucesso' }); // Retorna a resposta aqui
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao excluir produto', details: err });
  }
};
