import React, {
  useState, ReactElement,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Button,
  Typography,
  TextField,
  Grid,
} from '@mui/material';

import { signInWithGoogle, signInWithFacebook, signInWithEmailAndPasswordHandler } from '../../firebase';
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
    <form
      className="card auth-flex-card"
      onSubmit={(event) => signInClicked(event)}
    >
      <Typography variant="h4">Sign in</Typography>
      <Typography variant="h6" color="error">{error}</Typography>
      <TextField
        type="email"
        label="Email"
        variant="outlined"
        value={email}
        required
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        type="password"
        label="Password"
        variant="outlined"
        value={password}
        required
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
      >
        Sign in
      </Button>
      <Typography>or</Typography>
      <Grid container direction="row" justifyContent="center" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => signInWithGoogleClicked(event)}
          >
            Sign in with Google
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => signInWithFacebookClicked(event)}
          >
            Sign in with Facebook
          </Button>
        </Grid>
      </Grid>
      <Typography>Don&apos;t have an account?</Typography>
      <Link className="no-underline" to="/sign-up">
        <Button
          color="primary"
        >
          Sign up here
        </Button>
      </Link>
      <Link className="no-underline" to="/password-reset">
        <Button
          variant="outlined"
          color="secondary"
        >
          Forgot Password?
        </Button>
      </Link>
    </form>
  );
};

export default SignIn;
