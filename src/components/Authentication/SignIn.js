import React, { useState } from 'react';
import { auth, signInWithGoogle, signInWithFacebook } from '../../firebase';
import history from '../../history';
import './Authentication.css';


const SignIn = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleChange = (event) => {
        const {name, value} = event.currentTarget;

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

    const switchScreen = (event) => {
        let path = ``;
        switch (event.target.name) {
            case "password-reset":
                path = `/passwordReset`;
                break;
            case "sign-up":
                path = `/signUp`;
                break;
            default:
                break;
        }
        history.push(path);
    }

    const handleError = (error) => {
        switch (error.code) {
            case "auth/user-not-found":
                setError('User not registered');
                break;
            case "auth/wrong-password":
                setError('Password is incorrect');
                break;
            case "auth/invalid-email":
                setError('Invalid e-mail format');
                break;
            default:
                setError('Unhandled error');
                break;
        }
        setTimeout(() => {setError(null)}, 5000)
    }

    const signInWithEmailAndPasswordHandler = (event, email, password) => {
        event.preventDefault();
        
        auth.signInWithEmailAndPassword(email, password).then(() => {
            history.push(`/main`)
        }).catch( (error) => {
            console.error("Error signing in with email and password: ", error);
            handleError(error);
        });
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
                onChange= {handleChange} />
            <label htmlFor="userPassword">Password:</label>
            <input 
                type="password"
                name="userPassword" 
                form="sign-in-button-form"
                value={password}
                placeholder="Your password"
                id="userPassword"
                className="auth-input"
                onChange= {handleChange} />
            <form 
                id="sign-in-button-form" 
                onSubmit= { (event) => signInWithEmailAndPasswordHandler(event, email, password)}> 
                <button className="auth-button" type="submit">
                    Sign in
                </button>
            </form>
            <p className="auth-p">or</p>
            <div className="two-button-flex">
                <button onClick={signInWithGoogle} className="auth-button">
                    Sign in with Google
                </button>
                <button onClick={signInWithFacebook} className="auth-button">
                    Sign in with Facebook
                </button>
            </div>
            <p className="auth-p">Don't have an account?</p>
            <button
                name="sign-up" 
                id="sing-up-in-redirect"
                className="auth-button"
                onClick={switchScreen}
                >Sign up here
            </button>
            <button
                name="password-reset" 
                id="password-reset-button" 
                className="auth-button" 
                onClick={switchScreen}
                >Forgot Password?
            </button>
        </div>
    );
  };
  
  export default SignIn;