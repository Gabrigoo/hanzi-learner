import React, { Component, createContext } from 'react';
import { connect } from 'react-redux';

import { auth } from '../../../firebase';
import { signIn, signOut } from '../../../redux/actions';

export const UserContext = createContext();

class UserProvider extends Component {

  componentDidMount = () => {
    auth.onAuthStateChanged((userAuth) => {
      if (userAuth) {
        this.props.signIn(userAuth);
      } else {
        this.props.signOut();
      }
    });
  };

  render() {
    return (
      <UserContext.Provider value={UserContext}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default connect(
  null, { signIn, signOut },
)(UserProvider);
