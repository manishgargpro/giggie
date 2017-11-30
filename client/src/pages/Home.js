import React, { Component } from 'react';
import Nav from '../components/Nav'
import GigCreate from '../components/GigCreate'
import GigHolder from '../components/GigHolder'
import API from '../utils/API'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton';
import { Tabs, Tab } from 'material-ui/Tabs';
import withAuth from "../components/HOC/withAuth";


class Home extends Component {

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.currentUser) {
      API.getUser(nextProps.currentUser.uid).then(res => {
        console.log(res.data)
        this.setState({
          mongoUserObject: res.data
        })
        this.getGigs();
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
    allGigs: [],
    title: "",
    description: "",
    open: false
  }

  getGigs = () => {
    API.getAllGigs().then(res => {
      this.setState({
        allGigs: res.data
      });
      console.log(this.state);
    })
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
    if (this.state.title !== "" && this.state.description !== "") {
      API.createGig({
        title: this.state.title,
        description: this.state.description,
        authorId: this.state.mongoUserObject._id
      }).then(res => {
        console.log(res.data)
        this.setState({
          mongoUserObject: res.data,
          title: "",
          description: ""
        })
        this.getGigs();
        this.handleClose();
        console.log(this.state)
      })
      .catch(err => {
        console.log(err)
      });
    } else {
      this.setState({
        error: {
          message: "One or more fields is blank, please try again."
        }
      })
    }
  }

  handleDeleteGig = (id, workerId) => {
    console.log(workerId)
    API.deleteGig({
      id: id,
      authorId: this.state.mongoUserObject._id,
      workerId: workerId
    })
      .then(res => {
        this.setState({
          mongoUserObject: res.data
        });
        this.getGigs();
        console.log(this.state)
      })
      .catch(err => {
        console.log(err)
      });
  }

  handleAcceptGig = (id, accept) => {
    API.updateGig({
      id: id,
      workerId: this.state.mongoUserObject._id,
      accept: accept
    })
      .then(res => {
        this.setState({
          mongoUserObject: res.data
        });
        this.getGigs();
        console.log(this.state)
      })
      .catch(err => {
        console.log(err)
      });
  }

  handleCommentSubmit = id => {
    if (this.state.text !== "") {
      API.createComment({
        text: this.state.text,
        commentorId: this.state.mongoUserObject._id,
        gigId: id
      }).then(res => {
        console.log(res.data)
        this.setState({
          mongoUserObject: res.data,
          text: ""
        });
        this.getGigs();
        console.log(this.state)
      })
      .catch(err => {
        console.log(err)
      });
    } else {
      this.setState({
        error: {
          message: "One or more fields is blank, please try again."
        }
      })
    }
  }

  handleDeleteComment = (id, gigId) => {
    console.log(id)
    API.deleteComment({
      id: id,
      gigId: gigId,
    })
      .then(res => {
        this.setState({
          mongoUserObject: res.data
        });
        this.getGigs();
        console.log(this.state)
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
          "Welcome! Please log in or create an account to get started!"}
        </h1>
        {this.state.mongoUserObject &&
          <div>
            <Tabs>
              <Tab label="Your Gigs" >
                <GigHolder
                  gigs={this.state.mongoUserObject.gigs}
                  loggedInId={this.state.mongoUserObject._id}
                  text={this.state.text}
                  handleInputChange={this.handleInputChange}
                  deleteFunction={this.handleDeleteGig}
                  acceptFunction={this.handleAcceptGig}
                  leaveComment={this.handleCommentSubmit}
                  deleteComment={this.handleDeleteComment}
                />
              </Tab>
              <Tab label="All Gigs" >
                <GigHolder
                  gigs={this.state.allGigs}
                  loggedInId={this.state.mongoUserObject._id}
                  text={this.state.text}
                  handleInputChange={this.handleInputChange}
                  deleteFunction={this.handleDeleteGig}
                  acceptFunction={this.handleAcceptGig}
                  leaveComment={this.handleCommentSubmit}
                  deleteComment={this.handleDeleteComment}
                />
              </Tab>
            </Tabs>
            <GigCreate
              handleGigSubmit={this.handleGigSubmit}
              handleClose={this.handleClose}
              handleInputChange={this.handleInputChange}
              title={this.state.title}
              description={this.state.description}
              open={this.state.open}
              message={this.state.error.message}
            />
          </div>
        }
      </div>
    );
  }
}

export default withAuth(Home);
