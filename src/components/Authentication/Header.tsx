import React, {
  useEffect, ReactElement,
} from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import { loadMainData, getToken } from '../../redux/actions';
import { instance as axios } from '../../axios-instance';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';
import mainMenu from '../../assets/main-menu.png';
import './Header.css';

interface HeaderProps {
  isSignedIn: boolean,
  user: firebase.User,
  token: string,
  loadMainData: (source: CancelTokenSource, token: string) => any,
  getToken: (userAuth: firebase.User) => any,
}

const Header: React.FC<HeaderProps> = (props): ReactElement => {
  useEffect(() => {
    const source = axios.CancelToken.source();

    if (props.user && props.token) {
      props.loadMainData(source, props.token);
    } else if (props.user) {
      props.getToken(props.user);
    }
    console.log('header reloads');

    return () => {
      source.cancel('GET request cancelled');
    };
  }, [props.user, props.token]);

  let content;

  if (props.user) {
    let photo: string;

    if (!props.user.photoURL) {
      photo = unknownUser;
    } else {
      photo = props.user.photoURL;
    }

    content = (
      <header id="header">
        <Link to="/user" id="profile-link">
          <img id="profile-img" src={photo} alt="profile" />
        </Link>
        {props.user.displayName ? <p id="header-user">{props.user.displayName}</p> : ''}
        {props.user.email ? <p id="header-email">{props.user.email}</p> : ''}
        <Link to="/main-menu" id="main-menu-link">
          <img id="main-menu-icon" src={mainMenu} alt="mainmenu" />
        </Link>
      </header>
    );
  } else {
    content = (
      <header id="header">
        <Link to="/main-menu" id="main-menu-link">
          <img id="main-menu-icon" src={mainMenu} alt="mainmenu" />
        </Link>
        <div id="profile-link" className="grayscale">
          <img id="profile-img" src={unknownUser} alt="profile" />
        </div>
        <Link to="/sign-in" className="signing-button">Sign in</Link>
        <Link to="/sign-up" className="signing-button">Sign up</Link>
      </header>
    );
  }

  return (
    <div>
      {content}
    </div>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  isSignedIn: state.auth.isSignedIn,
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(
  mapStateToProps,
  { loadMainData, getToken },
)(Header);
