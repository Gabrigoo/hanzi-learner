import React, { Component, createContext } from 'react';
import { auth } from '../../firebase';

export const UserContext = createContext({
  user: null,
});

export const TokenContext = createContext(null);

class UserProvider extends Component {
    state = {
      user: null,
      token: null,
    };

componentDidMount = () => {
  auth.onAuthStateChanged((userAuth) => {
    console.log('auth state changed');
    this.setState({ user: userAuth });

    if (userAuth) {
      console.log('user logged in');
      localStorage.setItem('user', this.state.user.displayName);
      localStorage.setItem('email', this.state.user.email);
      localStorage.setItem('photo', this.state.user.photoURL);
      localStorage.setItem('userId', this.state.user.uid);
      userAuth.getIdToken().then((idToken) => {
        localStorage.setItem('token', idToken);
        this.setState({ token: idToken });
      }).catch((error) => console.log(error));
    } else {
      console.log('user logged out');
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    }
  });
};

render() {
  return (
    <UserContext.Provider value={this.state.user}>
      <TokenContext.Provider value={this.state.token}>
        {this.props.children}
      </TokenContext.Provider>
    </UserContext.Provider>
  );
}
}

export default UserProvider;
