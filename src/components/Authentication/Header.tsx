import React, {
  useEffect, ReactElement,
} from 'react';
import firebase from 'firebase/app';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import {
  Button,
  IconButton,
  Typography,
  makeStyles,
  Box,
  Avatar,
} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';

import { loadMainData, getToken } from '../../redux/actions';
import { instance as axios } from '../../axios-instance';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';

const useStyles = makeStyles((theme) => ({
  homeIcon: {
    color: 'rgb(61, 49, 49)',
    width: '45px',
    height: '45px',
  },
  profilePic: {
    width: '50px',
    height: '50px',
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(4),
  },
  header: {
    color: 'rgb(61, 49, 49)',
    backgroundColor: 'rgb(241, 200, 124)',
    boxSizing: 'border-box',
  },
  alignRight: {
    marginRight: theme.spacing(3),
    marginLeft: 'auto',
  },
  buttons: {
    textAlign: 'center',
  },
}));

interface HeaderProps {
  isSignedIn: boolean,
  user: firebase.User,
  token: string,
  loadMainData: (source: CancelTokenSource) => any,
  getToken: (userAuth: firebase.User) => any,
}

const Header: React.FC<HeaderProps> = (props): ReactElement => {
  const classes = useStyles();

  useEffect(() => {
    const source = axios.CancelToken.source();

    if (props.user && props.token) {
      props.loadMainData(source);
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
        <Link to="/main-menu">
          <IconButton aria-label="main-menu">
            <HomeIcon className={classes.homeIcon} />
          </IconButton>
        </Link>
        <Typography className={classes.alignRight} variant="h5">
          {props.user.displayName ? props.user.displayName : null}
        </Typography>
        <Typography variant="h5" id="header-email">
          {props.user.email ? props.user.email : null}
        </Typography>
        <Link className="no-underline" to="/user">
          <Avatar className={classes.profilePic} src={photo} alt="profile-picture" />
        </Link>
      </header>
    );
  } else {
    content = (
      <header id="header">
        <Link to="/main-menu">
          <IconButton aria-label="main-menu">
            <HomeIcon className={classes.homeIcon} />
          </IconButton>
        </Link>
        <Link className={`${classes.alignRight} no-underline`} to="/sign-in">
          <Button
            className={classes.buttons}
            variant="outlined"
            size="large"
          >
            Sign in
          </Button>
        </Link>
        <Link className="no-underline" to="/sign-up">
          <Button
            className={classes.buttons}
            variant="outlined"
            size="large"
          >
            Sign up
          </Button>
        </Link>
        <Box className="grayscale">
          <Avatar
            id="header-profilepic"
            className={classes.profilePic}
            src={unknownUser}
            alt="profile-unknown"
          />
        </Box>
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
