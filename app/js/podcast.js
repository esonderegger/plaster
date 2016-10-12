import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import PodcastChannel from './podcast-channel.js';
import PodcastSettings from './podcast-settings.js';
import PodcastItem from './podcast-item.js';
import podcastParser from './podcast-parser.js';
import podcastRender from './podcast-render.js';
var path = require('path');
var moment = require('moment');

export default class Podcast extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcast: {
        title: '',
        link: '',
        subtitle: '',
        description: '',
        language: 'en-us',
        image: '',
        author: '',
        copyright: '',
        ownerName: '',
        ownerEmail: '',
        explicit: false,
        categories: [],
        items: []
      },
      settings: {
        showOptionalFields: false,
        deploytype: 'none',
        urlPrefix: '',
        sftphost: '',
        sftpuser: '',
        sftppass: '',
        sftppath: '',
        s3bucketname: '',
        s3accesskey: '',
        s3secretkey: ''
      },
      activeItem: -1,
      settingsDialogOpen: false
    };
    this.updateSubState = this.updateSubState.bind(this);
    // this.handleTextFieldChange = this.handleTextFieldChange.bind(this);
    this.handleItemChange = this.handleItemChange.bind(this);
    this.newItem = this.newItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.setActiveItem = this.setActiveItem.bind(this);
    this.openSettingsDialog = this.openSettingsDialog.bind(this);
    this.closeSettingsDialog = this.closeSettingsDialog.bind(this);
  }
  componentDidMount() {
    var xmlPath = path.join(this.props.directory, 'podcast.xml');
    var outerThis = this;
    podcastParser(xmlPath, function(parsed) {
      outerThis.setState({podcast: parsed});
    });
  }
  updateSubState(outerKey, innerKey, value) {
    var newState = {};
    newState[outerKey] = this.state[outerKey];
    newState[outerKey][innerKey] = value;
    this.setState(newState);
  }
  // handleTextFieldChange(e) {
  //   var newState = {};
  //   newState[e.target.name] = e.target.value;
  //   this.setState(newState);
  // }
  handleItemChange(i, k, v) {
    var tmpPodcast = this.state.podcast;
    tmpPodcast.items[i][k] = v;
    this.setState({podcast: tmpPodcast});
  }
  newItem() {
    var DATE_RFC2822 = "ddd, DD MMM YYYY HH:mm:ss ZZ";
    var newItem = {
      title: '',
      description: '',
      author: '',
      duration: '0:00:00',
      subtitle: '',
      pubdate: moment().format(DATE_RFC2822),
      filesize: 0,
      filetype: '',
      fileurl: ''
    };
    var tmpPodcast = this.state.podcast;
    tmpPodcast.items = [newItem].concat(tmpPodcast.items);
    this.setState({
      podcast: tmpPodcast,
      activeItem: 0
    });
  }
  deleteItem(i) {
    var tmpPodcast = this.state.podcast;
    tmpPodcast.items.splice(i, 1);
    this.setState({podcast: tmpPodcast});
  }
  setActiveItem(i) {
    this.setState({activeItem: i});
  }
  openSettingsDialog() {
    this.setState({settingsDialogOpen: true});
  }
  closeSettingsDialog() {
    this.setState({settingsDialogOpen: false});
  }
  saveChanges() {
    podcastRender(this.props.directory,
      this.state.podcast,
      this.state.settings.prefixUrl);
  }
  render() {
    var outerThis = this;
    return (
      <div className="podcast">
        <div className="podcast-banner">
          <div className="other-button">
            <RaisedButton
              label="Settings"
              onTouchTap={this.openSettingsDialog}
            />
          </div>
          <div className="other-button">
            <RaisedButton
              label="Go Home"
              onTouchTap={this.props.goHome}
            />
          </div>
          <div className="other-button">
            <RaisedButton
              label="Save Changes"
              onTouchTap={this.saveChanges}
            />
          </div>
        </div>
        <PodcastChannel
          podcast={this.state.podcast}
          settings={this.state.settings}
          handleChange={(k, v) => this.updateSubState('podcast', k, v)}
        />
        <PodcastSettings
          open={this.state.settingsDialogOpen}
          close={this.closeSettingsDialog}
          settings={this.state.settings}
          handleChange={(k, v) => this.updateSubState('settings', k, v)}
        />
        <div className="item-divider-menu">
          <div className="item-divider-text">Episodes:</div>
          <div className="item-divider-buttons">
            <div>
              <RaisedButton
                label="New Episode"
                onTouchTap={this.newItem}
              />
            </div>
          </div>
        </div>
        <div className="item-list">
          {
            this.state.podcast.items.map(function(item, i) {
              return (
                <PodcastItem key={i}
                  episode={item}
                  settings={outerThis.state.settings}
                  handleChange={(k, v) => outerThis.handleItemChange(i, k, v)}
                  deleteItem={() => outerThis.deleteItem(i)}
                  expanded={outerThis.state.activeItem === i}
                  expand={() => outerThis.setActiveItem(i)}
                  collapse={() => outerThis.setActiveItem(-1)}
                />
              );
            })
          }
        </div>
      </div>
    );
  }
}
