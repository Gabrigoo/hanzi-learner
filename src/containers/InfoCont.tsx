import React, {
  useEffect, ReactElement,
} from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import { instance as axios } from '../axios-instance';
import { loadUserData, updateUserData } from '../redux/actions';
import {
  MainInt, UserInt, UserCharacterInt, ReactFullState,
} from '../interfaces';
import InfoDetails from '../components/info/InfoDetails';
import Strip from '../components/Strip';

interface ReactProps {
  token: string,
  mainData: MainInt,
  userData: UserInt,
  loadUserData: (source: CancelTokenSource) => any,
  updateUserData: (
    word: string,
    object: UserCharacterInt,
    ) => any,
}

const InfoCont: React.FC<ReactProps> = (props): ReactElement => {
  // Getting character the panel is supposed to display
  const { id }: any = useParams();

  // Loading user data
  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    if (!props.userData && props.token) {
      props.loadUserData(source);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [props.userData, props.token]);

  // function for uploading memonic changes by the user
  const updateMemonic = (word: string, object: UserCharacterInt) => {
    props.updateUserData(word, object);
  };

  let content;

  if (props.mainData && props.userData) {
    content = (
      <InfoDetails
        id={id}
        mainData={props.mainData}
        userData={props.userData}
        updateMemonic={updateMemonic}
      />
    );
  } else if (!props.token) {
    content = <Strip message="No user is signed in" timeout={4000} />;
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
  token: state.auth.token,
  mainData: state.data.mainData,
  userData: state.data.userData,
});

export default connect(
  mapStateToProps,
  { loadUserData, updateUserData },
)(InfoCont);
