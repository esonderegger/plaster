const electron = require('electron');
const {app} = electron;
const {BrowserWindow} = electron;
const os = require('os');
const {autoUpdater} = electron;
const ChildProcess = require('child_process');
const path = require('path');
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
  var updaterFeedUrl = 'https://plaster-nuts.herokuapp.com/update/' +
    platform + '/' + version;
  autoUpdater.setFeedURL(updaterFeedUrl);
  if (os.type() === 'Darwin') {
    autoUpdater.checkForUpdates();
  } else if (os.type() === 'Windows_NT') {
    handleSquirrelEvent();
  }
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }
  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {
      console.log(error);
    }
    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      spawnUpdate(['--createShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;
    case '--squirrel-uninstall':
      spawnUpdate(['--removeShortcut', exeName]);
      setTimeout(app.quit, 1000);
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
    default:
      return true;
  }
}
