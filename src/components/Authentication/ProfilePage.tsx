import React, {
  useEffect, useState, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

import {
  Button,
  Container,
  Box,
  Grid,
  Stack,
  Avatar,
  Typography,
  Tooltip,
  Divider,
} from '@mui/material';
import PasswordIcon from '@mui/icons-material/Password';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';

import { AxiosError, CancelTokenSource } from 'axios';
import { instance as axios } from '../../axios-instance';
import {
  UserInt, ReactFullState,
} from '../../interfaces';
import {
  loadUserData,
} from '../../redux/actions';
import { linkWithSpecialProvider, handleSignOut } from '../../firebase';
import getErrorMessage from './HandleErrorMessage';
import unknownUser from '../../assets/unknown-user.png';
import './Authentication.css';

interface ReactProps {
  user: User,
  token: string,
  userData: UserInt,
  loadUserData: (source: CancelTokenSource) => void,
}

const ProfilePage: React.FC<ReactProps> = (props): ReactElement => {
  const photo = props.user?.photoURL || unknownUser;
  const providers = props.user?.providerData || [];

  const hasPassword = providers.some((e) => e.providerId === 'password');
  const hasGoogle = providers.some((e) => e.providerId === 'google.com');
  const hasFacebook = providers.some((e) => e.providerId === 'facebook.com');

  const [error, setError] = useState('');

  const navigate = useNavigate();

  // Loading user data
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (!props.userData && props.token) {
      props.loadUserData(source);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [props.userData, props.token]);

  const countBurnedCharacters = (): number => Object.keys(props.userData.characters)
    .filter((char: string) => props.userData.characters[char].level === 9).length;

  const countBurnedWords = (): number => Object.keys(props.userData.words)
    .filter((word: string) => props.userData.words[word].level === 9).length;

  const getFormattedDate = (): string => {
    if (props.user?.metadata.creationTime) {
      return format(new Date(props.user.metadata.creationTime), 'yyyy MMMM dd');
    }
    return '';
  };

  const signOutClicked = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    handleSignOut().then(() => {
      navigate('/sign-in');
    }).catch((e: AxiosError) => {
      setError(getErrorMessage(e.code));
    });
  };

  const linkWithProviderClicked = (event: React.MouseEvent<HTMLButtonElement>, provider: 'google' | 'facebook') => {
    event.preventDefault();

    linkWithSpecialProvider(provider).catch((e: AxiosError) => {
      setError(getErrorMessage(e.code));
    });
  };

  return (props.userData
    ? (
      <Grid container spacing={2} sx={{ height: '100%', mt: '0px' }}>
        <Grid item xs={5}>
          <Container maxWidth="xs" sx={{ mt: 6 }}>
            <Stack spacing={4}>

              <Avatar
                variant="rounded"
                sx={{ height: '200px', width: '200px', mx: 'auto' }}
                src={photo}
                alt="profile-picture"
              />

              <Typography variant="h4" align="center">{props.user?.displayName}</Typography>

              <Typography variant="h5" align="center">{props.user?.email}</Typography>

              <Typography variant="h5" align="center">
                User level:
                {' '}
                {props.userData?.profileData.currentStage}
              </Typography>

              <Typography variant="h5" align="center">
                Login methods:
                {hasPassword ? (
                  <Tooltip title="Password" sx={{ ml: '10px' }}>
                    <PasswordIcon />
                  </Tooltip>
                ) : null}
                {hasGoogle ? (
                  <Tooltip title="Google" sx={{ ml: '10px' }}>
                    <GoogleIcon />
                  </Tooltip>
                ) : null}
                {hasFacebook ? (
                  <Tooltip title="Facebook" sx={{ ml: '10px' }}>
                    <FacebookIcon />
                  </Tooltip>
                ) : null}
              </Typography>

              {hasPassword && !hasGoogle
                ? (
                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(event) => linkWithProviderClicked(event, 'google')}
                    >
                      Link with Google
                    </Button>
                  </Box>
                ) : null}

              {hasPassword && !hasFacebook
                ? (
                  <Box textAlign="center">
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={(event) => linkWithProviderClicked(event, 'facebook')}
                    >
                      Link with Facebook
                    </Button>
                  </Box>
                ) : null}

              {error ? <Typography variant="h6" align="center" color="error">{error}</Typography> : null}

              <Box textAlign="center">
                <Button
                  size="large"
                  variant="contained"
                  color="warning"
                  onClick={signOutClicked}
                >
                  Sign out
                </Button>
              </Box>

            </Stack>
          </Container>
        </Grid>

        <Divider orientation="vertical" flexItem sx={{ ml: '-40px', mr: '20px' }} />

        <Grid item xs={6}>
          <Container maxWidth="md" sx={{ mt: 10 }}>
            <Stack spacing={3}>

              <Typography variant="h5">
                {`Joined: ${getFormattedDate()}`}
              </Typography>

              <Typography variant="h5">
                {`Characters learned: ${Object.keys(props.userData?.characters).length}`}
              </Typography>

              <Typography variant="h5">
                {`Characters burned: ${countBurnedCharacters()}`}
              </Typography>

              <Typography variant="h5">
                {`Words learned: ${Object.keys(props.userData?.words).length}`}
              </Typography>

              <Typography variant="h5">
                {`Words burned: ${countBurnedWords()}`}
              </Typography>
            </Stack>
          </Container>
        </Grid>
      </Grid>
    )
    : <div />);
};

const mapStateToProps = (state: ReactFullState) => ({
  user: state.auth.user,
  token: state.auth.token,
  userData: state.data.userData,
});

export default connect(
  mapStateToProps,
  { loadUserData },
)(ProfilePage);
