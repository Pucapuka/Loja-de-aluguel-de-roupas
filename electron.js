const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { nodeIntegration: true },
  });

  // Em desenvolvimento: localhost:3000, em produção: arquivo local
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile('public/index.html');
  }
}

app.whenReady().then(() => {
  // Em produção, não inicia o backend separadamente (já está no npm start)
  if (process.env.NODE_ENV !== 'production') {
    spawn('node', ['backend/server.js'], { shell: true, stdio: 'inherit' });
  }
  
  createWindow();
});