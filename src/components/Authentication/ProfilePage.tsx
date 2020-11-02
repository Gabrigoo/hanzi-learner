import React, {
  useContext, useState, useEffect, ReactElement,
} from 'react';
import { UserContext } from '../providers/UserProvider';
import { linkWithGoogle, handleSignOut } from '../../firebase';
import unknownUser from '../../assets/unknown-user.png';
import './Authentication.css';

const ProfilePage = (): ReactElement => {
  const currentUser = useContext<any>(UserContext);

  const [provider, setProvider] = useState(null);
  const [user, setUser] = useState(localStorage.getItem('user'));
  const [email, setEmail] = useState(localStorage.getItem('email'));
  const [photo, setPhoto] = useState(localStorage.getItem('photo'));

  useEffect(() => {
    if (currentUser) {
      setProvider(currentUser.providerData[0].providerId);
      setUser(localStorage.getItem('user'));
      setEmail(localStorage.getItem('email'));
      setPhoto(localStorage.getItem('photo'));
    } else {
      handleSignOut();
    }
  }, [currentUser]);

  let photoURL = null;
  if (photo === 'null') {
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
          backgroundSize: 'cover',
        }}
      />
      <h1 className="auth-h1">{user}</h1>
      <h3 className="auth-h3">{email}</h3>
      {provider === 'password' ? (
        <button
          className="standard-button"
          onClick={linkWithGoogle}
        >
          Link with Google
        </button>
      )
        : '' }
      <button
        className="standard-button"
        onClick={handleSignOut}
      >
        Sign out
      </button>
    </div>
  );
};

export default ProfilePage;
