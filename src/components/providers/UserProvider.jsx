import React, { Component, createContext } from 'react';
import { auth } from '../../firebase';
import { connect } from 'react-redux';
import { signIn, signOut } from '../../redux/actions';

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
      this.props.signIn(this.state.user.uid);

      localStorage.setItem('userName', this.state.user.displayName);
      localStorage.setItem('email', this.state.user.email);
      localStorage.setItem('photo', this.state.user.photoURL);
      localStorage.setItem('userId', this.state.user.uid);

      userAuth.getIdToken().then((idToken) => {
        localStorage.setItem('token', idToken);
        this.setState({ token: idToken });
      }).catch((error) => console.log(error));

      console.log('user logged in');
    } else {
      this.props.signOut();

      localStorage.removeItem('userName');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');

      console.log('user logged out');
    }
  })
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

const mapStateToProps = (state) => {
  return { isSignedIn: state.auth.isSignedIn };
}

export default connect(
  mapStateToProps,
  { signIn, signOut }
)(UserProvider);