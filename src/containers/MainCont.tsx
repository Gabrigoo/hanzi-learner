import React, {
  ReactElement,
} from 'react';
import { User } from 'firebase/auth';
import { connect } from 'react-redux';

import {
  ReactFullState,
} from '../interfaces';
import Strip from '../components/Strip';
import MainMenu from '../components/MainMenu';

interface ReactProps {
  isSignedIn: boolean,
  user: User,
}

const MainCont: React.FC<ReactProps> = (props): ReactElement => {
  let content;

  if (props.isSignedIn && props.user) {
    content = <MainMenu userId={props.user.uid} />;
  } else if (props.isSignedIn === false) {
    content = <Strip message="Please sign-in or sign-up first" backTrack="/sign-in" timeout={4000} />;
  } else {
    content = <Strip message="Loading..." />;
  }

  return (
    <div>
      {content}
    </div>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  isSignedIn: state.auth.isSignedIn,
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
)(MainCont);
