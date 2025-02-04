import { Request, Response } from 'express';
import db from '../services/db';

// Listar todos os aluguéis
export const listarAlugueis = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await db.query('SELECT * FROM alugueis');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao listar aluguéis:', err);
    res.status(500).json({ error: 'Erro ao listar aluguéis' });
  }
};

// Criar um novo aluguel
export const criarAluguel = async (req: Request, res: Response): Promise<void> => {
  const { clienteId, produtoId, dataRetirada, dataDevolucao } = req.body;

  try {
    // Verifica se o produto está disponível
    const produtoCheck = await db.query(
      'SELECT disponibilidade, preco FROM produtos WHERE id = $1',
      [produtoId]
    );

    if (produtoCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    if (!produtoCheck.rows[0].disponibilidade) {
      return res.status(400).json({ error: 'Produto já está alugado' });
    }

    // Calcula a diferença de dias
    const diffDias = Math.ceil(
      (new Date(dataDevolucao).getTime() - new Date(dataRetirada).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (diffDias <= 0) {
      return res.status(400).json({ error: 'Datas inválidas' });
    }

    const valorTotal = diffDias * produtoCheck.rows[0].preco;

    // Insere o aluguel
    const result = await db.query(
      'INSERT INTO alugueis (cliente_id, produto_id, data_retirada, data_devolucao, valor_total) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [clienteId, produtoId, dataRetirada, dataDevolucao, valorTotal]
    );

    // Atualiza disponibilidade do produto
    await db.query(
      'UPDATE produtos SET disponibilidade = false WHERE id = $1',
      [produtoId]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar aluguel:', err);
    res.status(500).json({ error: 'Erro ao criar aluguel' });
  }
};

// Finalizar um aluguel
export const finalizarAluguel = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    // Verifica se o aluguel existe e não está finalizado
    const aluguelCheck = await db.query(
      'SELECT produto_id, finalizado FROM alugueis WHERE id = $1',
      [id]
    );

    if (aluguelCheck.rowCount === 0) {
      return res.status(404).json({ error: 'Aluguel não encontrado' });
    }

    if (aluguelCheck.rows[0].finalizado) {
      return res.status(400).json({ error: 'Aluguel já finalizado' });
    }

    // Finaliza o aluguel
    const result = await db.query(
      'UPDATE alugueis SET finalizado = true WHERE id = $1 RETURNING *',
      [id]
    );

    // Atualiza a disponibilidade do produto
    await db.query(
      'UPDATE produtos SET disponibilidade = true WHERE id = $1',
      [aluguelCheck.rows[0].produto_id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao finalizar aluguel:', err);
    res.status(500).json({ error: 'Erro ao finalizar aluguel' });
  }
};


// //Sugestão de IA

// // backend/src/controllers/aluguelController.ts

// import { Request, Response } from 'express';
// import { Aluguel } from '../models/Aluguel'; // Vamos assumir que o modelo Aluguel já está criado

// // Criar um novo aluguel
// export const criarAluguel = async (req: Request, res: Response) => {
//   try {
//     const { clienteId, produtoId, dataInicio, dataFim } = req.body;
    
//     const aluguel = await Aluguel.create({
//       clienteId,
//       produtoId,
//       dataInicio,
//       dataFim,
//     });
    
//     return res.status(201).json(aluguel);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Erro ao criar aluguel' });
//   }
// };

// // Listar todos os aluguéis
// export const listarAlugueis = async (req: Request, res: Response) => {
//   try {
//     const alugueis = await Aluguel.findAll();
//     return res.status(200).json(alugueis);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Erro ao listar aluguéis' });
//   }
// };

// // Obter aluguel específico
// export const obterAluguel = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const aluguel = await Aluguel.findByPk(id);

//     if (!aluguel) {
//       return res.status(404).json({ error: 'Aluguel não encontrado' });
//     }

//     return res.status(200).json(aluguel);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Erro ao obter aluguel' });
//   }
// };

// // Atualizar um aluguel
// export const atualizarAluguel = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { clienteId, produtoId, dataInicio, dataFim } = req.body;
    
//     const aluguel = await Aluguel.findByPk(id);

//     if (!aluguel) {
//       return res.status(404).json({ error: 'Aluguel não encontrado' });
//     }

//     aluguel.clienteId = clienteId;
//     aluguel.produtoId = produtoId;
//     aluguel.dataInicio = dataInicio;
//     aluguel.dataFim = dataFim;

//     await aluguel.save();
    
//     return res.status(200).json(aluguel);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Erro ao atualizar aluguel' });
//   }
// };

// // Deletar aluguel
// export const deletarAluguel = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const aluguel = await Aluguel.findByPk(id);

//     if (!aluguel) {
//       return res.status(404).json({ error: 'Aluguel não encontrado' });
//     }

//     await aluguel.destroy();
    
//     return res.status(204).json({ message: 'Aluguel deletado com sucesso' });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ error: 'Erro ao deletar aluguel' });
//   }
// };
