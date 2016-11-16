import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
var electronApp = require('electron').remote;
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogForUrl: false,
      folderPath: '',
      externalUrl: ''
    };
    this.handleUrlFieldChange = this.handleUrlFieldChange.bind(this);
    this.handleFolderDialog = this.handleFolderDialog.bind(this);
    this.openUrlDialog = this.openUrlDialog.bind(this);
    this.closeUrlDialog = this.closeUrlDialog.bind(this);
    this.loadUrl = this.loadUrl.bind(this);
    this.loadFromFile = this.loadFromFile.bind(this);
    this.createNewPocast = this.createNewPocast.bind(this);
  }
  handleUrlFieldChange(e) {
    this.setState({externalUrl: e.target.value});
  }
  handleFolderDialog() {
    var outerThis = this;
    var options = {
      title: 'Please choose a location to save this podcast',
      buttonLabel: 'Choose',
      properties: ['openDirectory', 'createDirectory']
    };
    electronApp.dialog.showOpenDialog(options, function(dirPath) {
      if (dirPath !== undefined) {
        outerThis.setState({folderPath: dirPath});
      }
    });
  }
  openUrlDialog() {
    this.setState({dialogForUrl: true});
  }
  closeUrlDialog() {
    this.setState({dialogForUrl: false});
  }
  loadUrl() {
    if (!this.state.externalUrl.startsWith('http')) {
      this.props.setError('This does not appear to be a URL.');
      return;
    }
    var httplib = this.state.externalUrl.startsWith('https') ? https : http;
    var outerThis = this;
    var options = {
      title: 'Please choose a location to save this podcast',
      buttonLabel: 'Choose',
      properties: ['openDirectory', 'createDirectory']
    };
    electronApp.dialog.showOpenDialog(options, function(dirPath) {
      if (dirPath !== undefined) {
        var xmlPath = path.join(dirPath[0], '.podcast-local.xml');
        var xmlFile = fs.createWriteStream(xmlPath);
        const request = httplib.get(
          outerThis.state.externalUrl, function(response) {
            response.pipe(xmlFile);
            response.on('end',
              () => outerThis.props.updatePodcastPath(dirPath[0]));
          });
        request.on('error', () =>
          outerThis.props.setError('There was a problem downloading from ' +
          outerThis.state.externalUrl)
        );
      }
    });
  }
  loadFromFile() {
    var options = {
      title: 'Please choose a podcast folder on this computer',
      buttonLabel: 'Choose',
      properties: ['openDirectory']
    };
    this.showPodcastDirectoryDialog(options);
  }
  createNewPocast() {
    var options = {
      title: 'Please choose a location to save this podcast',
      buttonLabel: 'Choose',
      properties: ['openDirectory', 'createDirectory']
    };
    this.showPodcastDirectoryDialog(options);
  }
  showPodcastDirectoryDialog(options) {
    var outerThis = this;
    electronApp.dialog.showOpenDialog(options, function(path) {
      if (path !== undefined) {
        outerThis.props.updatePodcastPath(path[0]);
      }
    });
  }
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.closeUrlDialog}
      />,
      <FlatButton
        label="Import"
        primary={true}
        onTouchTap={this.loadUrl}
      />
    ];
    return (
      <div className="welcome-screen">
        <div className="welcome-screen-inner">
          <h1>Welcome to Plaster</h1>
          <p>Please select an option to get started</p>
          <div className="welcome-button">
            <RaisedButton
              label="Create a new podcast"
              onTouchTap={this.createNewPocast}
            />
          </div>
          <div className="welcome-button">
            <RaisedButton
              label="Edit a podcast on this computer"
              onTouchTap={this.loadFromFile}
            />
          </div>
          <div className="welcome-button">
            <RaisedButton
              label="Import a podcast from a url"
              onTouchTap={this.openUrlDialog}
            />
          </div>
        </div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.dialogForUrl}
          onRequestClose={this.closeUrlDialog}
        >
          <p>Please enter the url you would like to import</p>
          <TextField
            hintText="https://www.example.com/podcast.xml"
            floatingLabelText="URL"
            name="url"
            fullWidth={true}
            value={this.state.externalUrl}
            onChange={this.handleUrlFieldChange}
          />
          <TextField
            hintText="/path/to/podcast/folder"
            floatingLabelText="Podcast Directory Location"
            name="folderPath"
            fullWidth={true}
            disabled={true}
            value={this.state.folderPath}
            onChange={this.handleUrlFieldChange}
          />
          <RaisedButton
            label="Select Location"
            onTouchTap={this.handleFolderDialog}
          />
        </Dialog>
      </div>
    );
  }
}
