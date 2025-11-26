const db = require('../db');

const pagamentoController = {
    // Listar todos os pagamentos de um aluguel
    listarPagamentos: (req, res) => {
        const { aluguel_id } = req.params;
        
        const sql = `SELECT * FROM pagamentos WHERE aluguel_id = ? ORDER BY data_vencimento ASC`;
        
        db.all(sql, [aluguel_id], (err, rows) => {
            if (err) {
                console.error('❌ Erro ao buscar pagamentos:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ ${rows.length} pagamentos encontrados para aluguel ${aluguel_id}`);
            res.json(rows || []);
        });
    },

    // Adicionar pagamento
  adicionarPagamento: (req, res) => {
    const { aluguel_id, valor, forma_pagamento, data_vencimento, observacao } = req.body;
    
    console.log('📦 Dados recebidos para pagamento:', { 
        aluguel_id, valor, forma_pagamento, data_vencimento, observacao 
    });
    
    if (!aluguel_id || !valor || !forma_pagamento) {
        return res.status(400).json({ 
            error: 'Dados incompletos. Preencha: valor e forma de pagamento' 
        });
    }

    const sql = `INSERT INTO pagamentos 
                (aluguel_id, valor, forma_pagamento, data_vencimento, observacao) 
                VALUES (?, ?, ?, ?, ?)`;
    
    db.run(sql, [aluguel_id, valor, forma_pagamento, data_vencimento, observacao], function(err) {
        if (err) {
            console.error('❌ Erro ao adicionar pagamento:', err.message);
            return res.status(500).json({ error: err.message });
        }
        console.log(`✅ Pagamento adicionado: R$ ${valor} - ${forma_pagamento} para aluguel ${aluguel_id}`);
        res.json({ id: this.lastID });
        });
    },

    // Atualizar pagamento (marcar como pago, etc)
    atualizarPagamento: (req, res) => {
        const { id } = req.params;
        const { valor, forma_pagamento, data_vencimento, data_pagamento, status, observacao } = req.body;
        
        const sql = `UPDATE pagamentos SET 
                    valor = COALESCE(?, valor),
                    forma_pagamento = COALESCE(?, forma_pagamento),
                    data_vencimento = COALESCE(?, data_vencimento),
                    data_pagamento = COALESCE(?, data_pagamento),
                    status = COALESCE(?, status),
                    observacao = COALESCE(?, observacao)
                    WHERE id = ?`;
        
        db.run(sql, [valor, forma_pagamento, data_vencimento, data_pagamento, status, observacao, id], function(err) {
            if (err) {
                console.error('❌ Erro ao atualizar pagamento:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ Pagamento ${id} atualizado`);
            res.json({ changes: this.changes });
        });
    },

    // Marcar pagamento como pago
    marcarComoPago: (req, res) => {
        const { id } = req.params;
        const { data_pagamento } = req.body;
        
        const dataPagamento = data_pagamento || new Date().toISOString().split('T')[0];
        
        db.run('UPDATE pagamentos SET status = "pago", data_pagamento = ? WHERE id = ?', 
               [dataPagamento, id], function(err) {
            if (err) {
                console.error('❌ Erro ao marcar pagamento como pago:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ Pagamento ${id} marcado como pago`);
            res.json({ changes: this.changes });
        });
    },

    // Remover pagamento
    removerPagamento: (req, res) => {
        const { id } = req.params;
        
        db.run('DELETE FROM pagamentos WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('❌ Erro ao remover pagamento:', err.message);
                return res.status(500).json({ error: err.message });
            }
            console.log(`✅ Pagamento ${id} removido`);
            res.json({ changes: this.changes });
        });
    },

    // Obter resumo de pagamentos do aluguel
    obterResumoPagamentos: (req, res) => {
        const { aluguel_id } = req.params;
        
        const sql = `
            SELECT 
                COUNT(*) as total_parcelas,
                SUM(valor) as valor_total,
                SUM(CASE WHEN status = 'pago' THEN valor ELSE 0 END) as valor_pago,
                SUM(CASE WHEN status = 'pendente' THEN valor ELSE 0 END) as valor_pendente
            FROM pagamentos 
            WHERE aluguel_id = ?
        `;
        
        db.get(sql, [aluguel_id], (err, row) => {
            if (err) {
                console.error('❌ Erro ao buscar resumo:', err.message);
                return res.status(500).json({ error: err.message });
            }
            res.json(row || { total_parcelas: 0, valor_total: 0, valor_pago: 0, valor_pendente: 0 });
        });
    }
};

module.exports = pagamentoController;