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
  componentDidMount() {
    var pathFromLocalStorage = localStorage.getItem('podcastDirectory');
    if (pathFromLocalStorage) {
      this.setState({podcastPath: pathFromLocalStorage});
    }
  }
  updatePodcastPath(p) {
    this.setState({podcastPath: p});
    localStorage.setItem('podcastDirectory', p);
  }
  goHome() {
    this.setState({podcastPath: ''});
    localStorage.setItem('podcastDirectory', null);
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
