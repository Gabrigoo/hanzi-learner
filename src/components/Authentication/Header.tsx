import React, {
  useEffect, ReactElement,
} from 'react';
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import {
  AppBar,
  Container,
  Toolbar,
  IconButton,
  Avatar,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

import { loadMainData, getToken } from '../../redux/actions';
import { instance as axios } from '../../axios-instance';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';
import NavButton from '../partials/NavButton';

interface HeaderProps {
  user: User,
  token: string,
  loadMainData: (source: CancelTokenSource) => void,
  getToken: (userAuth: User) => void,
}

const Header: React.FC<HeaderProps> = (props): ReactElement => {
  useEffect(() => {
    const source = axios.CancelToken.source();

    if (props.user && props.token) {
      props.loadMainData(source);
    } else if (props.user) {
      props.getToken(props.user);
    }

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
      <AppBar color="secondary" position="static">
        <Container maxWidth={false}>
          <Toolbar disableGutters>

            <Link to="/main-menu">
              <IconButton aria-label="main-menu" size="large" edge="start" sx={{ mr: 2 }}>
                <HomeIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Link>

            <NavButton title="Learn" to="/learn" />

            <NavButton title="Review" to="/review" />

            <NavButton title="Stages" to="/stages" />

            <NavButton title="Search" to="/search" />

            <NavButton title="Addition" to="/add" />

            <Box sx={{ flexGrow: 1 }} />

            <Link className="no-underline" to="/user">
              <Avatar
                sx={{ mr: 3 }}
                src={photo}
                alt="profile-picture"
              />
            </Link>

          </Toolbar>
        </Container>
      </AppBar>
    );
  } else {
    content = (
      <AppBar color="secondary" position="static">
        <Container maxWidth={false}>
          <Toolbar disableGutters>

            <Link to="/main-menu">
              <IconButton aria-label="main-menu" size="large" edge="start" sx={{ mr: 2 }}>
                <HomeIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Link>

            <Box sx={{ flexGrow: 1 }} />

            <NavButton title="Sign in" to="/sign-in" />

            <NavButton title="Sign up" to="/sign-up" />

            <Avatar
              className="grayscale"
              sx={{ mx: 3 }}
              src={unknownUser}
              alt="profile-unknown"
            />

          </Toolbar>
        </Container>
      </AppBar>
    );
  }

  return (
    <div>
      {content}
    </div>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(
  mapStateToProps,
  { loadMainData, getToken },
)(Header);
