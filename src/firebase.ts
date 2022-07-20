import React, { FormEvent, MouseEvent } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  updateProfile,
  FacebookAuthProvider,
  getAdditionalUserInfo,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { AxiosError } from 'axios';
import { instance as axios } from './axios-instance';
import handleError from './components/authentication/HandleAuthError';

const firebaseConfig = {
  apiKey: 'AIzaSyA3HHg0BjsZ3xck-zB1Sm02fLOerr0JeP4',
  authDomain: 'hanzi-learner-466ac.firebaseapp.com',
  databaseURL: 'https://hanzi-learner-466ac-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'hanzi-learner-466ac',
  storageBucket: 'hanzi-learner-466ac.appspot.com',
  messagingSenderId: '312627980272',
  appId: '1:312627980272:web:08f4978778618992d7df35',
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();
const firestore = getFirestore(app);

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const createUserWithEmailAndPasswordHandler = async (
  event: FormEvent<HTMLFormElement>,
  email: string,
  password: string,
  displayName: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
  event.preventDefault();

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (!auth.currentUser || !user) {
      throw new Error('No user currently logged in!');
    }
    const token = await auth.currentUser.getIdToken();

    localStorage.setItem('user', displayName);
    updateProfile(user, {
      displayName,
      photoURL: '',
    }).then(() => {
      const newObject = {
        profileData: {
          currentStage: 1,
        },
      };
      axios.put(`/${user.uid}.json?auth=${token}`, newObject)
        .then(() => { console.log('PUT: new user data created!'); })
        .catch((error: AxiosError) => console.error(`Error uploading new data: ${error}`));
    }).catch((error: Error) => {
      console.error('Error updating profile data: ', error);
      handleError(error, setError);
    });
  } catch (error) {
    console.error('Error signing up with email and password: ', error);
    handleError(error, setError);
  }
};

const signInWithGoogle = async (
  event: MouseEvent<HTMLButtonElement>,
  setError: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
  event.preventDefault();
  try {
    let userID;
    let isNew = false;
    await signInWithPopup(auth, googleProvider).then(async (result) => {
      if (!result.user) {
        throw new Error('No user currently logged in!');
      }
      userID = result.user.uid;
      isNew = await getAdditionalUserInfo(result)?.isNewUser || false;
    });

    if (!auth.currentUser) {
      throw new Error('No user currently logged in!');
    }

    const token = await auth.currentUser.getIdToken();

    if (isNew) {
      const newObject = {
        profileData: {
          currentStage: 1,
        },
      };

      axios.put(`/${userID}.json?auth=${token}`, newObject)
        .then(() => { console.log('PUT: new user data created!'); })
        .catch((error: AxiosError) => {
          console.error(`Error creating new user data: ${error}`);
          throw error;
        });
    }
  } catch (error) {
    console.error('Error signing up with google: ', error);
    handleError(error, setError);
  }
};

const signInWithEmailAndPasswordHandler = async (
  event: FormEvent<HTMLFormElement>,
  email: string,
  password: string,
  setError: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
  event.preventDefault();

  signInWithEmailAndPassword(auth, email, password).catch((error: AxiosError) => {
    console.error('Error signing in with email and password: ', error);
    handleError(error, setError);
  });
};

const linkWithGoogle = (): void => {
  if (!auth.currentUser) {
    throw new Error('No user currently logged in!');
  }
  linkWithPopup(auth.currentUser, googleProvider).catch((error: AxiosError) => {
    console.log(`Error linking with google: ${error}`);
  });
};

const signInWithFacebook = (): void => {
  signInWithPopup(auth, facebookProvider).then(() => {
    // not implemented yet
  }).catch((error: AxiosError) => {
    console.log(error.message);
  });
};

const sendResetEmail = async (
  event: FormEvent<HTMLFormElement>,
  email: string,
  setEmail: React.Dispatch<React.SetStateAction<string>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
): Promise<void> => {
  event.preventDefault();

  sendPasswordResetEmail(auth, email).then(() => {
    setEmail('');
    setMessage('An email has been sent to you!');
    setTimeout(() => { setMessage(''); }, 4000);
  }).catch((error: AxiosError) => {
    console.error('Error resetting password:', error);
    handleError(error, setError);
  });
};

const handleSignOut = async (): Promise<void> => {
  localStorage.removeItem('user');
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  auth.signOut();
  console.log('signing out');
};

export {
  auth, firestore, createUserWithEmailAndPasswordHandler, signInWithGoogle,
  linkWithGoogle, signInWithFacebook, signInWithEmailAndPasswordHandler, sendResetEmail,
  handleSignOut,
};
