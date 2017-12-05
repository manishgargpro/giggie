import React, { Component } from 'react';
import Nav from '../components/Nav'
import GigCreate from '../components/GigCreate'
import GigHolder from '../components/GigHolder'
import API from '../utils/API'
import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
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
      }).catch(err => {
        console.log(err)
        this.setState({
          error: {
            message: "Sorry, something went wrong on our end."
          },
          snackbarOpen: true
        })
      });
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
    dialogOpen: false,
    menuOpen: false,
    snackbarOpen: false,
    editMode: false,
    edigGigId: null
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
          this.handleClose()
        });
    } else {
      this.props.signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(user => {
          console.log(user);
          this.setState({
            email: "",
            password: ""
          })
          this.handleClose()
        })
        .catch(err => {
          this.setState({
            error: err,
            snackbarOpen: true
          });
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
            this.setState({
              email: "",
              password: "",
            })
            this.handleClose()
          });
        }
      })
      .catch(err => {
        this.setState({
          error: err,
          snackbarOpen: true
        });
        console.log(this.state.error)
      });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleOpen = (dialogOpen, menuOpen, id, title, description, editMode) => {
    this.setState({
      dialogOpen: dialogOpen,
      menuOpen: menuOpen,
      edigGigId: id,
      title: title,
      description: description,
      editMode: editMode
    });
  };

  handleClose = () => {
    this.setState({
      dialogOpen: false,
      menuOpen: false,
      title: "",
      description: "",
      snackbarOpen: false
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
        })
        this.getGigs();
        this.handleClose();
        console.log(this.state)
      })
      .catch(err => {
        console.log(err)
        this.setState({
          error: {
            message: "Sorry, something went wrong on our end."
          },
          snackbarOpen: true
        })
      });
    } else {
      this.setState({
        error: {
          message: "One or more fields is blank, please try again."
        },
        snackbarOpen: true
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
        this.setState({
          error: {
            message: "Sorry, something went wrong on our end."
          },
          snackbarOpen: true
        })
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
        this.setState({
          error: {
            message: "Sorry, something went wrong on our end."
          },
          snackbarOpen: true
        })
      });
  }

  handleEditGig = () => {
    if (this.state.title !== "" && this.state.description !== "") {
      API.updateGig({
        id: this.state.edigGigId,
        title: this.state.title,
        description: this.state.description
      }).then(res => {
        this.setState({
          mongoUserObject: res.data
        });
        this.getGigs();
        this.handleClose();
        console.log(this.state)
      })
      .catch(err => {
        console.log(err)
        this.setState({
          error: {
            message: "Sorry, something went wrong on our end."
          },
          snackbarOpen: true
        })
      });
    } else {
      this.setState({
        error: {
          message: "One or more fields is blank, please try again."
        },
        snackbarOpen: true
      })
    }
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
        this.setState({
          error: {
            message: "Sorry, something went wrong on our end."
          },
          snackbarOpen: true
        })
      });
    } else {
      this.setState({
        error: {
          message: "One or more fields is blank, please try again."
        },
        snackbarOpen: true
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
        this.setState({
          error: {
            message: "Sorry, something went wrong on our end."
          },
          snackbarOpen: true
        })
      });
  }

  render() {
    return (
      <div>
        <Nav
          handleOpen={this.handleOpen}
          handleSignIn={this.handleSignIn}
          handleCreateAccount={this.handleCreateAccount}
          email={this.state.email}
          password={this.state.password}
          handleInputChange={this.handleInputChange}
          currentUser={this.props.currentUser}
          menuOpen={this.state.menuOpen}
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
                  editOpen={this.handleOpen}
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
                  editOpen={this.handleOpen}
                  leaveComment={this.handleCommentSubmit}
                  deleteComment={this.handleDeleteComment}
                />
              </Tab>
            </Tabs>
            <GigCreate
              label={this.state.editMode ? 
                "Edit" :
                "Create"
              }
              handleGigSubmit={this.state.editMode ? 
                this.handleEditGig :
                this.handleGigSubmit
              }
              handleClose={this.handleClose}
              handleInputChange={this.handleInputChange}
              title={this.state.title}
              description={this.state.description}
              open={this.state.dialogOpen}
            />
            <Snackbar
              open={this.state.snackbarOpen}
              message={this.state.error.message ?
                this.state.error.message :
                ""
              }
              autoHideDuration={2500}
            />
          </div>
        }
      </div>
    );
  }
}

export default withAuth(Home);
