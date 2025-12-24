use std::process::Command;
use tauri::{Manager, path::BaseDirectory};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {

      let backend_path = app
        .path()
        .resolve("backend/server.js", BaseDirectory::Resource)
        .expect("failed to resolve backend path");

      Command::new("node")
        .arg(backend_path)
        .spawn()
        .expect("failed to start backend");

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
