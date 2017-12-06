import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Auth from "./components/Auth";
import Home from './pages/Home'

class App extends Component {
  render() {
    return (
      <Router>
      <MuiThemeProvider>
        <div>
          <Auth>
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route exact path="/profile/:id" component={Home}/>
            </Switch>
          </Auth>
        </div>
      </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
