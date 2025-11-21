const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  // Em desenvolvimento: localhost:3000, em produção: arquivo local
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    win.loadURL('http://localhost:3000');
    
    // Abre DevTools em desenvolvimento
    win.webContents.openDevTools();
  } else {
    win.loadFile('public/index.html');
  }

  // ← ADICIONE ESTE BLOCO PARA LIDAR COM ROTAS
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    // Se falhar ao carregar, recarrega a aplicação
    if (isDev) {
      console.log('Falha ao carregar, tentando recarregar...');
      win.loadURL('http://localhost:3000');
    }
  });

  // Previne navegação para URLs externas
  win.webContents.setWindowOpenHandler(({ url }) => {
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  // Em produção, não inicia o backend separadamente (já está no npm start)
  if (process.env.NODE_ENV !== 'production') {
    spawn('node', ['backend/server.js'], { shell: true, stdio: 'inherit' });
  }
  
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});