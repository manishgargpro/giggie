import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Auth from "./components/Auth";
import Home from './pages/Home'

class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <div>
          <Auth>
            <Home />
          </Auth>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
