import React, {
  useState, ReactElement,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonGroup,
  Typography,
  TextField,
  Box,
  Stack,
  Container,
} from '@mui/material';

import { signInWithGoogle, signInWithFacebook, signInWithEmailAndPasswordHandler } from '../../firebase';
import NavButton from '../partials/NavButton';
import './Authentication.css';

const SignIn = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const signInClicked = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    signInWithEmailAndPasswordHandler(email, password, setError).then(() => {
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
      <form onSubmit={(event) => signInClicked(event)}>
        <Stack spacing={2}>

          <Typography variant="h4" align="center">Sign in</Typography>

          <Typography variant="h6" align="center" color="error">{error}</Typography>

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
            Sign in
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

          <Typography align="center">Don&apos;t have an account?</Typography>

          <Box display="flex" justifyContent="center">
            <NavButton title="Sign up here" to="/sign-up" variant="outlined" />
          </Box>

          <Box display="flex" justifyContent="center">
            <NavButton title="Forgot Password?" to="/password-reset" variant="outlined" color="secondary" />
          </Box>

        </Stack>
      </form>
    </Container>
  );
};

export default SignIn;
