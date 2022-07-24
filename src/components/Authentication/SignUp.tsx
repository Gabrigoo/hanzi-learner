import React, {
  useState, ReactElement,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Typography,
  TextField,
  ButtonGroup,
  Stack,
  Box,
  Container,
} from '@mui/material';

import { AxiosError } from 'axios';
import { signInWithGoogleOrFacebook, createUserWithEmailAndPasswordHandler } from '../../firebase';
import getErrorMessage from './HandleErrorMessage';
import NavButton from '../partials/NavButton';
import './Authentication.css';

const SignUp = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const signUpClicked = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    createUserWithEmailAndPasswordHandler(email, password, displayName).then((res) => {
      console.log(res);
      navigate('/main');
    }).catch((e: AxiosError) => {
      setError(getErrorMessage(e.code));
    });
  };

  const signInWithProviderClicked = (event: React.MouseEvent<HTMLButtonElement>, provider: 'google' | 'facebook') => {
    event.preventDefault();

    signInWithGoogleOrFacebook(provider).then(() => {
      navigate('/main');
    }).catch((e: AxiosError) => {
      setError(getErrorMessage(e.code));
    });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <form onSubmit={signUpClicked}>
        <Stack spacing={2}>

          <Typography variant="h4" align="center">Sign up</Typography>

          <Typography variant="h6" align="center" color="error">{error}</Typography>

          <TextField
            type="text"
            label="Username"
            variant="filled"
            value={displayName}
            required
            onChange={(event) => setDisplayName(event.target.value)}
          />

          <TextField
            type="email"
            label="Email"
            variant="filled"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />

          <TextField
            type="password"
            label="Password"
            variant="filled"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />

          <Button
            variant="contained"
            type="submit"
          >
            Sign up
          </Button>

          <Typography align="center">or sign in with</Typography>

          <ButtonGroup variant="contained" color="secondary" aria-label="outlined primary button group" fullWidth>
            <Button onClick={(event) => signInWithProviderClicked(event, 'google')}>
              Google
            </Button>
            <Button onClick={(event) => signInWithProviderClicked(event, 'facebook')}>
              Facebook
            </Button>
          </ButtonGroup>

          <Typography align="center">Already have an account?</Typography>

          <Box display="flex" justifyContent="center">
            <NavButton title="Sign in here" to="/sign-in" variant="outlined" />
          </Box>

        </Stack>
      </form>
    </Container>
  );
};

export default SignUp;
