import React, {
  useContext, useState, useEffect, MouseEvent, ReactElement,
} from 'react';
import './Header.css';
import unknownUser from '../assets/unknown-user.png';
import mainMenu from '../assets/main-menu.png';
import { UserContext } from './providers/UserProvider';
import history from '../history';

const Header = (): ReactElement => {
  // setting up user status
  const currentUser = useContext(UserContext);

  const [user, setUser] = useState(localStorage.getItem('user'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [photo, setPhoto] = useState(localStorage.getItem('photo'));

  useEffect(() => {
    setUser(localStorage.getItem('user'));
    setEmail(localStorage.getItem('email'));
    setPhoto(localStorage.getItem('photo'));
    console.log('header reloads');
  }, [currentUser]);

  const switchScreen = (event: MouseEvent<HTMLButtonElement>) => {
    const name = event.currentTarget.name;
    let path = '';
    switch (name) {
      case 'main-menu':
        path = '/main';
        break;
      case 'start-lesson':
        path = '/lesson';
        break;
      case 'start-add':
        path = '/add';
        break;
      case 'sign-in':
        path = '/signIn';
        break;
      case 'sign-up':
        path = '/signUp';
        break;
      case 'profile':
        path = '/user';
        break;
      case 'password-reset':
        path = '/passwordReset';
        break;
      default:
        break;
    }
    history.push(path);
  };

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
        <button name="profile" id="profile-button" onClick={switchScreen}>
          <img id="profile-img" src={photoURL} alt="profile" />
        </button>
        {user !== 'null' ? <p id="header-user">{user}</p> : ''}
        {email !== 'null' ? <p id="header-email">{email}</p> : ''}
        <button name="main-menu" id="menu-button" onClick={switchScreen}>
          <img id="main-menu-icon" src={mainMenu} alt="mainmenu" />
        </button>
      </header>
    );
  } else {
    content = (
      <header id="header">
        <button name="profile" id="profile-button">
          <img id="profile-img" src={unknownUser} alt="profile" />
        </button>
        <button type="button" name="sign-in" id="sing-in-button" onClick={switchScreen}>Sign in</button>
        <button type="button" name="sign-up" id="sing-up-button" onClick={switchScreen}>Sign up</button>
        <button name="main-menu" id="menu-button" onClick={switchScreen}>
          <img id="main-menu-icon" src={mainMenu} alt="mainmenu" />
        </button>
      </header>
    );
  }

  return (
    <div>
      {content}
    </div>
  );
};

export default Header;
