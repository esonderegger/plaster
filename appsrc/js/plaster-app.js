import React from 'react';
import Podcast from './podcast.js';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import WelcomeScreen from './welcome-screen.js';
import PlasterUpdater from './plaster-updater.js';

export default class PlasterApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      podcastPath: '',
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarDuration: 4000,
      errorOpen: false,
      errorMessage: '',
      enableAutoUpdates: false
    };
    this.goHome = this.goHome.bind(this);
    this.setSnackbar = this.setSnackbar.bind(this);
    this.snackbarClose = this.snackbarClose.bind(this);
    this.setError = this.setError.bind(this);
    this.errorClose = this.errorClose.bind(this);
    this.updatePodcastPath = this.updatePodcastPath.bind(this);
  }
  componentDidMount() {
    var pathFromLocalStorage = localStorage.getItem('podcastDirectory');
    if (pathFromLocalStorage && pathFromLocalStorage !== 'null') {
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
  setSnackbar(message, duration) {
    this.setState({
      snackbarOpen: true,
      snackbarMessage: message,
      snackbarDuration: duration
    });
  }
  snackbarClose() {
    this.setState({
      snackbarOpen: false
    });
  }
  setError(message) {
    this.setState({
      errorOpen: true,
      errorMessage: message
    });
  }
  errorClose() {
    this.setState({
      errorOpen: false
    });
  }
  render() {
    var mainWindow = (
      <WelcomeScreen
        updatePodcastPath={this.updatePodcastPath}
        setSnackbar={this.setSnackbar}
        setError={this.setError}
      />
    );
    if (this.state.podcastPath) {
      mainWindow = (
        <Podcast
          directory={this.state.podcastPath}
          goHome={this.goHome}
          setSnackbar={this.setSnackbar}
          setError={this.setError}
        />
      );
    }
    const errorActions = [
      <FlatButton
        label="Ok"
        primary={true}
        onTouchTap={this.errorClose}
      />
    ];
    var snackbarProgress = (
      <div style={{
        width: '2em',
        display: 'inline-block',
        position: 'relative',
        top: '-3px',
        left: '-9px'
      }}>
        <LinearProgress mode="indeterminate" />
      </div>
    );
    var snackbarJsx = (
      <div>
        {this.state.snackbarDuration ? null : snackbarProgress}
        <span>{this.state.snackbarMessage}</span>
      </div>
    );
    return (
      <div className="plaster-app">
        {mainWindow}
        <Snackbar
          open={this.state.snackbarOpen}
          message={snackbarJsx}
          autoHideDuration={this.state.snackbarDuration}
          onRequestClose={this.snackbarClose}
        />
        <Dialog
          actions={errorActions}
          modal={false}
          open={this.state.errorOpen}
          onRequestClose={this.errorClose}
        >{this.state.errorMessage}</Dialog>
        {this.state.enableAutoUpdates ? <PlasterUpdater /> : null}
      </div>
    );
  }
}
