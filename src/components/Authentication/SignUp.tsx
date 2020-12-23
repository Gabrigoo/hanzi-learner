import React, {
  useState, ReactElement,
} from 'react';
import { Link } from 'react-router-dom';

import { signInWithGoogle, signInWithFacebook, createUserWithEmailAndPasswordHandler } from '../../firebase';
import './Authentication.css';

const SignUp = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="card auth-flex-card">
      <h1 className="auth-h1">Sign up</h1>
      <div id="auth-error">{error}</div>
      <label htmlFor="displayName">Display Name:</label>
      <input
        type="text"
        name="displayName"
        value={displayName}
        placeholder="E.g: Johnathan"
        id="displayname"
        className="auth-input"
        onChange={(event) => setDisplayName(event.target.value)}
      />
      <label htmlFor="userEmail">Email:</label>
      <input
        type="email"
        name="userEmail"
        form="sign-up-button-form"
        value={email}
        placeholder="E.g: ilearnchinese@gmail.com"
        id="userEmail"
        className="auth-input"
        onChange={(event) => setEmail(event.target.value)}
      />
      <label htmlFor="userPassword">Password:</label>
      <input
        type="password"
        name="userPassword"
        form="sign-up-button-form"
        value={password}
        placeholder="Your password"
        id="userPassword"
        className="auth-input"
        onChange={(event) => setPassword(event.target.value)}
      />
      <form
        id="sign-up-button-form"
        onSubmit={
          (event) => {
            createUserWithEmailAndPasswordHandler(event, email, password, displayName, setError);
          }
        }
      >
        <button className="standard-button" type="submit">
          Sign up
        </button>
      </form>
      <p className="auth-p">or</p>
      <div className="two-button-flex">
        <button
          onClick={(event) => signInWithGoogle(event, setError)}
          className="standard-button large-button"
        >
          Sign in with Google
        </button>
        <button onClick={signInWithFacebook} className="standard-button large-button">
          Sign in with Facebook
        </button>
      </div>
      <p className="auth-p">Already have an account?</p>
      <Link
        to="/sign-in"
        id="sing-up-in-redirect"
        className="standard-button"
      >
        Sign in here
      </Link>
    </div>
  );
};

export default SignUp;
