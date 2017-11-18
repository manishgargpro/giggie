import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

class Nav extends Component {
  render() {
    return (
      <AppBar
        title="Gigs"
        iconClassNameRight="muidocs-icon-navigation-expand-more"
      />
    );
  }
}

export default Nav;
