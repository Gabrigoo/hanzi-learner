import React, {
  useState, useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';

import { linkWithGoogle, handleSignOut } from '../../firebase';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';
import './Authentication.css';

interface ProfilePageProps {
  isSignedIn: boolean,
  user: firebase.User,
}

const ProfilePage: React.FC<ProfilePageProps> = (props): ReactElement => {
  const [provider, setProvider] = useState('');

  useEffect(() => {
    if (props.user) {
      if (props.user.providerData[0]?.providerId) {
        setProvider(props.user.providerData[0].providerId);
      }
    }
  }, [props.user]);

  if (props.user) {
    const photo = props.user.photoURL ? props.user.photoURL : unknownUser;

    return (
      <div className="card auth-flex-card">
        <div
          id="profile-image-big"
          style={{
            background: `url(${photo})  no-repeat center center`,
            backgroundSize: 'cover',
          }}
        />
        <h1 className="auth-h1">{props.user.displayName}</h1>
        <h3 className="auth-h3">{props.user.email}</h3>
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
  }
  return <div />;
};

const mapStateToProps = (state: ReactFullState) => ({
  isSignedIn: state.auth.isSignedIn,
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfilePage);
