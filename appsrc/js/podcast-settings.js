import React from 'react';
import Toggle from 'material-ui/Toggle';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
const fs = require('fs');
const path = require('path');
var electronApp = require('electron').remote;

export default class PodcastSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.closeSelf = this.closeSelf.bind(this);
    this.promptUserForFile = this.promptUserForFile.bind(this);
  }
  handleTextFieldChange(e) {
    this.props.handleChange(e.target.name, e.target.value);
  }
  handleToggle(e, v, k) {
    this.props.handleChange(k, v);
  }
  handleDropdownChange(e, i, v) {
    this.props.handleChange('deploytype', v);
  }
  closeSelf() {
    var outPath = path.join(this.props.directory, '.settings.json');
    fs.writeFile(outPath, JSON.stringify(this.props.settings), function(err) {
      if (err !== null) {
        console.error(err);
      }
    });
    this.props.close();
  }
  promptUserForFile() {
    var outerThis = this;
    var options = {
      title: 'Please choose the location of your private key file.',
      buttonLabel: 'Choose',
      properties: ['openFile', 'showHiddenFiles']
    };
    electronApp.dialog.showOpenDialog(options, function(filePath) {
      if (filePath !== undefined) {
        outerThis.props.handleChange('sftpprivatekeyloc', filePath[0]);
      }
    });
  }
  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={false}
        onTouchTap={this.closeSelf}
      />
    ];
    var sftpPasswordField = (
      <TextField
        hintText="The account's password"
        floatingLabelText="Password"
        type="password"
        name="sftppass"
        fullWidth={true}
        value={this.props.settings.sftppass}
        onChange={this.handleTextFieldChange}
      />
    );
    var sftpPrivateKeyField = (
      <div>
        <TextField
          hintText="~/.ssh/id_rsa"
          floatingLabelText="Private Key Location"
          name="sftpprivatekeyloc"
          fullWidth={true}
          value={this.props.settings.sftpprivatekeyloc}
          disabled={true}
          onChange={this.handleTextFieldChange}
        />
        <RaisedButton
          label="Select Private Key"
          onTouchTap={this.promptUserForFile}
        />
      </div>
    );
    var sftpSettings = (
      <div>
        <Toggle
          label="Use private key file"
          style={{marginTop: 16, width: '15em'}}
          toggled={this.props.settings.sftpuseprivatekey}
          onToggle={(e, v) => this.handleToggle(e, v, 'sftpuseprivatekey')}
        />
        <TextField
          hintText="The hostname or ip address of the server"
          floatingLabelText="Host"
          name="sftphost"
          fullWidth={true}
          value={this.props.settings.sftphost}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          hintText="The account's username"
          floatingLabelText="Username"
          name="sftpuser"
          fullWidth={true}
          value={this.props.settings.sftpuser}
          onChange={this.handleTextFieldChange}
        />
        {this.props.settings.sftpuseprivatekey ?
          sftpPrivateKeyField : sftpPasswordField}
        <TextField
          hintText="The directory path on the server"
          floatingLabelText="Directory Path"
          name="sftppath"
          fullWidth={true}
          value={this.props.settings.sftppath}
          onChange={this.handleTextFieldChange}
        />
      </div>
    );
    var s3Settings = (
      <div>
        <TextField
          hintText="The S3 bucket name"
          floatingLabelText="Bucket Name"
          name="s3bucketname"
          fullWidth={true}
          value={this.props.settings.s3bucketname}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          hintText="The S3 access key"
          floatingLabelText="Access Key"
          name="s3accesskey"
          fullWidth={true}
          value={this.props.settings.s3accesskey}
          onChange={this.handleTextFieldChange}
        />
        <TextField
          hintText="The S3 secret key"
          floatingLabelText="Secret Key"
          name="s3secretkey"
          fullWidth={true}
          value={this.props.settings.s3secretkey}
          onChange={this.handleTextFieldChange}
        />
      </div>
    );
    return (
        <Dialog
          actions={actions}
          modal={false}
          open={this.props.open}
          onRequestClose={this.closeSelf}
          autoScrollBodyContent={true}
        >
          <h2>General Settings</h2>
          <Toggle
            label="Show optional fields"
            style={{width: '15em'}}
            toggled={this.props.settings.showOptionalFields}
            onToggle={(e, v) => this.handleToggle(e, v, 'showOptionalFields')}
          />
          <TextField
            hintText="https://www.mypodcast.com"
            floatingLabelText="URL Prefix"
            name="prefixUrl"
            fullWidth={true}
            value={this.props.settings.prefixUrl}
            onChange={this.handleTextFieldChange}
          />
          <h2>Publish Settings</h2>
          <span style={{color: 'rgba(0, 0, 0, .87)'}}>Publish method</span>
          <DropDownMenu
            name="deploytype"
            value={this.props.settings.deploytype}
            onChange={this.handleDropdownChange}
          >
            <MenuItem value={'none'} primaryText="None" />
            <MenuItem value={'sftp'} primaryText="SFTP / SCP" />
            <MenuItem value={'s3'} primaryText="Amazon S3" />
          </DropDownMenu>
          {this.props.settings.deploytype === 'sftp' ? sftpSettings : null}
          {this.props.settings.deploytype === 's3' ? s3Settings : null}
        </Dialog>
    );
  }
}
