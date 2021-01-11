import React, {
  useState, ReactElement,
} from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Typography,
  TextField,
  Grid,
} from '@material-ui/core';

import { signInWithGoogle, signInWithFacebook, signInWithEmailAndPasswordHandler } from '../../firebase';
import './Authentication.css';

const SignIn = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <form
      className="card auth-flex-card"
      onSubmit={(event) => signInWithEmailAndPasswordHandler(event, email, password, setError)}
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
      <Grid container direction="row" justify="center" spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={(event) => signInWithGoogle(event, setError)}
          >
            Sign in with Google
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            onClick={signInWithFacebook}
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
