import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

export default class PodcastSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.closeSelf = this.closeSelf.bind(this);
  }
  componentDidMount() {
    console.log('loading local storage settings?');
  }
  handleTextFieldChange(e) {
    this.props.handleChange(e.target.name, e.target.value);
  }
  handleCheckboxChange(e, v) {
    this.props.handleChange('showOptionalFields', v);
  }
  handleDropdownChange(e, i, v) {
    this.props.handleChange('deploytype', v);
  }
  closeSelf() {
    console.log('here we should be setting local storage stuff');
    this.props.close();
  }
  render() {
    const actions = [
      <FlatButton
        label="Close"
        primary={false}
        onTouchTap={this.closeSelf}
      />
    ];
    var sftpSettings = (
      <div>
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
        <TextField
          hintText="The account's password"
          floatingLabelText="Password"
          type="password"
          name="sftppass"
          fullWidth={true}
          value={this.props.settings.sftppass}
          onChange={this.handleTextFieldChange}
        />
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
        >
          <h2>Podcast Settings</h2>
          <Checkbox
            label="Show optional fields"
            labelPosition="left"
            defaultChecked={this.props.settings.showOptionalFields}
            onCheck={this.handleCheckboxChange}
          />
          <span>Publish method</span>
          <DropDownMenu
            name="deploytype"
            value={this.props.settings.deploytype}
            onChange={this.handleDropdownChange}
          >
            <MenuItem value={'none'} primaryText="None" />
            <MenuItem value={'sftp'} primaryText="SFTP / RSync" />
            <MenuItem value={'s3'} primaryText="Amazon S3" />
          </DropDownMenu>
          <TextField
            hintText="https://www.mypodcast.com"
            floatingLabelText="URL Prefix"
            name="prefixUrl"
            fullWidth={true}
            value={this.props.settings.prefixUrl}
            onChange={this.handleTextFieldChange}
          />
          {this.props.settings.deploytype === 'sftp' ? sftpSettings : null}
          {this.props.settings.deploytype === 's3' ? s3Settings : null}
        </Dialog>
    );
  }
}
