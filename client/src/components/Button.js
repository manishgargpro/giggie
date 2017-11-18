import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';


class Button extends Component {
  render() {
    return (
      <RaisedButton
        label="Test API"
        onClick={this.props.handleButton}
      />
    );
  }
}

export default Button;
