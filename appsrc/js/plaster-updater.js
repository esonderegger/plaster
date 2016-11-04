import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
const os = require('os');
var electronRemote = require('electron').remote;
var electronApp = electronRemote.app;
var electronUpdater = electronRemote.autoUpdater;

export default class PlasterUpdater extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updateOpen: false,
      updateMessage: 'An update is available. Would you like to install it?',
      updateDownloaded: false
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
    var outerThis = this;
    var version = electronApp.getVersion();
    electronUpdater.on('error', err => {
      console.log('there was a problem in the update process.');
      console.log(err);
    });
    electronUpdater.on('checking-for-update', () => {
      console.log('checking for an update...');
    });
    electronUpdater.on('update-available', () => {
      console.log('there is an update available!!');
    });
    electronUpdater.on('update-not-available', () => {
      console.log('Plaster is currently up to date.');
    });
    electronUpdater.on('update-downloaded', () => {
      outerThis.setState({
        updateDownloaded: true,
        updateOpen: true
      });
    });
    if (os.type() === 'Darwin') {
      var osxUrl = 'https://plaster-nuts.herokuapp.com/update/osx/' + version;
      if (!this.isDev()) {
        electronUpdater.setFeedURL(osxUrl);
        console.log(osxUrl);
        electronUpdater.checkForUpdates();
      }
    }
    if (os.type() === 'Windows_NT') {
      var winUrl = 'https://plaster-nuts.herokuapp.com/update/win/' + version;
      if (!this.isDev()) {
        electronUpdater.setFeedURL(winUrl);
        console.log(winUrl);
        electronUpdater.checkForUpdates();
      }
    }
  }
  installRestart() {
    electronUpdater.quitAndInstall();
  }
  updateClose() {
    this.setState({
      updateOpen: false
    });
  }
  render() {
    const updateActions = [
      <FlatButton
        label="Not Now"
        primary={false}
        onTouchTap={this.updateClose}
      />,
      <FlatButton
        label="Install and Restart"
        primary={true}
        onTouchTap={this.installRestart}
      />
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
