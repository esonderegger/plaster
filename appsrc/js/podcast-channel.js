import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
var electronApp = require('electron').remote;
const fs = require('fs');
const path = require('path');

export default class PodcastChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.chooseImage = this.chooseImage.bind(this);
  }
  handleTextFieldChange(e) {
    this.props.handleChange(e.target.name, e.target.value);
  }
  chooseImage() {
    var outerThis = this;
    electronApp.dialog.showOpenDialog(function(fileNames) {
      if (fileNames === undefined) {
        console.log("No file selected");
      } else {
        console.log(fileNames[0]);
        outerThis.props.handleChange('image', fileNames[0]);
        console.log(outerThis.props);
        var imageBasename = path.basename(fileNames[0]);
        var target = path.join(outerThis.props.directory, imageBasename);
        var rd = fs.createReadStream(fileNames[0]);
        rd.on("error", function(err) {
          console.error(err);
        });
        var wr = fs.createWriteStream(target);
        wr.on("error", function(err) {
          console.error(err);
        });
        wr.on("close", function(ex) {
          outerThis.props.handleChange('image', target);
        });
        rd.pipe(wr);
      }
    });
  }
  render() {
    var imgSrc = 'noimg.png';
    if (this.props.podcast.image.startsWith('/')) {
      imgSrc = 'file://' + this.props.podcast.image;
    }
    if (this.props.podcast.image.startsWith('http')) {
      imgSrc = this.props.podcast.image;
    }
    return (
      <div className="podcast-channel">
        <div className="text-fields">
          <TextField
            hintText="The name of this podcast"
            floatingLabelText="Title"
            name="title"
            fullWidth={true}
            value={this.props.podcast.title}
            onChange={this.handleTextFieldChange}
          />
          {this.props.settings.showOptionalFields ?
          (
            <TextField
              hintText="The subtitle of this podcast"
              floatingLabelText="Subtitle"
              name="subtitle"
              fullWidth={true}
              value={this.props.podcast.subtitle}
              onChange={this.handleTextFieldChange}
            />
          ) : null}
          <TextField
            hintText="The url of this podcast's website"
            floatingLabelText="Link"
            name="link"
            fullWidth={true}
            value={this.props.podcast.link}
            onChange={this.handleTextFieldChange}
          />
          <TextField
            hintText="A short description of this podcast's content"
            floatingLabelText="Description"
            name="description"
            fullWidth={true}
            value={this.props.podcast.description}
            multiLine={true}
            onChange={this.handleTextFieldChange}
          />
          <TextField
            hintText="The author of this podcast"
            floatingLabelText="Author"
            name="author"
            fullWidth={true}
            value={this.props.podcast.author}
            onChange={this.handleTextFieldChange}
          />
          <TextField
            hintText="The name of this podcast's owner"
            floatingLabelText="Owner Name"
            name="ownerName"
            fullWidth={true}
            value={this.props.podcast.ownerName}
            onChange={this.handleTextFieldChange}
          />
          <TextField
            hintText="The email address for this podcast's owner"
            floatingLabelText="Owner Email"
            name="ownerEmail"
            fullWidth={true}
            value={this.props.podcast.ownerEmail}
            onChange={this.handleTextFieldChange}
          />
          <TextField
            hintText="Copright information"
            floatingLabelText="Copyright"
            name="copyright"
            fullWidth={true}
            value={this.props.podcast.copyright}
            onChange={this.handleTextFieldChange}
          />
        </div>
        <div className="other-fields">
          <div>
            <img src={imgSrc} alt={this.state.title} />
          </div>
          <div className="other-button">
            <RaisedButton
              label="Choose an image file"
              onTouchTap={this.chooseImage}
            />
          </div>
        </div>
      </div>
    );
  }
}
