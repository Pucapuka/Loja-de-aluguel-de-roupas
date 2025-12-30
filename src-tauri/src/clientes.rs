use crate::db::DbState;
use tauri::State;
use serde::{Serialize, Deserialize};

#[derive(Serialize)]
pub struct Cliente {
    pub id: i32,
    pub nome: String,
    pub cpf: Option<String>,
    pub telefone: Option<String>,
    pub endereco: Option<String>,
    pub email: Option<String>,
    pub data_cadastro: Option<String>,
}

#[derive(Deserialize)]
pub struct NovoCliente {
    pub nome: String,
    pub cpf: Option<String>,
    pub telefone: Option<String>,
    pub endereco: Option<String>,
    pub email: Option<String>,
}

#[tauri::command]
pub fn listar_clientes(state: State<DbState>) -> Result<Vec<Cliente>, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let mut stmt = conn.prepare("SELECT id, nome, cpf, telefone, endereco, email, data_cadastro FROM clientes ORDER BY nome")
        .map_err(|e| e.to_string())?;
    let clientes = stmt.query_map([], |row| {
        Ok(Cliente {
            id: row.get(0)?,
            nome: row.get(1)?,
            cpf: row.get(2)?,
            telefone: row.get(3)?,
            endereco: row.get(4)?,
            email: row.get(5)?,
            data_cadastro: row.get(6)?,
        })
    }).map_err(|e| e.to_string())?.filter_map(Result::ok).collect();
    Ok(clientes)
}

#[tauri::command]
pub fn criar_cliente(state: State<DbState>, cliente: NovoCliente) -> Result<Cliente, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    conn.execute(
        "INSERT INTO clientes (nome, cpf, telefone, endereco, email) VALUES (?1, ?2, ?3, ?4, ?5)",
        (&cliente.nome, &cliente.cpf, &cliente.telefone, &cliente.endereco, &cliente.email)
    ).map_err(|e| e.to_string())?;
    let id = conn.last_insert_rowid();
    Ok(Cliente {
        id: id as i32,
        nome: cliente.nome,
        cpf: cliente.cpf,
        telefone: cliente.telefone,
        endereco: cliente.endereco,
        email: cliente.email,
        data_cadastro: None,
    })
}

#[derive(Deserialize)]
pub struct AtualizarCliente {
    pub nome: String,
    pub cpf: Option<String>,
    pub telefone: Option<String>,
    pub endereco: Option<String>,
    pub email: Option<String>,
}

#[tauri::command]
pub fn atualizar_cliente(state: State<DbState>, id: i32, cliente: AtualizarCliente) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let changes = conn.execute(
        "UPDATE clientes SET nome=?, cpf=?, telefone=?, endereco=?, email=? WHERE id=?",
        (&cliente.nome, &cliente.cpf, &cliente.telefone, &cliente.endereco, &cliente.email, id)
    ).map_err(|e| e.to_string())?;
    if changes == 0 {
        return Err("Cliente não encontrado".to_string());
    }
    Ok("Cliente atualizado com sucesso".to_string())
}

#[tauri::command]
pub fn deletar_cliente(state: State<DbState>, id: i32) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let changes = conn.execute("DELETE FROM clientes WHERE id=?", [id]).map_err(|e| e.to_string())?;
    if changes == 0 {
        return Err("Cliente não encontrado".to_string());
    }
    Ok("Cliente deletado com sucesso".to_string())
}
