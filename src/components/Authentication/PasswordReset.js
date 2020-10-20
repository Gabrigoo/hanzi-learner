import React, { useState } from "react";
import history from '../../history';
import { auth } from "../../firebase";
import './Authentication.css';
import handleError from "./HandleAuthError";


const PasswordReset = () => {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);

  const handleChange = (event) => {
      const { name, value } = event.currentTarget;

      if (name === "userEmail") {
          setEmail(value);
      }
  };

  const sendResetEmail = (event) => {
      event.preventDefault();

      auth.sendPasswordResetEmail(email).then(() => {
          setEmail("");
          setMessage('An email has been sent to you!');
          setTimeout(() => {setMessage("")}, 4000);
      }).catch((error) => {
          console.error('Error resetting password:', error);
          handleError(error, setError);
      });
  };

  const backToSignIn = () => {
      history.push(`/signIn`)
  }

  return (
    <div className="auth-flex-card">
      <h1 className="auth-h1">Reset your Password</h1>
      {error ?
        <div id="auth-error">{error}</div> :
          <div id="auth-message">{message}</div>}
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
      <form id="password-reset-form" onSubmit={sendResetEmail}>
          <button className="standard-button" type="submit">Send me a reset link</button>
      </form>
      <button className="standard-button" onClick={backToSignIn}>Back to sign in page</button>
    </div>
  );
};

export default PasswordReset;