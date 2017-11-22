import React, { Component } from 'react';
import Nav from '../components/Nav'
import GigCreate from '../components/GigCreate'
import GigHolder from '../components/GigHolder'
import API from '../utils/API'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton';
import withAuth from "../components/HOC/withAuth";


class Home extends Component {

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.currentUser) {
      API.getUser(nextProps.currentUser.uid).then(res => {
        console.log(res.data)
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
    mongoUserObject: null,
    title: "",
    description: "",
    open: false
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
            mongoUserObject: null
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
  
  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({
      open: false,
      title: "",
      description: ""
    });
  };
  
  handleGigSubmit = event => {
    event.preventDefault();
    API.createGig({
      title: this.state.title,
      description: this.state.description,
      authorId: this.state.mongoUserObject._id
    }).then(res => {
      console.log(res.data)
      this.setState({
        mongoUserObject: res.data
      })
      console.log(this.state)
      this.handleClose();
    })
    .catch(err => {
      console.log(err)
    });
  }

  handleDeleteGig = id => {
    API.deleteGig(id, this.state.mongoUserObject._id)
    .then(res => {
      console.log(res.data)
      console.log(this)
      this.setState({
        mongoUserObject: res.data
      });
    })
    .catch(err => {
      console.log(err)
    });
  }

  render() {
    return (
      <div>
        <Nav
          iconElementRight={this.props.currentUser ?
            <div>
              <RaisedButton label="Create a Gig" onClick={this.handleOpen} />
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
        <h1>{this.state.mongoUserObject ? 
          `Welcome, ${this.state.mongoUserObject.name}!`
          :
          "Welcome!"}
        </h1>
        <GigCreate
          handleGigSubmit={this.handleGigSubmit}
          handleClose={this.handleClose}
          handleInputChange={this.handleInputChange}
          title={this.state.title}
          description={this.state.description}
          open={this.state.open}
        />
        {this.state.mongoUserObject && <GigHolder
          gigs={this.state.mongoUserObject.gigs}
          subtitle={this.state.mongoUserObject.name}
          onClick={this.handleDeleteGig}
        />
        }
      </div>
    );
  }
}

export default withAuth(Home);
