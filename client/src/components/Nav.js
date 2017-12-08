import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField'
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

export default class Nav extends Component {
  
  render() {
    return (
      <div>
        <AppBar
          title="Gigs"
          titleStyle={{textAlign: "center"}}
          iconElementLeft={<div/>}
          iconElementRight={
            <IconButton
              style={{cursor: "pointer"}}
              onClick={() => this.props.handleOpen(false, true)}
            >
              <NavigationMenu />
            </IconButton>
          }
        />
        <Drawer
          docked={false}
          open={this.props.menuOpen}
          openSecondary={true}
          onRequestChange={(open) => this.props.handleOpen(false, open)}
        >
          {this.props.currentUser ?
            <div>
              <MenuItem primaryText="Home" onClick={
                () => {
                  window.location = "/"
                }
              } />
              <MenuItem primaryText="Create a Gig" onClick={
                () => {
                  this.props.handleOpen(true, true, null, "", "", false)
                }
              } />
              <Divider/>
              <MenuItem
                primaryText="Sign Out"
                onClick={
                  event => {
                    this.props.handleSignIn(event)
                  }
                }
              />
            </div>
            :
            <div>
              <TextField
                name="email"
                type="text"
                hintText="Your Email"
                underlineShow={false}
                value={this.props.email}
                onChange={this.props.handleInputChange}
              />
              <TextField
                name="password"
                type="password"
                hintText="Your Password"
                underlineShow={false}
                value={this.props.password}
                onChange={this.props.handleInputChange}
                errorText={this.props.error.message}
              />
              <br/>
              <MenuItem
                primaryText="Sign In"
                onClick={
                  event => {
                    this.props.handleSignIn(event)
                  }
                }
              />
              <Divider/>
              <MenuItem
                primaryText="Create Account"
                onClick={
                  event => {
                    this.props.handleCreateAccount(event)
                  }
                }
              />
            </div>
          }
        </Drawer>
      </div>
    );
  }
}
