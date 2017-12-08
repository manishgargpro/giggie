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
    if (nextProps.currentUser) {      
      this.getUser({
        firebaseId: nextProps.currentUser.uid
      }, "mongoUserObject")
    }
    else {      
    }
  }

  componentDidMount () {
    if (this.props.match.params.id) {
      this.getUser({
        _id: this.props.match.params.id
      }, "profileObject")
    } else {
      this.setState({
        profileObject: null
      })
    }
  }

  state = {
    email: "",
    password: "",
    error: {},
    mongoUserObject: null,
    profileObject: null,
    allGigs: [],
    title: "",
    description: "",
    text: "",
    dialogOpen: false,
    menuOpen: false,
    snackbarOpen: false,
    editMode: false,
    edigGigId: null
  }

  getUser = (req, prop) => {
    API.getUser(req).then(res => {      
      this.setState({
        [prop]: res.data
      })
      this.getGigs();      
    }).catch(err => {      
      this.setState({
        error: {
          message: "Sorry, something went wrong on our end."
        },
        snackbarOpen: true
      })
    });
  }

  getGigs = () => {
    API.getAllGigs().then(res => {
      this.setState({
        allGigs: res.data
      });      
    })
  }

  handleSignIn = event => {
    event.preventDefault();
    if (this.props.currentUser) {
      this.props.signOut()
        .then(user => {          
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
      });
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      snackbarOpen: false
    });
  }

  handleOpen = (dialogOpen, menuOpen, id, title, description, editMode) => {
    this.setState({
      dialogOpen: dialogOpen,
      menuOpen: menuOpen,
      edigGigId: id,
      title: title,
      description: description,
      editMode: editMode,
      snackbarOpen: false
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
        if (this.state.profileObject) {
          window.location = "/"
        } else {
          this.setState({
            mongoUserObject: res.data,
          })
          this.getGigs();
          this.handleClose();
        }        
      })
      .catch(err => {        
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
    API.deleteGig({
      id: id,
      authorId: this.state.mongoUserObject._id,
      workerId: workerId,
      profileId: this.state.profileObject ? this.state.profileObject._id : this.state.mongoUserObject._id
    })
      .then(res => {
        if (res.data.firebaseId === this.props.currentUser.uid) {
          this.setState({
            mongoUserObject: res.data
          });
        } else {
          this.setState({
            profileObject: res.data
          });
        }
        this.getGigs();        
      })
      .catch(err => {        
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
      accept: accept,
      profileId: this.state.profileObject ? this.state.profileObject._id : this.state.mongoUserObject._id
    })
      .then(res => {
        if (res.data.firebaseId === this.props.currentUser.uid) {
          this.setState({
            mongoUserObject: res.data
          });
        } else {
          this.setState({
            profileObject: res.data
          });
        }
        this.getGigs();        
      })
      .catch(err => {        
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
        description: this.state.description,
        profileId: this.state.profileObject ? this.state.profileObject._id : this.state.mongoUserObject._id
      }).then(res => {
        if (res.data.firebaseId === this.props.currentUser.uid) {
          this.setState({
            mongoUserObject: res.data
          });
        } else {
          this.setState({
            profileObject: res.data
          });
        }
        this.getGigs();
        this.handleClose();        
      })
      .catch(err => {        
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

  handleCommentSubmit = (id) => {
    if (this.state.text !== "") {
      API.createComment({
        text: this.state.text,
        commentorId: this.state.mongoUserObject._id,
        gigId: id,
        profileId: this.state.profileObject ? this.state.profileObject._id : this.state.mongoUserObject._id
      }).then(res => {
        if (res.data.firebaseId === this.props.currentUser.uid) {
          this.setState({
            mongoUserObject: res.data,
            text: ""
          });
        } else {
          this.setState({
            profileObject: res.data,
            text: ""
          });
        }
        this.getGigs();
        this.handleClose();        
      })
      .catch(err => {        
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
    API.deleteComment({
      id: id,
      gigId: gigId,
      profileId: this.state.profileObject ? this.state.profileObject._id : this.state.mongoUserObject._id
    })
    .then(res => {
      if (res.data.firebaseId === this.props.currentUser.uid) {
        this.setState({
          mongoUserObject: res.data
        });
      } else {
        this.setState({
          profileObject: res.data
        });
      }
      this.getGigs();      
    })
    .catch(err => {      
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
          error={this.state.error}
        />
        <h1>{this.state.mongoUserObject ?
          (this.state.profileObject ?
            `${this.state.profileObject.name}'s Profile` :
            `Welcome, ${this.state.mongoUserObject.name}!`
          )
          :
          "Welcome! Please log in or create an account to get started!"}
        </h1>
        {this.state.mongoUserObject &&
          <div>
            <Tabs>
              <Tab label={this.state.profileObject ?
                    "Their Gigs" :
                    "Your Gigs"
                  } >
                <GigHolder
                  gigs={this.state.profileObject ?
                    this.state.profileObject.gigs :
                    this.state.mongoUserObject.gigs
                  }
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
              <Tab label="Gig Marketplace" >
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
          </div>
        }
        <Snackbar
          open={this.state.snackbarOpen}
          message={this.state.error.message ?
            this.state.error.message :
            ""
          }
          autoHideDuration={2500}
        />
      </div>
    );
  }
}

export default withAuth(Home);
