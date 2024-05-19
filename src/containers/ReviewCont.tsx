import React, {
  useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import AxiosErrorObj from 'axios-error';
import { instance as axios } from '../axios-instance';
import {
  UserCharacterInt, MainInt, UserInt, ReactFullState, SessionInt,
} from '../interfaces';
import {
  loadUserData,
  updateUserData,
  updateUserLevel,
  startSession,
  answerCorrect,
  answerIncorrect,
} from '../redux/actions';
import LearningService from '../services/Learning.service';
import Review from '../components/learning/Review';
import Strip from '../components/Strip';

interface ReactProps {
  token: string,
  mainData: MainInt,
  userData: UserInt,
  sessionData: SessionInt,
  loadUserData: (source: CancelTokenSource) => void,
  updateUserData: (word: string, object: UserCharacterInt) => any,
  updateUserLevel: (level: number) => void,
  startSession: (remainingList: string[]) => void,
  answerCorrect: (word: string) => void,
  answerIncorrect: (word: string) => void,
}

const ReviewCont: React.FC<ReactProps> = (props): ReactElement => {
  let content;

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

  const checkForAdvancement = () => {
    const userChar = props.userData.characters;
    const userLevel = props.userData.profileData.currentStage;

    // possible characters from main DB for users current level
    const currentLevelKeys = Object.keys(props.mainData.characters)
      .filter((char) => props.mainData.characters[char].stage === userLevel);
      // character that are known by the user at least at Guru level
    const guruKeys = Object.keys(userChar).filter((char) => userChar[char].level > 4);
    const fullLength = currentLevelKeys.length;
    const knownLength = currentLevelKeys.filter((char) => guruKeys.includes(char)).length;
    const ratio = (knownLength / fullLength) * 100;
    console.log(`All characters: ${fullLength}, known:${knownLength}, (${Math.floor(ratio)}%)`);

    if (ratio > 85) {
      console.log(`User level increased to: ${userLevel + 1}`);
      props.updateUserLevel(userLevel + 1);
    }
  };

  const updateMemonic = (
    word: string,
    object: UserCharacterInt,
  ): AxiosErrorObj => props.updateUserData(word, object);

  // As name suggests, uploads the results of the review
  const uploadReviewResults = (
    word: string,
    object: UserCharacterInt,
  ): AxiosErrorObj => props.updateUserData(word, object);

  // Upload answer into session db
  const uploadAnswer = (word: string, correct: boolean) => {
    if (correct) {
      props.answerCorrect(word);
    } else {
      props.answerIncorrect(word);
    }
  };

  // Starts or stops the current session
  const beginSession = (): void => {
    props.startSession(LearningService.itemsToReview(props.userData));
  };

  if (props.mainData && props.userData) {
    content = (
      <Review
        mainData={props.mainData}
        userData={props.userData}
        reviewData={LearningService.itemsToReview(props.userData)}
        sessionData={props.sessionData}
        uploadReviewResults={uploadReviewResults}
        checkForLevelAdvancement={checkForAdvancement}
        beginSession={beginSession}
        uploadAnswer={uploadAnswer}
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
  sessionData: state.session,
});

export default connect(
  mapStateToProps,
  {
    loadUserData,
    updateUserData,
    updateUserLevel,
    startSession,
    answerCorrect,
    answerIncorrect,
  },
)(ReviewCont);
