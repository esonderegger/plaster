import React from 'react';
import Podcast from './podcast.js';
import WelcomeScreen from './welcome-screen.js';

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
