import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const os = require('os');
const electronRemote = require('electron').remote;
const electronApp = electronRemote.app;
const electronUpdater = electronRemote.autoUpdater;

export default class PlasterUpdater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateOpen: false,
      updateMessage: 'An update is available. Would you like to install it?',
      updateDownloaded: false,
    };
    this.isDev = this.isDev.bind(this);
    this.checkUpdateAvailable = this.checkUpdateAvailable.bind(this);
    this.installRestart = this.installRestart.bind(this);
    this.updateClose = this.updateClose.bind(this);
  }
  componentDidMount() {
    this.checkUpdateAvailable();
  }
  isDev() {
    return (window.location.href.indexOf('dev=true') > -1);
  }
  checkUpdateAvailable() {
    const outerThis = this;
    const version = electronApp.getVersion();
    // electronUpdater.on('error', err => {
    // });
    // electronUpdater.on('checking-for-update', () => {
    // });
    // electronUpdater.on('update-available', () => {
    // });
    // electronUpdater.on('update-not-available', () => {
    // });
    electronUpdater.on('update-downloaded', () => {
      outerThis.setState({
        updateDownloaded: true,
        updateOpen: true,
      });
    });
    if (os.type() === 'Darwin') {
      const osxUrl = 'https://plaster-nuts.herokuapp.com/update/osx/' + version;
      if (!this.isDev()) {
        electronUpdater.setFeedURL(osxUrl);
        electronUpdater.checkForUpdates();
      }
    }
    if (os.type() === 'Windows_NT') {
      const winUrl = 'https://plaster-nuts.herokuapp.com/update/win/' + version;
      if (!this.isDev()) {
        electronUpdater.setFeedURL(winUrl);
        electronUpdater.checkForUpdates();
      }
    }
  }
  installRestart() {
    electronUpdater.quitAndInstall();
  }
  updateClose() {
    this.setState({
      updateOpen: false,
    });
  }
  render() {
    const updateActions = [
      <FlatButton
        label="Not Now"
        primary={false}
        onClick={this.updateClose}
      />,
      <FlatButton
        label="Install and Restart"
        primary={true}
        onClick={this.installRestart}
      />,
    ];
    return (
      <Dialog
        actions={updateActions}
        modal={false}
        open={this.state.updateOpen}
        onRequestClose={this.updateClose}
      >{this.state.updateMessage}</Dialog>
    );
  }
}
