import React, {
  useEffect, ReactElement,
} from 'react';
import { User } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import {
  Button,
  IconButton,
  Typography,
  Avatar,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';

import { loadMainData, getToken } from '../../redux/actions';
import { instance as axios } from '../../axios-instance';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';

interface HeaderProps {
  user: User,
  token: string,
  loadMainData: (source: CancelTokenSource) => any,
  getToken: (userAuth: User) => any,
}

const Header: React.FC<HeaderProps> = (props): ReactElement => {
  const theme = useTheme();

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
            <HomeIcon sx={{ color: 'rgb(61, 49, 49)', width: '45px', height: '45px' }} />
          </IconButton>
        </Link>
        <Typography sx={{ marginRight: theme.spacing(3), marginLeft: 'auto' }} variant="h5">
          {props.user.displayName ? props.user.displayName : null}
        </Typography>
        <Typography variant="h5" id="header-email">
          {props.user.email ? props.user.email : null}
        </Typography>
        <Link className="no-underline" to="/user">
          <Avatar
            sx={{
              width: '50px', height: '50px', marginLeft: theme.spacing(3), marginRight: theme.spacing(4),
            }}
            src={photo}
            alt="profile-picture"
          />
        </Link>
      </header>
    );
  } else {
    content = (
      <header id="header">
        <Link to="/main-menu">
          <IconButton aria-label="main-menu">
            <HomeIcon sx={{ color: 'rgb(61, 49, 49)', width: '45px', height: '45px' }} />
          </IconButton>
        </Link>
        <Link className="no-underline" to="/sign-in">
          <Button
            sx={{ textAlign: 'center', marginRight: theme.spacing(3), marginLeft: 'auto' }}
            variant="outlined"
            size="large"
          >
            Sign in
          </Button>
        </Link>
        <Link className="no-underline" to="/sign-up">
          <Button
            sx={{ textAlign: 'center' }}
            variant="outlined"
            size="large"
          >
            Sign up
          </Button>
        </Link>
        <div className="grayscale">
          <Avatar
            id="header-profilepic"
            sx={{
              width: '50px', height: '50px', marginLeft: theme.spacing(3), marginRight: theme.spacing(4),
            }}
            src={unknownUser}
            alt="profile-unknown"
          />
        </div>
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
  user: state.auth.user,
  token: state.auth.token,
});

export default connect(
  mapStateToProps,
  { loadMainData, getToken },
)(Header);
