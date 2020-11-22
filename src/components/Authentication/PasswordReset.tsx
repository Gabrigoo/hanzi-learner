import React, { useState, ChangeEvent, ReactElement } from 'react';
import history from '../../history';
import { sendResetEmail } from '../../firebase';
import './Authentication.css';

const PasswordReset = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string, value: string } = event.currentTarget;

    if (name === 'userEmail') {
      setEmail(value);
    }
  };

  const backToSignIn = () => {
    history.push('/signIn');
  };

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
        onChange={handleChange}
      />
      <form
        id="password-reset-form"
        onSubmit={(event) => sendResetEmail(event, email, setEmail, setMessage, setError)}
      >
        <button className="standard-button large-button" type="submit">Send me a reset link</button>
      </form>
      <button className="standard-button large-button" onClick={backToSignIn}>Back to sign in page</button>
    </div>
  );
};

export default PasswordReset;
