import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import history from './history';

const firebaseConfig = {
    apiKey: "AIzaSyBSdOBDev-GT-SSN_aa6H9IpdpEJBAngao",
    authDomain: "fir-sample-project-5efcf.firebaseapp.com",
    databaseURL: "https://fir-sample-project-5efcf.firebaseio.com",
    projectId: "fir-sample-project-5efcf",
    storageBucket: "fir-sample-project-5efcf.appspot.com",
    messagingSenderId: "437929269435",
    appId: "1:437929269435:web:a4490ab492a64323ecb19e"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();
const facebookProvider = new firebase.auth.FacebookAuthProvider();

export const signInWithGoogle = () => {
    auth.signInWithPopup(googleProvider).then(() => {
        history.push(`/main`);
    }).catch((error) => {
        console.error("Error when signing is with google: " + error)
    });
}

export const linkWithGoogle = () => {
    auth.currentUser.linkWithPopup(googleProvider).then(() => {
        history.push(`/main`);
    }).catch((error) => {
        console.log("Error linking with google: " + error)
    });
}
//this is not working yet
export const signInWithFacebook = () => {
    auth.signInWithPopup(facebookProvider).then(function(result) {
        history.push(`/main`);
    }).catch(function(error) {
        console.log(error.message)
    });
}