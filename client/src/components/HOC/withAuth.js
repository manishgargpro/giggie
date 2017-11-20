import React, { Component } from "react";
import PropTypes from "prop-types";

const withAuth = (EnhancedComponent) => (
  class extends Component {
    static contextTypes = {
      currentUser: PropTypes.object,
      createAndSetUserWithEmailAndPassword: PropTypes.func,
      signInWithEmailAndPassword: PropTypes.func,
      signOut: PropTypes.func
    };

    render() {
      return <EnhancedComponent
        {...this.context}
        {...this.props}
        {...this.state}
      />
    }
  }
)

export default withAuth;