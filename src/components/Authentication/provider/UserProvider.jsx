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
        console.log('user is logged in');
      } else {
        this.props.signOut();
        console.log('user is logged out');
      }
    });
  };

  render() {
    return (
      <UserContext.Provider>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default connect(
  null, { signIn, signOut },
)(UserProvider);
