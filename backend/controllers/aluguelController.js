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
    }, // ⬅️ AQUI FALTOU ESTA VÍRGULA!

    // Obter aluguel completo com itens E pagamentos
    obterAluguelCompleto: (req, res) => {
        const { id } = req.params;
        
        // Buscar dados do aluguel e itens
        const sqlAluguel = `
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
        
        // Buscar pagamentos
        const sqlPagamentos = `SELECT * FROM pagamentos WHERE aluguel_id = ? ORDER BY data_vencimento ASC`;
        
        db.all(sqlAluguel, [id], (err, aluguelRows) => {
            if (err) {
                console.error('❌ Erro ao buscar aluguel:', err.message);
                return res.status(500).json({ error: err.message });
            }
            
            if (aluguelRows.length === 0) {
                return res.status(404).json({ error: 'Aluguel não encontrado' });
            }
            
            // Buscar pagamentos
            db.all(sqlPagamentos, [id], (err, pagamentoRows) => {
                if (err) {
                    console.error('❌ Erro ao buscar pagamentos:', err.message);
                    return res.status(500).json({ error: err.message });
                }
                
                // Estruturar resposta
                const aluguel = {
                    id: aluguelRows[0].id,
                    cliente_id: aluguelRows[0].cliente_id,
                    cliente_nome: aluguelRows[0].cliente_nome,
                    cliente_telefone: aluguelRows[0].cliente_telefone,
                    data_inicio: aluguelRows[0].data_inicio,
                    data_fim: aluguelRows[0].data_fim,
                    valor_total: aluguelRows[0].valor_total,
                    status: aluguelRows[0].status,
                    itens: aluguelRows.filter(row => row.item_id).map(row => ({
                        id: row.item_id,
                        produto_id: row.produto_id,
                        produto_nome: row.produto_nome,
                        tamanho: row.tamanho,
                        cor: row.cor,
                        quantidade: row.quantidade,
                        valor_unitario: row.valor_unitario,
                        total_parcial: row.total_parcial
                    })),
                    pagamentos: pagamentoRows
                };
                
                console.log(`✅ Aluguel ${id} carregado com ${aluguel.itens.length} itens e ${pagamentoRows.length} pagamentos`);
                res.json(aluguel);
            });
        });
    },

    // Criar parcelas automáticas (opcional)
    criarParcelas: (req, res) => {
        const { aluguel_id, numero_parcelas, primeira_vencimento } = req.body;
        
        if (!aluguel_id || !numero_parcelas || !primeira_vencimento) {
            return res.status(400).json({ error: 'Dados incompletos para criar parcelas' });
        }
        
        // Buscar valor total do aluguel
        db.get('SELECT valor_total FROM alugueis WHERE id = ?', [aluguel_id], (err, row) => {
            if (err) {
                console.error('❌ Erro ao buscar valor do aluguel:', err.message);
                return res.status(500).json({ error: err.message });
            }
            
            if (!row || !row.valor_total) {
                return res.status(400).json({ error: 'Aluguel sem valor total definido' });
            }
            
            const valorParcela = row.valor_total / numero_parcelas;
            const vencimentos = [];
            const primeiraData = new Date(primeira_vencimento);
            
            // Gerar datas de vencimento
            for (let i = 0; i < numero_parcelas; i++) {
                const dataVencimento = new Date(primeiraData);
                dataVencimento.setMonth(primeiraData.getMonth() + i);
                vencimentos.push(dataVencimento.toISOString().split('T')[0]);
            }
            
            // Inserir parcelas
            const sql = `INSERT INTO pagamentos (aluguel_id, valor, forma_pagamento, data_vencimento, status) 
                         VALUES (?, ?, ?, ?, 'pendente')`;
            
            let inserted = 0;
            const formasPadrao = ["Dinheiro", "PIX", "Cartão"];
            
            vencimentos.forEach((data, index) => {
                const formaPagamento = formasPadrao[index % formasPadrao.length];
                
                db.run(sql, [aluguel_id, valorParcela, formaPagamento, data], function(err) {
                    if (err) {
                        console.error('❌ Erro ao criar parcela:', err.message);
                        return;
                    }
                    inserted++;
                    
                    if (inserted === numero_parcelas) {
                        console.log(`✅ ${inserted} parcelas criadas para aluguel ${aluguel_id}`);
                        res.json({ parcelas_criadas: inserted });
                    }
                });
            });
        });
    }
};

module.exports = aluguelController;