const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess = null;
let mainWindow = null;

function startBackend() {
  console.log('🚀 Iniciando servidor backend...');
  
  const backendPath = path.join(__dirname, 'backend', 'server.js');
  
  backendProcess = spawn('node', [backendPath], {
    cwd: __dirname,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`📦 Backend: ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`❌ Backend Error: ${data.toString().trim()}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`🔴 Backend finalizado com código: ${code}`);
  });

  return backendProcess;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: false
    },
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile('public/index.html');
  }

  // Em produção, inicia o backend
  if (!isDev) {
    startBackend();
    
    // Verificar se o backend está respondendo
    setTimeout(() => {
      checkBackendHealth();
    }, 3000);
  }

  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.log('Falha ao carregar:', errorDescription);
  });

  win.webContents.setWindowOpenHandler(({ url }) => {
    return { action: 'deny' };
  });

  return win;
}

function checkBackendHealth() {
  fetch('http://localhost:5000/api/health')
    .then(response => {
      if (response.ok) {
        console.log('✅ Backend está respondendo');
      } else {
        console.warn('⚠️ Backend retornou status:', response.status);
      }
    })
    .catch(err => {
      console.error('❌ Backend não está acessível:', err.message);
    });
}

app.whenReady().then(() => {
  mainWindow = createWindow();
});

app.on('window-all-closed', () => {
  // Finalizar backend quando o app fechar
  if (backendProcess) {
    console.log('🔴 Finalizando servidor backend...');
    backendProcess.kill();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  // Garantir que o backend seja finalizado
  if (backendProcess) {
    backendProcess.kill();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow();
  }
});