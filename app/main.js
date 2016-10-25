const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const os = require('os');
const {autoUpdater} = electron;
let win;

function isDev() {
  return (process.defaultApp ||
    /[\\/]electron-prebuilt[\\/]/.test(process.execPath) ||
    /[\\/]electron[\\/]/.test(process.execPath));
}

function isFirstTimeRunning() {
  var hasRunBefore = localStorage.getItem('hasRunBefore');
  if (hasRunBefore && hasRunBefore !== 'null') {
    return false;
  }
  localStorage.setItem('hasRunBefore', true);
  return true;
}

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});

  if (isDev()) {
    win.webContents.openDevTools();
  }

  win.loadURL(`file://${__dirname}/index.html`);

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

if (!isDev() && !isFirstTimeRunning()) {
  var platform = os.platform() + '_' + os.arch();
  var version = app.getVersion();
  var updaterFeedUrl = 'https://plaster-nuts.herokuapp.com/' +
    platform + '/' + version;
  autoUpdater.setFeedURL(updaterFeedUrl);
  if (os.type() !== 'Linux') {
    autoUpdater.checkForUpdates();
  }
}
