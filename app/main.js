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
  if (process.argv.length === 1) {
    return false;
  }
  const squirrelEvent = process.argv[1];
  if (squirrelEvent === '--squirrel-firstrun') {
    return true;
  }
  return false;
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
