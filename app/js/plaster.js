import React from 'react';
import ReactDOM from 'react-dom';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import PlasterApp from './plaster-app.js';

injectTapEventPlugin();

export default class Plaster extends React.Component {
  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
        <PlasterApp />
      </MuiThemeProvider>
    );
  }
}

ReactDOM.render(
  <Plaster />,
  document.getElementById('app')
);
