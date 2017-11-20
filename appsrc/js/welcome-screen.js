import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
const electronApp = require('electron').remote;
const path = require('path');
const http = require('http');
const https = require('https');
const fs = require('fs');

export default class WelcomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialog: false,
      dialogText: '',
      goVerb: 'aa',
      folderPath: '',
      externalUrl: '',
    };
    this.handleUrlFieldChange = this.handleUrlFieldChange.bind(this);
    this.promptUserForDirectory = this.promptUserForDirectory.bind(this);
    this.createNewDialog = this.createNewDialog.bind(this);
    this.editDialog = this.editDialog.bind(this);
    this.openUrlDialog = this.openUrlDialog.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.goToPodcast = this.goToPodcast.bind(this);
  }
  handleUrlFieldChange(e) {
    this.setState({externalUrl: e.target.value});
  }
  promptUserForDirectory() {
    const outerThis = this;
    const options = {
      title: 'Please choose a location for this podcast',
      buttonLabel: 'Choose',
      properties: ['openDirectory', 'createDirectory'],
    };
    electronApp.dialog.showOpenDialog(options, function(dirPath) {
      if (dirPath !== undefined) {
        outerThis.setState({folderPath: dirPath[0]});
      }
    });
  }
  createNewDialog() {
    const createText = 'Please select a location on this computer ' +
      'where you would like to save your podcast.';
    this.setState({
      dialog: true,
      dialogText: createText,
      goVerb: 'Create',
    });
  }
  editDialog() {
    const editText = 'Please select the location on this computer ' +
      'of the podcast you would like to edit.';
    this.setState({
      dialog: true,
      dialogText: editText,
      goVerb: 'Edit',
    });
  }
  openUrlDialog() {
    const importText = 'Please enter the url of the podcast you would ' +
      'like to import and select a location on this computer where you ' +
      'would like to save the files.';
    this.setState({
      dialog: true,
      dialogText: importText,
      goVerb: 'Import',
    });
  }
  closeDialog() {
    this.setState({
      dialog: false,
      dialogText: '',
      goVerb: '',
    });
  }
  goToPodcast() {
    if (this.state.goVerb === 'Import') {
      const httplib = this.state.externalUrl.startsWith('https') ? https : http;
      const outerThis = this;
      const xmlPath = path.join(this.state.folderPath, '.podcast-local.xml');
      const xmlFile = fs.createWriteStream(xmlPath);
      const request = httplib.get(
        outerThis.state.externalUrl, function(response) {
          response.pipe(xmlFile);
          response.on('end',
            () => outerThis.props.updatePodcastPath(
              outerThis.state.folderPath
            ));
        });
      request.on('error', () =>
        outerThis.props.setError('There was a problem downloading from ' +
        outerThis.state.externalUrl)
      );
    } else {
      this.props.updatePodcastPath(this.state.folderPath);
    }
  }
  render() {
    let readyToGo = false;
    if (this.state.goVerb === 'Import') {
      if (this.state.folderPath && this.state.externalUrl) {
        readyToGo = true;
      }
    } else if (this.state.folderPath) {
      readyToGo = true;
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onClick={this.closeDialog}
      />,
      <FlatButton
        label={this.state.goVerb}
        primary={true}
        disabled={!readyToGo}
        onClick={this.goToPodcast}
      />,
    ];
    const urlField = (
      <TextField
        hintText="https://www.example.com/podcast.xml"
        floatingLabelText="URL"
        name="url"
        fullWidth={true}
        value={this.state.externalUrl}
        onChange={this.handleUrlFieldChange}
      />
    );
    return (
      <div className="welcome-screen">
        <div className="welcome-screen-inner">
          <h1>Welcome to Plaster</h1>
          <p>Please select an option to get started</p>
          <div className="welcome-button">
            <RaisedButton
              label="Create a new podcast"
              onClick={this.createNewDialog}
            />
          </div>
          <div className="welcome-button">
            <RaisedButton
              label="Edit a podcast on this computer"
              onClick={this.editDialog}
            />
          </div>
          <div className="welcome-button">
            <RaisedButton
              label="Import a podcast from a url"
              onClick={this.openUrlDialog}
            />
          </div>
        </div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.dialog}
          onRequestClose={this.closeDialog}
        >
          <p>{this.state.dialogText}</p>
          {this.state.goVerb === 'Import' ? urlField : null}
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
            onClick={this.promptUserForDirectory}
          />
        </Dialog>
      </div>
    );
  }
}
