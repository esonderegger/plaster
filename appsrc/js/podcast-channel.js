import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PodcastCategories from './podcast-categories.js';
var electronApp = require('electron').remote;
const fs = require('fs');
const path = require('path');

export default class PodcastChannel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categoriesOpen: false
    };
    this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.chooseImage = this.chooseImage.bind(this);
    this.openCategories = this.openCategories.bind(this);
    this.closeCategories = this.closeCategories.bind(this);
  }
  handleTextFieldChange(e) {
    this.props.handleChange(e.target.name, e.target.value);
  }
  chooseImage() {
    var outerThis = this;
    electronApp.dialog.showOpenDialog(function(fileNames) {
      if (fileNames !== undefined) {
        var imageBasename = path.basename(fileNames[0]);
        var target = path.join(outerThis.props.directory, imageBasename);
        if (outerThis.props.podcast.image !== target) {
          if (outerThis.props.podcast.image !== '' &&
              !outerThis.props.podcast.image.startsWith('http')) {
            var toDeletePath = outerThis.props.podcast.image;
            if (toDeletePath.startsWith(outerThis.props.directory)) {
              fs.unlink(toDeletePath, function() {
                console.log(toDeletePath + ' deleted.');
              });
            }
          }
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
      }
    });
  }
  openCategories() {
    this.setState({categoriesOpen: true});
  }
  closeCategories() {
    this.setState({categoriesOpen: false});
  }
  render() {
    var imgSrc = 'noimg.png';
    if (this.props.podcast.image.startsWith('/')) {
      imgSrc = 'file://' + this.props.podcast.image;
    } else if (this.props.podcast.image.startsWith('http')) {
      imgSrc = this.props.podcast.image;
    } else if (this.props.podcast.image !== '') {
      imgSrc = 'file:///' + this.props.podcast.image.replace(/\\/g, '/');
    }
    imgSrc = encodeURI(imgSrc);
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
            hintText="The author of this podcast"
            floatingLabelText="Author"
            name="author"
            fullWidth={true}
            value={this.props.podcast.author}
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
            hintText="The url of this podcast's website"
            floatingLabelText="Link"
            name="link"
            fullWidth={true}
            value={this.props.podcast.link}
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
          {this.props.settings.showOptionalFields ?
          (
            <TextField
              hintText="Copright information"
              floatingLabelText="Copyright"
              name="copyright"
              fullWidth={true}
              value={this.props.podcast.copyright}
              onChange={this.handleTextFieldChange}
            />
          ) : null}
        </div>
        <div className="other-fields">
          <div className="image-section">
            <img src={imgSrc} alt={this.state.title} />
            <RaisedButton
              className="choose-image-button"
              label="Choose an image file"
              onTouchTap={this.chooseImage}
            />
          </div>
          <div className="other-button">
            <RaisedButton
              label="Choose categories"
              onTouchTap={this.openCategories}
            />
          </div>
        </div>
        <PodcastCategories {...this.props}
          open={this.state.categoriesOpen}
          close={this.closeCategories}
          categories={this.props.podcast.categories}
        />
      </div>
    );
  }
}
