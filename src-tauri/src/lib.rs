#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
mod produtos;
mod clientes;
mod alugueis;
mod pagamentos;

use tauri::{Manager};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // Inicializa banco e registra como estado
            let db_state = db::init_db(app.handle().clone());
            app.manage(db_state);
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // Produtos
            produtos::listar_produtos,
            produtos::criar_produto,
            produtos::obter_produto,
            produtos::atualizar_produto,
            produtos::deletar_produto,

            // Clientes
            clientes::listar_clientes,
            clientes::criar_cliente,
            clientes::atualizar_cliente,
            clientes::deletar_cliente,

            // Aluguéis
            alugueis::listar_alugueis,
            alugueis::criar_aluguel,

            // Pagamentos
            pagamentos::listar_pagamentos,
            pagamentos::criar_pagamento,
        ])
        .run(tauri::generate_context!())
        .expect("Erro ao executar aplicação Tauri");
}
