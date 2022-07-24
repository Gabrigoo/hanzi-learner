import React, {
  useState, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
  Container,
  Box,
  Stack,
  Avatar,
  Typography,
} from '@mui/material';

import { AxiosError } from 'axios';
import { linkWithSpecialProvider, handleSignOut } from '../../firebase';
import { ReactFullState } from '../../interfaces';
import getErrorMessage from './HandleErrorMessage';
import unknownUser from '../../assets/unknown-user.png';
import './Authentication.css';

interface ProfilePageProps {
  user: User,
}

const ProfilePage: React.FC<ProfilePageProps> = (props): ReactElement => {
  const photo = props.user?.photoURL || unknownUser;

  const [error, setError] = useState('');

  const navigate = useNavigate();

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

  return (
    <Container maxWidth="xs" sx={{ mt: 12 }}>
      <Stack spacing={3}>

        <Avatar
          variant="rounded"
          sx={{ height: '200px', width: '200px', mx: 'auto' }}
          src={photo}
          alt="profile-picture"
        />

        <Typography variant="h4" align="center">{props.user?.displayName}</Typography>

        <Typography variant="h5" align="center">{props.user?.email}</Typography>

        <ButtonGroup variant="contained" color="secondary" aria-label="outlined primary button group" fullWidth>
          <Button onClick={(event) => linkWithProviderClicked(event, 'google')}>
            Link with Google
          </Button>
          <Button onClick={(event) => linkWithProviderClicked(event, 'facebook')}>
            Link with Facebook
          </Button>
        </ButtonGroup>

        <Typography variant="h6" align="center" color="error">{error}</Typography>

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
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfilePage);
