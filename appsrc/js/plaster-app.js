import React from 'react';
import Podcast from './podcast.js';
import Snackbar from 'material-ui/Snackbar';
import WelcomeScreen from './welcome-screen.js';

export default class PlasterApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcastPath: '',
      snackbarOpen: false,
      snackbarMessage: ''
    };
    this.goHome = this.goHome.bind(this);
    this.setSnackbar = this.setSnackbar.bind(this);
    this.snackbarClose = this.snackbarClose.bind(this);
    this.updatePodcastPath = this.updatePodcastPath.bind(this);
  }
  componentDidMount() {
    var pathFromLocalStorage = localStorage.getItem('podcastDirectory');
    if (pathFromLocalStorage && pathFromLocalStorage !== 'null') {
      this.setState({podcastPath: pathFromLocalStorage});
      console.log(pathFromLocalStorage);
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
  setSnackbar(message) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message
    });
  }
  snackbarClose() {
    this.setState({
      snackbarOpen: false
    });
  }
  render() {
    var mainWindow = (
      <WelcomeScreen
        updatePodcastPath={this.updatePodcastPath}
      />
    );
    if (this.state.podcastPath) {
      mainWindow = (
        <Podcast
          directory={this.state.podcastPath}
          goHome={this.goHome}
          setSnackbar={this.setSnackbar}
        />
      );
    }
    return (
      <div className="plaster-app">
        {mainWindow}
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.snackbarMessage}
          autoHideDuration={4000}
          onRequestClose={this.snackbarClose}
        />
      </div>
    );
  }
}
