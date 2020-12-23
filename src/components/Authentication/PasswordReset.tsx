import React, { useState, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { sendResetEmail } from '../../firebase';
import './Authentication.css';

const PasswordReset = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="card">
      <h1 className="auth-h1">Reset your Password</h1>
      {error
        ? <div id="auth-error">{error}</div>
        : <div id="auth-message">{message}</div>}
      <label htmlFor="userEmail">Email:</label>
      <input
        type="email"
        name="userEmail"
        form="password-reset-form"
        id="userEmail"
        className="auth-input"
        value={email}
        placeholder="Input your email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <form
        id="password-reset-form"
        onSubmit={(event) => sendResetEmail(event, email, setEmail, setMessage, setError)}
      >
        <button className="standard-button large-button" type="submit">Send me a reset link</button>
      </form>
      <Link to="/sign-in" className="standard-button large-button">Back to sign in page</Link>
    </div>
  );
};

export default PasswordReset;
