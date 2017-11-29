import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField'

export default class GigCreate extends Component {

  render() {
    const actions = [
      <RaisedButton
        label="Submit"
        onClick={this.props.handleGigSubmit}
      />,
      <RaisedButton
        label="Cancel"
        onClick={this.props.handleClose}
      />
    ]

    return (
      <div>
        <Dialog
          title="Gig Form"
          actions={actions}
          open={this.props.open}
          onRequestClose={this.props.handleClose}
          children={
            <div>
              {this.props.message}
              <br/>
              Gig Title
              <br />
              <TextField
                name="title"
                type="text"
                value={this.props.title}
                onChange={this.props.handleInputChange}
              />
              <br />
              Gig Description
              <br />
              <TextField
                name="description"
                type="text"
                multiLine={true}
                rows={4}
                value={this.props.description}
                onChange={this.props.handleInputChange}
              />
            </div>
          }
        />
      </div>
    )
  }

}