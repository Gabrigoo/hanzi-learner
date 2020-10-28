import React, { useState } from 'react';
import history from '../../history';
import { sendResetEmail } from '../../firebase';
import './Authentication.css';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    }
  };

  const backToSignIn = () => {
    history.push('/signIn');
  };

  return (
    <div className="auth-flex-card">
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
        onChange={handleChange}
      />
      <form id="password-reset-form" onSubmit={(event) => sendResetEmail(event, email, setEmail, setMessage, setError)}>
        <button className="standard-button" type="submit">Send me a reset link</button>
      </form>
      <button className="standard-button" onClick={backToSignIn}>Back to sign in page</button>
    </div>
  );
};

export default PasswordReset;
