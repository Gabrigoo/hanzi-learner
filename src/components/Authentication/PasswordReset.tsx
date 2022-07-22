import React, { useState, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Typography,
  TextField,
} from '@mui/material';

import { sendResetEmail } from '../../firebase';
import './Authentication.css';

const PasswordReset = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <form
      className="card auth-flex-card"
      onSubmit={(event) => sendResetEmail(event, email, setEmail, setMessage, setError)}
    >
      <Typography variant="h4">Reset your Password</Typography>
      <Typography variant="h6" color="error">
        {error}
      </Typography>
      <Typography variant="h6" color="primary">
        {message}
      </Typography>
      <TextField
        type="email"
        label="Email"
        variant="outlined"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <Button variant="contained" color="primary" type="submit">Send me a reset link</Button>
      <Link className="no-underline" to="/sign-in">
        <Button variant="outlined" color="primary">Back to sign in page</Button>
      </Link>
    </form>
  );
};

export default PasswordReset;
