import React, { useState } from 'react';
import { signInWithGoogle, signInWithFacebook, createUserWithEmailAndPasswordHandler } from '../../firebase';
import history from '../../history';
import './Authentication.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;

    switch (name) {
      case 'userEmail':
        setEmail(value);
        break;
      case 'userPassword':
        setPassword(value);
        break;
      case 'displayName':
        setDisplayName(value);
        break;
      default:
        break;
    }
  };

  const switchScreen = (event) => {
    let path = '';
    switch (event.target.name) {
      case 'sign-in':
        path = '/signIn';
        break;
      default:
        break;
    }
    history.push(path);
  };

  return (
    <div className="auth-flex-card">
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
        onChange={handleChange}
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
        onChange={handleChange}
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
        onChange={handleChange}
      />
      <form
        id="sign-up-button-form"
        onSubmit={(event) => createUserWithEmailAndPasswordHandler(event, email, password, displayName, setError)}
      >
        <button className="standard-button" type="submit">
          Sign up
        </button>
      </form>
      <p className="auth-p">or</p>
      <div className="two-button-flex">
        <button onClick={(event) => signInWithGoogle(event, setError)} className="standard-button">
          Sign in with Google
        </button>
        <button onClick={signInWithFacebook} className="standard-button">
          Sign in with Facebook
        </button>
      </div>
      <p className="auth-p">Already have an account?</p>
      <button
        name="sign-in"
        id="sing-up-in-redirect"
        className="standard-button"
        onClick={switchScreen}
      >
        Sign in here
      </button>
    </div>
  );
};

export default SignUp;
