import React from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import encodeAudio from './encode-audio.js';
var electronApp = require('electron').remote;

export default class PodcastItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warningAboutDelete: false
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.chooseMedia = this.chooseMedia.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
  handleTextFieldChange(e) {
    this.props.handleChange(e.target.name, e.target.value);
  }
  chooseMedia() {
    var outerThis = this;
    electronApp.dialog.showOpenDialog(function(fileNames) {
      if (fileNames === undefined) {
        console.log("No file selected");
      } else {
        outerThis.props.handleChange('fileurl', fileNames[0]);
        encodeAudio(
          fileNames[0],
          outerThis.props.directory,
          outerThis.props.handleChange
        );
        console.log(fileNames[0]);
      }
    });
  }
  handleOpen() {
    this.setState({warningAboutDelete: true});
  }
  handleClose() {
    this.setState({warningAboutDelete: false});
  }
  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={false}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onTouchTap={this.props.deleteItem}
      />
    ];
    var audioSrc = '';
    if (this.props.episode.fileurl.startsWith('/')) {
      audioSrc = 'file://' + this.props.episode.fileurl;
    }
    if (this.props.episode.fileurl.startsWith('http')) {
      audioSrc = this.props.episode.fileurl;
    }
    if (!this.props.expanded) {
      return (
        <div className="podcast-item">
          <div className="podcast-item-teaser">
            <div className="item-teaser-title">{this.props.episode.title}</div>
            <div className="item-teaser-icon">
              <FlatButton
                label="show"
                primary={false}
                onTouchTap={this.props.expand}
              />
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="podcast-item">
        <div className="podcast-item-fields">
          <div className="text-fields">
            <TextField
              hintText="The title of this episode"
              floatingLabelText="Title"
              name="title"
              fullWidth={true}
              value={this.props.episode.title}
              onChange={this.handleTextFieldChange}
            />
            {this.props.settings.showOptionalFields ?
            (
              <TextField
                hintText="The subtitle of this episode"
                floatingLabelText="Subtitle"
                name="subtitle"
                fullWidth={true}
                value={this.props.episode.subtitle}
                multiLine={true}
                onChange={this.handleTextFieldChange}
              />
            ) : null}
            <TextField
              hintText="A short description of this episode"
              floatingLabelText="Description"
              name="description"
              fullWidth={true}
              value={this.props.episode.description}
              multiLine={true}
              onChange={this.handleTextFieldChange}
            />
            {this.props.settings.showOptionalFields ?
            (
              <TextField
                hintText="The author of this episode"
                floatingLabelText="Author"
                name="author"
                fullWidth={true}
                value={this.props.episode.author}
                onChange={this.handleTextFieldChange}
              />
            ) : null }
            <audio src={audioSrc} controls>
            </audio>
          </div>
          <div className="other-fields">
            <FlatButton
              label="hide"
              primary={false}
              onTouchTap={this.props.collapse}
            />
            <div>
              <p>{this.props.episode.duration}</p>
              <p>{this.props.episode.pubdate}</p>
              <p>{this.props.episode.filesize}</p>
              <p>{this.props.episode.filetype}</p>
            </div>
            <div className="other-button">
              <RaisedButton
                label="Choose a media file"
                onTouchTap={this.chooseMedia}
              />
            </div>
            <div className="other-button">
              <RaisedButton
                label="Delete Episode"
                onTouchTap={this.handleOpen}
                style={{marginLeft: '1em'}}
              />
            </div>
          </div>
        </div>
        <Dialog
          actions={actions}
          modal={false}
          open={this.state.warningAboutDelete}
          onRequestClose={this.handleClose}
        >
          Are you sure you want to delete this episode?
        </Dialog>
      </div>
    );
  }
}
