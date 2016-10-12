import React from 'react';
// import FlatButton from 'material-ui/FlatButton';
// import RaisedButton from 'material-ui/RaisedButton';
// import TextField from 'material-ui/TextField';
// import Dialog from 'material-ui/Dialog';
import Podcast from './podcast.js';
import WelcomeScreen from './welcome-screen.js';
// var electronApp = require('electron').remote;
// const path = require('path');
// const http = require('http');
// const https = require('https');
// const fs = require('fs');

export default class PlasterApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcastPath: ''
    };
    this.goHome = this.goHome.bind(this);
    this.updatePodcastPath = this.updatePodcastPath.bind(this);
  }
  updatePodcastPath(p) {
    this.setState({podcastPath: p});
  }
  goHome() {
    this.setState({podcastPath: ''});
  }
  render() {
    if (this.state.podcastPath) {
      return (
        <div className="plaster-app">
          <Podcast
            directory={this.state.podcastPath}
            goHome={this.goHome}
          />
        </div>
      );
    }
    return (
      <div className="plaster-app">
        <WelcomeScreen
          updatePodcastPath={this.updatePodcastPath}
        />
      </div>
    );
  }
}
