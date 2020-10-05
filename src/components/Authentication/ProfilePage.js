import React, { useContext, useState, useEffect } from "react";
import { UserContext } from '../providers/UserProvider';
import { auth, linkWithGoogle } from '../../firebase';
import history from '../../history';
import unknownUser from '../../assets/unknown-user.png';
import './Authentication.css';


const ProfilePage = () => {
    
    const currentUser = useContext(UserContext);

    const [provider, setProvider] = useState(null);
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [photo, setPhoto] = useState(localStorage.getItem('photo'));

    useEffect( () => {
      if (currentUser) {
        setProvider(currentUser.providerData[0].providerId);
        setUser(localStorage.getItem('user'));
        setEmail(localStorage.getItem('email'));
        setPhoto(localStorage.getItem('photo'));
      } else {
        handleSignOut();
      }
    }, [currentUser])

    const handleSignOut = () => {
      localStorage.removeItem('user');
      localStorage.removeItem('email');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      history.push(`/main`);
      auth.signOut();
      console.log('signing out')
    }

    let photoURL = null;
    if (photo === "null") {
        photoURL = unknownUser;
    } else {
        photoURL = photo;
    }

    return (
        <div className="auth-flex-card">
              <div
                  id="profile-image-big"
                  style={{
                      background:
                          `url(${photoURL})  no-repeat center center`,
                      backgroundSize: "cover",
                  }}
              ></div>
              <h1 className = "auth-h1">{user}</h1>
              <h3 className = "auth-h3">{email}</h3>
              {provider === "password" ?
                  <button 
                      className = "auth-button"
                      onClick= {linkWithGoogle}
                      >Link with Google
                  </button> : 
                  "" }
              <button 
                  className = "auth-button"
                  onClick= {handleSignOut}
                  >Sign out
              </button>
        </div>
    ) 
};

export default ProfilePage;