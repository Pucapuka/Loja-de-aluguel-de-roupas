const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true },
  });

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
  // Inicia o backend Express
  spawn('node', ['backend/server.js'], { shell: true, stdio: 'inherit' });

  // Cria janela principal
  createWindow();
});
