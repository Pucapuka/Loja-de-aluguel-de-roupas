use crate::db::DbState;
use rusqlite::Row;
use serde::{Deserialize, Serialize};
use tauri::State;

/* =========================
   MODELS
========================= */

#[derive(Debug, Serialize)]
pub struct Aluguel {
    pub id: i32,
    pub cliente_id: i32,
    pub data_inicio: String,
    pub data_fim: Option<String>,
    pub valor_total: Option<f64>,
    pub status: Option<String>,
    pub cliente_nome: Option<String>,
    pub total_itens: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct NovoAluguel {
    pub cliente_id: i32,
    pub data_inicio: String,
    pub data_fim: Option<String>,
}

/* =========================
   COMMANDS
========================= */

#[tauri::command]
pub fn listar_alugueis(state: State<DbState>) -> Result<Vec<Aluguel>, String> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| "Erro ao acessar banco".to_string())?;

    let mut stmt = conn
        .prepare(
            "
            SELECT
                a.id,
                a.cliente_id,
                a.data_inicio,
                a.data_fim,
                a.valor_total,
                a.status,
                c.nome AS cliente_nome,
                (
                    SELECT COUNT(*)
                    FROM aluguel_itens
                    WHERE aluguel_id = a.id
                ) AS total_itens
            FROM alugueis a
            LEFT JOIN clientes c ON c.id = a.cliente_id
            ORDER BY a.id DESC
            ",
        )
        .map_err(|e| e.to_string())?;

    let alugueis = stmt
        .query_map([], |row: &Row| {
            Ok(Aluguel {
                id: row.get(0)?,
                cliente_id: row.get(1)?,
                data_inicio: row.get(2)?,
                data_fim: row.get(3)?,
                valor_total: row.get(4)?,
                status: row.get(5)?,
                cliente_nome: row.get(6)?,
                total_itens: row.get(7)?,
            })
        })
        .map_err(|e| e.to_string())?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| e.to_string())?;

    Ok(alugueis)
}

#[tauri::command]
pub fn criar_aluguel(
    state: State<DbState>,
    aluguel: NovoAluguel,
) -> Result<i32, String> {
    let conn = state
        .conn
        .lock()
        .map_err(|_| "Erro ao acessar banco".to_string())?;

    conn.execute(
        "
        INSERT INTO alugueis (cliente_id, data_inicio, data_fim)
        VALUES (?1, ?2, ?3)
        ",
        (
            aluguel.cliente_id,
            aluguel.data_inicio,
            aluguel.data_fim,
        ),
    )
    .map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid() as i32)
}
