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

import { signInWithGoogle, signInWithFacebook, createUserWithEmailAndPasswordHandler } from '../../firebase';
import './Authentication.css';

const SignUp = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  return (
    <form
      className="card auth-flex-card"
      onSubmit={
        (event) => {
          createUserWithEmailAndPasswordHandler(event, email, password, displayName, setError);
        }
      }
    >
      <Typography variant="h4">Sign up</Typography>
      <Typography variant="h6" color="error">{error}</Typography>
      <TextField
        type="text"
        label="Username"
        variant="outlined"
        value={displayName}
        required
        onChange={(event) => setDisplayName(event.target.value)}
      />
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
      <Button variant="contained" color="primary" type="submit">
        Sign up
      </Button>
      <Typography>or</Typography>
      <Grid container direction="row" justify="center" spacing={2}>
        <Grid item>
          <Button
            onClick={(event) => signInWithGoogle(event, setError)}
            variant="contained"
            color="primary"
          >
            Sign in with Google
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={signInWithFacebook}
            variant="contained"
            color="primary"
          >
            Sign in with Facebook
          </Button>
        </Grid>
      </Grid>
      <Typography>Already have an account?</Typography>
      <Link className="no-underline" to="/sign-in">
        <Button
          color="primary"
        >
          Sign in here
        </Button>
      </Link>
    </form>
  );
};

export default SignUp;
