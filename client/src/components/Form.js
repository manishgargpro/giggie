import React, { Component } from 'react';
import API from '../utils/API'
import Button from './Button'
import TextField from 'material-ui/TextField'

class Form extends Component {
  state = {
    text: ""
  }
  
  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  };

  submitForm = () => {
    API.getAllComments().then(res => console.log(res.data))
  }

  render() {
    return (
      <div>
        <TextField
          name="text"
          type="text"
          hintText="Text"
          value={this.state.text}
          onChange={this.handleInputChange}
        />
        <br />
        <Button
          handleButton={this.submitForm}
        />
      </div>
    );
  }
}

export default Form;