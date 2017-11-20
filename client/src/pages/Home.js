import React, { Component } from 'react';
import Nav from '../components/Nav'
import GigCreate from '../components/GigCreate'
import GigHolder from '../components/GigHolder'
import API from '../utils/API'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton';
import withAuth from "../components/HOC/withAuth";


class Home extends Component {

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.currentUser) {
      API.getUser(nextProps.currentUser.uid).then(res => {
        console.log(res.data._id)
        this.setState({
          mongoUserObject: res.data
        })
        console.log(this.state)
      })
    } else {
      console.log(this.state)
    }
  }

  state = {
    email: "",
    password: "",
    error: {},
    mongoUserObject: {}
  }

  handleSignIn = event => {
    event.preventDefault();
    if (this.props.currentUser) {
      this.props.signOut()
        .then(user => {
          console.log(user);
          this.setState({
            email: "",
            password: "",
            mongoUserObject: {}
          })
        });
    } else {
      this.props.signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          console.log(user);
        })
        .catch(err => {
          this.setState({ error: err });
          console.log(this.state.error)
        });
    }

  }

  handleCreateAccount = event => {
    event.preventDefault();
    this.props.createAndSetUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(user => {
        if (user) {
          API.createUser({
            firebaseId: user.uid,
            name: user.email
          }).then(res => {
            console.log(res.data)
          });
        }
      })
      .catch(err => {
        this.setState({ error: err });
        console.log(this.state.error)
      });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div>
        <Nav
          iconElementRight={this.props.currentUser ?
            <div>
              <GigCreate
                authorId={this.state.mongoUserObject._id}
              />
              <RaisedButton
                label="Sign Out"
                onClick={this.handleSignIn}
              />
            </div>
            :
            <div>
              <TextField
                name="email"
                type="text"
                hintText="Your Email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
              <TextField
                name="password"
                type="password"
                hintText="Your Password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
              <RaisedButton
                label="Sign In"
                onClick={this.handleSignIn}
              />
              <RaisedButton
                label="Create Account"
                onClick={this.handleCreateAccount}
              />
            </div>
          }
        />
        <h1>{this.props.currentUser ? `Welcome, ${this.props.currentUser.email}!` : "Welcome!"}</h1>
        <GigHolder
          tilesData={this.state.mongoUserObject.gigs}
          subtitle={
            <RaisedButton
              label="See Details"
            />
          }
        />
      </div>
    );
  }
}

export default withAuth(Home);
