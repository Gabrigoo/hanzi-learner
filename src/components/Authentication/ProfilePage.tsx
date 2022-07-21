import React, {
  useState, useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { User } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

import { Button, Typography, Grid } from '@material-ui/core';

import { linkWithGoogle, linkWithFacebook, handleSignOut } from '../../firebase';
import { ReactFullState } from '../../interfaces';
import unknownUser from '../../assets/unknown-user.png';
import './Authentication.css';

interface ProfilePageProps {
  user: User,
}

const ProfilePage: React.FC<ProfilePageProps> = (props): ReactElement => {
  const [provider, setProvider] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    if (props.user) {
      if (props.user.providerData[0]?.providerId) {
        setProvider(props.user.providerData[0].providerId);
      }
    }
  }, [props.user]);

  const signOutClicked = () => {
    handleSignOut().then(() => {
      navigate('/main');
    });
  };

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
          <Grid container direction="row" justifyContent="center" spacing={2}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={linkWithGoogle}
              >
                Link with Google
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={linkWithFacebook}
              >
                Link with Facebook
              </Button>
            </Grid>
          </Grid>
        )
          : '' }
        <Button
          variant="contained"
          color="secondary"
          onClick={signOutClicked}
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
