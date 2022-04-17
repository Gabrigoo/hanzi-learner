import React, {
  useState, useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase/app';

import { Button, Typography } from '@material-ui/core';

import { linkWithGoogle, handleSignOut } from '../../firebase';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';
import './Authentication.css';

interface ProfilePageProps {
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
        <Typography variant="h4">{props.user.displayName}</Typography>
        <Typography variant="h5">{props.user.email}</Typography>
        {provider === 'password' ? (
          <Button
            variant="contained"
            color="primary"
            onClick={linkWithGoogle}
          >
            Link with Google
          </Button>
        )
          : '' }
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSignOut}
        >
          Sign out
        </Button>
      </div>
    );
  }
  return <div />;
};

const mapStateToProps = (state: ReactFullState) => ({
  user: state.auth.user,
});

export default connect(mapStateToProps)(ProfilePage);
