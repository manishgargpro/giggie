import React, { Component } from 'react';
import API from '../utils/API'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'

export default class GigCreate extends Component {

  state = {
    title: "",
    description: "",
    open: false
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
      authorId: this.props.authorId
    }).then(res => {
      console.log(res.data)
      this.handleClose();
    })
  }

  render() {
    const actions = [
      <RaisedButton
        label="Submit"
        onClick={this.handleGigSubmit}
      />,
      <RaisedButton
        label="Cancel"
        onClick={this.handleClose}
      />
    ]

    return (
      <div>
        <RaisedButton label="Create a Gig" onClick={this.handleOpen} />
        <Dialog
          title="Gig Form"
          actions={actions}
          open={this.state.open}
          onRequestClose={this.handleClose}
          children={
            <div>
              Gig Title
              <br />
              <TextField
                name="title"
                type="text"
                value={this.state.title}
                onChange={this.handleInputChange}
              />
              <br />
              Gig Description
              <br />
              <TextField
                name="description"
                type="text"
                multiLine={true}
                rows={4}
                value={this.state.description}
                onChange={this.handleInputChange}
              />
            </div>
          }
        />
      </div>
    )
  }

}