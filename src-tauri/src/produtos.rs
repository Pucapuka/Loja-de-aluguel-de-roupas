use crate::db::DbState;
use tauri::State;
use serde::{Serialize, Deserialize};

#[derive(Serialize)]
pub struct Produto {
    pub id: i32,
    pub codigo: String,
    pub nome: String,
    pub tamanho: Option<String>,
    pub cor: Option<String>,
    pub preco_aluguel: f64,
    pub estoque: i32,
}

#[derive(Deserialize)]
pub struct NovoProduto {
    pub codigo: String,
    pub nome: String,
    pub tamanho: Option<String>,
    pub cor: Option<String>,
    pub preco_aluguel: f64,
    pub estoque: i32,
}

#[tauri::command]
pub fn listar_produtos(state: State<DbState>) -> Result<Vec<Produto>, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let mut stmt = conn.prepare(
        "SELECT id, codigo, nome, tamanho, cor, preco_aluguel, estoque FROM produtos ORDER BY id DESC"
    ).map_err(|e| e.to_string())?;
    let produtos = stmt.query_map([], |row| {
        Ok(Produto {
            id: row.get(0)?,
            codigo: row.get(1)?,
            nome: row.get(2)?,
            tamanho: row.get(3)?,
            cor: row.get(4)?,
            preco_aluguel: row.get(5)?,
            estoque: row.get(6)?,
        })
    }).map_err(|e| e.to_string())?.filter_map(Result::ok).collect();
    Ok(produtos)
}

#[tauri::command]
pub fn obter_produto(state: State<DbState>, id: i32) -> Result<Produto, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let mut stmt = conn.prepare(
        "SELECT id, codigo, nome, tamanho, cor, preco_aluguel, estoque FROM produtos WHERE id = ?"
    ).map_err(|e| e.to_string())?;
    let produto = stmt.query_row([id], |row| {
        Ok(Produto {
            id: row.get(0)?,
            codigo: row.get(1)?,
            nome: row.get(2)?,
            tamanho: row.get(3)?,
            cor: row.get(4)?,
            preco_aluguel: row.get(5)?,
            estoque: row.get(6)?,
        })
    }).map_err(|_| "Produto não encontrado".to_string())?;
    Ok(produto)
}

#[tauri::command]
pub fn criar_produto(state: State<DbState>, produto: NovoProduto) -> Result<Produto, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    conn.execute(
        "INSERT INTO produtos (codigo, nome, tamanho, cor, preco_aluguel, estoque) VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        (&produto.codigo, &produto.nome, &produto.tamanho, &produto.cor, produto.preco_aluguel, produto.estoque)
    ).map_err(|e| {
        if e.to_string().contains("UNIQUE constraint") {
            "Código do produto já existe".to_string()
        } else {
            e.to_string()
        }
    })?;
    let id = conn.last_insert_rowid();
    Ok(Produto {
        id: id as i32,
        codigo: produto.codigo,
        nome: produto.nome,
        tamanho: produto.tamanho,
        cor: produto.cor,
        preco_aluguel: produto.preco_aluguel,
        estoque: produto.estoque,
    })
}

#[derive(Deserialize)]
pub struct AtualizarProduto {
    pub codigo: String,
    pub nome: String,
    pub tamanho: Option<String>,
    pub cor: Option<String>,
    pub preco_aluguel: f64,
    pub estoque: i32,
}

#[tauri::command]
pub fn atualizar_produto(state: State<DbState>, id: i32, produto: AtualizarProduto) -> Result<Produto, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let changes = conn.execute(
        "UPDATE produtos SET codigo=?, nome=?, tamanho=?, cor=?, preco_aluguel=?, estoque=? WHERE id=?",
        (&produto.codigo, &produto.nome, &produto.tamanho, &produto.cor, produto.preco_aluguel, produto.estoque, id)
    ).map_err(|e| e.to_string())?;
    if changes == 0 {
        return Err("Produto não encontrado".to_string());
    }
    Ok(Produto {
        id,
        codigo: produto.codigo,
        nome: produto.nome,
        tamanho: produto.tamanho,
        cor: produto.cor,
        preco_aluguel: produto.preco_aluguel,
        estoque: produto.estoque,
    })
}

#[tauri::command]
pub fn deletar_produto(state: State<DbState>, id: i32) -> Result<String, String> {
    let conn = state.conn.lock().map_err(|_| "Erro ao acessar banco")?;
    let changes = conn.execute("DELETE FROM produtos WHERE id=?", [id]).map_err(|e| e.to_string())?;
    if changes == 0 {
        return Err("Produto não encontrado".to_string());
    }
    Ok("Produto deletado com sucesso".to_string())
}
