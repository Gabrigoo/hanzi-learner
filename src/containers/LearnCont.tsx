import React, {
  useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import AxiosErrorObj from 'axios-error';
import { instance as axios } from '../axios-instance';
import {
  UserCharacterInt, MainInt, UserInt, ReactFullState,
} from '../interfaces';
import { loadUserData, updateUserData } from '../redux/actions';
import LearningService from '../services/Learning.service';
import Learning from '../components/learning/Learning';
import Strip from '../components/Strip';

interface ReactProps {
  token: string,
  mainData: MainInt,
  userData: UserInt,
  loadUserData: (source: CancelTokenSource) => any,
  updateUserData: (word: string, object: UserCharacterInt) => any,
}

const LearnCont: React.FC<ReactProps> = (props): ReactElement => {
  // Loading user data
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (!props.userData && props.token) {
      props.loadUserData(source);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [props.userData, props.token]);

  // adds learned character from main DB to user DB
  const learnNewWord = (
    word: string,
    object: UserCharacterInt,
  ): AxiosErrorObj => props.updateUserData(word, object);

  let content;

  if (props.mainData && props.userData) {
    if (!LearningService.itemsToLearn(props.mainData, props.userData).length) {
      content = <Strip message="No new characters to learn right now" backTrack="/main" timeout={4000} />;
    } else {
      content = (
        <Learning
          mainData={props.mainData}
          learnNewWord={learnNewWord}
          newItemKeys={LearningService.itemsToLearn(props.mainData, props.userData)}
        />
      );
    }
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
)(LearnCont);
