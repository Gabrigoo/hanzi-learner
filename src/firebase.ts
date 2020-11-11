import React, { FormEvent, MouseEvent } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { AxiosError } from 'axios';
import { instance as axios } from './axios-instance';
import history from './history';
import handleError from './components/Authentication/HandleAuthError';

const firebaseConfig = {
  apiKey: 'AIzaSyBSdOBDev-GT-SSN_aa6H9IpdpEJBAngao',
  authDomain: 'fir-sample-project-5efcf.firebaseapp.com',
  databaseURL: 'https://fir-sample-project-5efcf.firebaseio.com',
  projectId: 'fir-sample-project-5efcf',
  storageBucket: 'fir-sample-project-5efcf.appspot.com',
  messagingSenderId: '437929269435',
  appId: '1:437929269435:web:a4490ab492a64323ecb19e',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const firestore = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();

const createUserWithEmailAndPasswordHandler = async (
  event: FormEvent<HTMLFormElement>, email: string, password: string, displayName: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
  event.preventDefault();

  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    if (!auth.currentUser || !user) {
      throw new Error('No user currently logged in!');
    }
    const token = await auth.currentUser.getIdToken();

    localStorage.setItem('user', displayName);
    user.updateProfile({
      displayName,
      photoURL: '',
    }).then(() => {
      const newObject = {
        characters: 'α',
        words: 'α',
        profileData: { currentStage: 1 },
      };
      axios.put(`/${user.uid}.json?auth=${token}`, newObject)
        .then(() => { console.log('PUT: new user data created!'); })
        .catch((error: AxiosError) => console.error(`Error uploading new data: ${error}`));
      history.push('/main');
    }).catch((error) => {
      console.error('Error updating profile data: ', error);
      handleError(error, setError);
    });
  } catch (error) {
    console.error('Error signing up with email and password: ', error);
    handleError(error, setError);
  }
};

const signInWithGoogle = async (
  event: MouseEvent<HTMLButtonElement>, setError: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
  event.preventDefault();
  try {
    let userID;
    let isNew = false;
    await auth.signInWithPopup(googleProvider).then((result) => {
      if (!result.user || !result.additionalUserInfo) {
        throw new Error('No user currently logged in!');
      }
      userID = result.user.uid;
      isNew = result.additionalUserInfo.isNewUser;
    });
    if (!auth.currentUser) {
      throw new Error('No user currently logged in!');
    }
    const token = await auth.currentUser.getIdToken();

    if (isNew) {
      const newObject = {
        characters: 'α',
        profileData: { currentStage: 1 },
      };
      axios.put(`/${userID}.json?auth=${token}`, newObject)
        .then(() => { console.log('PUT: new user data created!'); })
        .catch((error: AxiosError) => {
          console.error(`Error creating new user data: ${error}`);
          throw error;
        });
    }
    history.push('/main');
  } catch (error) {
    console.error('Error signing up with google: ', error);
    handleError(error, setError);
  }
};

const signInWithEmailAndPasswordHandler = (
  event: FormEvent<HTMLFormElement>, email: string, password: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
): void => {
  event.preventDefault();

  auth.signInWithEmailAndPassword(email, password).then(() => {
    history.push('/main');
  }).catch((error: AxiosError) => {
    console.error('Error signing in with email and password: ', error);
    handleError(error, setError);
  });
};

const linkWithGoogle = (): void => {
  if (!auth.currentUser) {
    throw new Error('No user currently logged in!');
  }
  auth.currentUser.linkWithPopup(googleProvider).then(() => {
    history.push('/main');
  }).catch((error: AxiosError) => {
    console.log(`Error linking with google: ${error}`);
  });
};
// this is not working yet
const signInWithFacebook = (): void => {
  auth.signInWithPopup(facebookProvider).then(() => {
    history.push('/main');
  }).catch((error: AxiosError) => {
    console.log(error.message);
  });
};

const sendResetEmail = (
  event: FormEvent<HTMLFormElement>,
  email: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
): void => {
  event.preventDefault();

  auth.sendPasswordResetEmail(email).then(() => {
    setEmail('');
    setMessage('An email has been sent to you!');
    setTimeout(() => { setMessage(''); }, 4000);
  }).catch((error: AxiosError) => {
    console.error('Error resetting password:', error);
    handleError(error, setError);
  });
};

const handleSignOut = (): void => {
  localStorage.removeItem('user');
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  history.push('/main');
  auth.signOut();
  console.log('signing out');
};

export {
  auth, firestore, createUserWithEmailAndPasswordHandler, signInWithGoogle,
  linkWithGoogle, signInWithFacebook, signInWithEmailAndPasswordHandler, sendResetEmail,
  handleSignOut,
};
