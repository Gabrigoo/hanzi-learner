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

import { signInWithGoogle, signInWithFacebook, createUserWithEmailAndPasswordHandler } from '../../firebase';
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
    createUserWithEmailAndPasswordHandler(
      email,
      password,
      displayName,
      setError,
    ).then(() => {
      navigate('/main');
    });
  };

  const signInWithGoogleClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signInWithGoogle(setError).then(() => {
      navigate('/main');
    });
  };

  const signInWithFacebookClicked = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    signInWithFacebook(setError).then(() => {
      navigate('/main');
    });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <form onSubmit={(event) => { signUpClicked(event); }}>
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

          <ButtonGroup variant="contained" aria-label="outlined primary button group" fullWidth>
            <Button color="secondary" onClick={(event) => signInWithGoogleClicked(event)}>
              Google
            </Button>
            <Button color="secondary" onClick={(event) => signInWithFacebookClicked(event)}>
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
