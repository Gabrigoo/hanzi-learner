import React, {
  useState, ReactElement,
} from 'react';
import { Link } from 'react-router-dom';

import { signInWithGoogle, signInWithFacebook, signInWithEmailAndPasswordHandler } from '../../firebase';
import './Authentication.css';

const SignIn = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <div className="card auth-flex-card">
      <h1 className="auth-h1">Sign in</h1>
      <div id="auth-error">{error}</div>
      <label htmlFor="userEmail">Email:</label>
      <input
        type="email"
        name="userEmail"
        form="sign-in-button-form"
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
        form="sign-in-button-form"
        value={password}
        placeholder="Your password"
        id="userPassword"
        className="auth-input"
        onChange={(event) => setPassword(event.target.value)}
      />
      <form
        id="sign-in-button-form"
        onSubmit={(event) => signInWithEmailAndPasswordHandler(event, email, password, setError)}
      >
        <button className="standard-button" type="submit">
          Sign in
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
      <p className="auth-p">Don&apos;t have an account?</p>
      <Link
        to="/sign-up"
        id="sing-up-in-redirect"
        className="standard-button"
      >
        Sign up here
      </Link>
      <Link
        to="password-reset"
        id="password-reset-button"
        className="standard-button large-button"
      >
        Forgot Password?
      </Link>
    </div>
  );
};

export default SignIn;
