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
  UserCredential,
} from 'firebase/auth';
import { AxiosError } from 'axios';
import { instance as axios } from './axios-instance';

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
  email: string,
  password: string,
  displayName: string,
): Promise<UserCredential> => {
  const credentials = await createUserWithEmailAndPassword(auth, email, password);

  if (!auth.currentUser || !credentials.user) {
    throw new Error('No user currently logged in!');
  }

  const token = await auth.currentUser.getIdToken();

  createNewUserData(credentials.user.uid, token);

  localStorage.setItem('user', displayName);

  await updateProfile(credentials.user, {
    displayName,
    photoURL: '',
  });

  return credentials;
};

const signInWithGoogleOrFacebook = async (providerName: 'facebook' | 'google'): Promise<UserCredential> => {
  let provider: GoogleAuthProvider | FacebookAuthProvider;

  if (providerName === 'facebook') {
    provider = facebookProvider;
  } else {
    provider = googleProvider;
  }

  const credentials = await signInWithPopup(auth, provider);

  if (!credentials.user || !auth.currentUser) { // we might not need this
    throw new Error('No user currently logged in!');
  }

  const isNew = getAdditionalUserInfo(credentials)?.isNewUser;
  const token = await auth.currentUser.getIdToken();

  if (isNew) {
    createNewUserData(credentials.user.uid, token);
  }
  return credentials;
};

const signInWithEmailAndPasswordHandler = async (
  email: string,
  password: string,
): Promise<UserCredential> => signInWithEmailAndPassword(auth, email, password);

const linkWithSpecialProvider = async (providerName: 'google' | 'facebook'): Promise<UserCredential> => {
  if (!auth.currentUser) {
    throw new Error('No user currently logged in!');
  }

  let provider: GoogleAuthProvider | FacebookAuthProvider;

  if (providerName === 'facebook') {
    provider = facebookProvider;
  } else {
    provider = googleProvider;
  }

  return linkWithPopup(auth.currentUser, provider);
};

const sendResetEmail = async (email: string): Promise<void> => sendPasswordResetEmail(auth, email);

const handleSignOut = async (): Promise<void> => {
  localStorage.removeItem('user');
  localStorage.removeItem('email');
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  return auth.signOut();
};

const createNewUserData = (userId: string, token: string): void => {
  const startingData = {
    profileData: {
      currentStage: 1,
    },
  };

  axios.put(`/${userId}.json?auth=${token}`, startingData)
    .then(() => { console.log('PUT: new user data created!'); })
    .catch((error: AxiosError) => {
      console.error(`Error creating new user data: ${error}`);
      throw error;
    });
};

export {
  auth, firestore, createUserWithEmailAndPasswordHandler, signInWithGoogleOrFacebook,
  linkWithSpecialProvider, signInWithEmailAndPasswordHandler,
  sendResetEmail, handleSignOut,
};
