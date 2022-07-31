import React, { useState, ReactElement } from 'react';

import {
  Button,
  Container,
  Stack,
  Box,
  Typography,
  TextField,
} from '@mui/material';

import { AxiosError } from 'axios';
import { sendResetEmail } from '../../firebase';
import getErrorMessage from './HandleErrorMessage';
import NavButton from '../partials/NavButton';

const PasswordReset = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sendResetEmailClicked = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    sendResetEmail(email).then(() => {
      setEmail('');
      setMessage('An email has been sent to you!');
    }).catch((e: AxiosError) => {
      setError(getErrorMessage(e.code));
    });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 10 }}>
      <form onSubmit={sendResetEmailClicked}>
        <Stack spacing={2}>

          <Typography variant="h4" align="center">Reset your Password</Typography>

          <Typography variant="h6" color="error" align="center">{error}</Typography>

          <Typography variant="h6" color="primary" align="center">{message}</Typography>

          <TextField
            type="email"
            label="Email"
            variant="outlined"
            value={email}
            required
            onChange={(event) => setEmail(event.target.value)}
          />

          <Button variant="contained" type="submit">Send me a reset link</Button>

          <Box display="flex" justifyContent="center">
            <NavButton title="Back to sign in page" to="/sign-in" variant="outlined" />
          </Box>

        </Stack>
      </form>
    </Container>
  );
};

export default PasswordReset;
