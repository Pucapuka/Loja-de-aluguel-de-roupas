const db = require('../db');

const aluguelController = {
    // Listar todos os aluguéis
    listarAlugueis: (req, res) => {
        const sql = `
            SELECT 
                a.*,
                c.nome as cliente_nome,
                (SELECT COUNT(*) FROM aluguel_itens WHERE aluguel_id = a.id) as total_itens
            FROM alugueis a
            LEFT JOIN clientes c ON a.cliente_id = c.id
            ORDER BY a.id DESC
        `;
        
        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error('❌ Erro ao buscar aluguéis:', err.message);
                return res.status(500).json({ 
                    error: 'Erro interno do servidor',
                    details: err.message 
                });
            }
            console.log(`✅ ${rows.length} aluguéis encontrados`);
            res.json(rows || []);
        });
    },

    // Criar aluguel (cabeçalho)
    criarAluguel: (req, res) => {
        const { cliente_id, data_inicio, data_fim } = req.body;
        
        if (!cliente_id || !data_inicio || !data_fim) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const sql = `INSERT INTO alugueis (cliente_id, data_inicio, data_fim) VALUES (?, ?, ?)`;
        
        db.run(sql, [cliente_id, data_inicio, data_fim], function(err) {
            if (err) {
                console.error('❌ Erro ao criar aluguel:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ Aluguel criado ID: ${this.lastID}`);
            res.json({ id: this.lastID });
        });
    },

    // Adicionar item ao aluguel
    adicionarItem: (req, res) => {
        const { aluguel_id, produto_id, quantidade, valor_unitario } = req.body;
        
        if (!aluguel_id || !produto_id || !quantidade || !valor_unitario) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const total_parcial = quantidade * valor_unitario;
        const sql = `INSERT INTO aluguel_itens (aluguel_id, produto_id, quantidade, valor_unitario, total_parcial) 
                     VALUES (?, ?, ?, ?, ?)`;
        
        db.run(sql, [aluguel_id, produto_id, quantidade, valor_unitario, total_parcial], function(err) {
            if (err) {
                console.error('❌ Erro ao adicionar item:', err.message);
                return res.status(500).json({ error: err.message });
            }
            
            // Atualizar valor total do aluguel
            const updateSql = `UPDATE alugueis 
                             SET valor_total = (SELECT SUM(total_parcial) FROM aluguel_itens WHERE aluguel_id = ?) 
                             WHERE id = ?`;
            db.run(updateSql, [aluguel_id, aluguel_id], (err) => {
                if (err) {
                    console.error('❌ Erro ao atualizar valor total:', err.message);
                    return res.status(500).json({ error: err.message });
                }
                console.log(`✅ Item adicionado ao aluguel ${aluguel_id}`);
                res.json({ id: this.lastID });
            });
        });
    },

    // Obter aluguel com itens
    obterAluguelComItens: (req, res) => {
        const { id } = req.params;
        const sql = `
            SELECT 
                a.*,
                c.nome as cliente_nome,
                c.telefone as cliente_telefone,
                ai.id as item_id,
                ai.produto_id,
                ai.quantidade,
                ai.valor_unitario,
                ai.total_parcial,
                p.nome as produto_nome,
                p.tamanho,
                p.cor
            FROM alugueis a
            LEFT JOIN clientes c ON a.cliente_id = c.id
            LEFT JOIN aluguel_itens ai ON a.id = ai.aluguel_id
            LEFT JOIN produtos p ON ai.produto_id = p.id
            WHERE a.id = ?
        `;
        
        db.all(sql, [id], (err, rows) => {
            if (err) {
                console.error('❌ Erro ao buscar itens do aluguel:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ ${rows.length} itens encontrados para aluguel ${id}`);
            res.json(rows || []);
        });
    },

    // Remover item do aluguel
    removerItem: (req, res) => {
        const { id } = req.params;
        
        // Primeiro pega o aluguel_id
        db.get('SELECT aluguel_id FROM aluguel_itens WHERE id = ?', [id], (err, row) => {
            if (err) {
                console.error('❌ Erro ao buscar item:', err.message);
                return res.status(500).json({ error: err.message });
            }
            if (!row) {
                return res.status(404).json({ error: 'Item não encontrado' });
            }
            
            const aluguel_id = row.aluguel_id;
            
            // Remove o item
            db.run('DELETE FROM aluguel_itens WHERE id = ?', [id], function(err) {
                if (err) {
                    console.error('❌ Erro ao remover item:', err.message);
                    return res.status(500).json({ error: err.message });
                }
                
                // Atualiza o valor total
                const updateSql = `UPDATE alugueis 
                                 SET valor_total = COALESCE((SELECT SUM(total_parcial) FROM aluguel_itens WHERE aluguel_id = ?), 0) 
                                 WHERE id = ?`;
                db.run(updateSql, [aluguel_id, aluguel_id], (err) => {
                    if (err) {
                        console.error('❌ Erro ao atualizar valor total:', err.message);
                        return res.status(500).json({ error: err.message });
                    }
                    console.log(`✅ Item ${id} removido do aluguel ${aluguel_id}`);
                    res.json({ changes: this.changes });
                });
            });
        });
    },

    // Finalizar aluguel
    finalizarAluguel: (req, res) => {
        const { id } = req.params;
        db.run('UPDATE alugueis SET status = "finalizado" WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('❌ Erro ao finalizar aluguel:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ Aluguel ${id} finalizado`);
            res.json({ changes: this.changes });
        });
    },

    // Deletar aluguel
    deletarAluguel: (req, res) => {
        const { id } = req.params;
        db.run('DELETE FROM alugueis WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('❌ Erro ao deletar aluguel:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ Aluguel ${id} deletado`);
            res.json({ changes: this.changes });
        });
    }
};

module.exports = aluguelController;