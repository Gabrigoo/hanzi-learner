import React, {
  useContext, useState, useEffect, ReactElement,
} from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import { UserContext } from '../providers/UserProvider';
import { loadMainData, getToken } from '../../redux/actions';
import { instance as axios } from '../../axios-instance';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';
import mainMenu from '../../assets/main-menu.png';
import './Header.css';

interface ReactProps {
  isSignedIn: boolean
  token: string
  loadMainData: (source: CancelTokenSource, token: string) => any,
  getToken: (userAuth: firebase.User) => any,
}

const Header = (props: ReactProps): ReactElement => {
  // setting up user status
  const currentUser: any = useContext(UserContext);

  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [photo, setPhoto] = useState(localStorage.getItem('photo'));

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
    setEmail(localStorage.getItem('email'));
    setPhoto(localStorage.getItem('photo'));

    const source = axios.CancelToken.source();

    if (currentUser && props.token) {
      props.loadMainData(source, props.token);
    } else if (currentUser) {
      props.getToken(currentUser);
    }
    console.log('header reloads');

    return () => {
      source.cancel('GET request cancelled');
    };
  }, [currentUser, props.token]);

  let content;

  if (currentUser) {
    let photoURL: string;

    if (photo === 'null' || !photo) {
      photoURL = unknownUser;
    } else {
      photoURL = photo;
    }

    content = (
      <header id="header">
        <Link to="/user" id="profile-link">
          <img id="profile-img" src={photoURL} alt="profile" />
        </Link>
        {userName !== 'null' ? <p id="header-user">{userName}</p> : ''}
        {email !== 'null' ? <p id="header-email">{email}</p> : ''}
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
  token: state.auth.token,
});

export default connect(
  mapStateToProps,
  { loadMainData, getToken },
)(Header);
