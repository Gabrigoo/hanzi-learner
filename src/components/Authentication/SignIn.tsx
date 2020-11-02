import React, {
  useState, ChangeEvent, MouseEvent, ReactElement,
} from 'react';
import { signInWithGoogle, signInWithFacebook, signInWithEmailAndPasswordHandler } from '../../firebase';
import history from '../../history';
import './Authentication.css';

const SignIn = (): ReactElement => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string, value: string } = event.currentTarget;

    switch (name) {
      case 'userEmail':
        setEmail(value);
        break;
      case 'userPassword':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const switchScreen = (event: MouseEvent<HTMLButtonElement>) => {
    let path = '';
    switch (event.currentTarget.name) {
      case 'password-reset':
        path = '/passwordReset';
        break;
      case 'sign-up':
        path = '/signUp';
        break;
      default:
        break;
    }
    history.push(path);
  };

  return (
    <div className="auth-flex-card">
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
        onChange={handleChange}
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
        onChange={handleChange}
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
        <button onClick={(event) => signInWithGoogle(event, setError)} className="standard-button">
          Sign in with Google
        </button>
        <button onClick={signInWithFacebook} className="standard-button">
          Sign in with Facebook
        </button>
      </div>
      <p className="auth-p">Don&apos;t have an account?</p>
      <button
        name="sign-up"
        id="sing-up-in-redirect"
        className="standard-button"
        onClick={switchScreen}
      >
        Sign up here
      </button>
      <button
        name="password-reset"
        id="password-reset-button"
        className="standard-button"
        onClick={switchScreen}
      >
        Forgot Password?
      </button>
    </div>
  );
};

export default SignIn;
