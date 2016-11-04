const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
let win;

function isDev() {
  return (process.defaultApp ||
    /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
    /[\\/]electron[\\/]/.test(process.execPath));
}

function createWindow() {
  win = new BrowserWindow({width: 900, height: 650});
  if (isDev()) {
    win.webContents.openDevTools();
    win.loadURL(`file://${__dirname}/index.html?dev=true`);
  } else {
    win.loadURL(`file://${__dirname}/index.html`);
  }
  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', startPlaster);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    startPlaster();
  }
});

function startPlaster() {
  if (!handleSquirrelEvent()) {
    createWindow();
  }
}

function handleSquirrelEvent() {
  if (process.platform !== 'win32') {
    return false;
  }
  if (process.argv.length === 1) {
    return false;
  }
  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      app.quit();
      return true;
    case '--squirrel-uninstall':
      app.quit();
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
    default:
      return false;
  }
}
