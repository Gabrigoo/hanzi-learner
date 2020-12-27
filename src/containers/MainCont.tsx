import React, {
  ReactElement,
} from 'react';
import { connect } from 'react-redux';

import {
  ReactFullState,
} from '../interfaces';
import Strip from '../components/Strip';
import MainMenu from '../components/MainMenu';

interface ReactProps {
  isSignedIn: boolean,
  userId: string,
}

const MainCont: React.FC<ReactProps> = (props): ReactElement => {
  let content;

  if (props.isSignedIn) {
    content = <MainMenu userId={props.userId} />;
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
  userId: state.auth.userId,
});

export default connect(
  mapStateToProps,
)(MainCont);
