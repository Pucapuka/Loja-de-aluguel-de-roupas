use crate::db::DbState;
use tauri::State;
use serde::{Serialize, Deserialize};

#[derive(Serialize)]
pub struct Pagamento {
    pub id: i32,
    pub aluguel_id: i32,
    pub valor: f64,
    pub forma_pagamento: String,
    pub data_vencimento: Option<String>,
    pub data_pagamento: Option<String>,
    pub status: String,
    pub observacao: Option<String>,
}

#[derive(Deserialize)]
pub struct NovoPagamento {
    pub aluguel_id: i32,
    pub valor: f64,
    pub forma_pagamento: String,
    pub data_vencimento: Option<String>,
    pub observacao: Option<String>,
}

#[tauri::command]
pub fn listar_pagamentos(state: State<DbState>, aluguel_id: i32) -> Result<Vec<Pagamento>, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let mut stmt = conn.prepare(
        "SELECT id, aluguel_id, valor, forma_pagamento, data_vencimento, data_pagamento, status, observacao
         FROM pagamentos WHERE aluguel_id = ? ORDER BY data_vencimento ASC"
    ).map_err(|e| e.to_string())?;
    let pagamentos = stmt.query_map([aluguel_id], |row| {
        Ok(Pagamento {
            id: row.get(0)?,
            aluguel_id: row.get(1)?,
            valor: row.get(2)?,
            forma_pagamento: row.get(3)?,
            data_vencimento: row.get(4).ok(),
            data_pagamento: row.get(5).ok(),
            status: row.get(6)?,
            observacao: row.get(7).ok(),
        })
    }).map_err(|e| e.to_string())?.filter_map(Result::ok).collect();
    Ok(pagamentos)
}

#[tauri::command]
pub fn criar_pagamento(state: State<DbState>, pg: NovoPagamento) -> Result<Pagamento, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    conn.execute(
        "INSERT INTO pagamentos (aluguel_id, valor, forma_pagamento, data_vencimento, observacao) VALUES (?1, ?2, ?3, ?4, ?5)",
        (&pg.aluguel_id, &pg.valor, &pg.forma_pagamento, &pg.data_vencimento, &pg.observacao)
    ).map_err(|e| e.to_string())?;
    let id = conn.last_insert_rowid();
    Ok(Pagamento {
        id: id as i32,
        aluguel_id: pg.aluguel_id,
        valor: pg.valor,
        forma_pagamento: pg.forma_pagamento,
        data_vencimento: pg.data_vencimento,
        data_pagamento: None,
        status: "pendente".to_string(),
        observacao: pg.observacao,
    })
}
