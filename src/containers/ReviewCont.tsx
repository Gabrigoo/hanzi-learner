import React, {
  useEffect, ReactElement, useState,
} from 'react';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

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
import Summary from '../components/learning/Summary';
import Review from '../components/learning/Review';
import Strip from '../components/Strip';
import levels from '../assets/levels';

interface ReactProps {
  token: string,
  mainData: MainInt,
  userData: UserInt,
  sessionData: SessionInt,
  loadUserData: (source: CancelTokenSource) => any,
  updateUserData: (word: string, object: UserCharacterInt) => any,
  updateUserLevel: (level: number) => any,
  startSession: (remainingList: string[]) => any,
  answerCorrect: (word: string) => any,
  answerIncorrect: (word: string) => any,
}

const ReviewCont: React.FC<ReactProps> = (props): ReactElement => {
  const [sessionOn, setSessionOn] = useState(false);
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

    if (ratio > 90) {
      console.log(`User level increased to: ${userLevel + 1}`);
      props.updateUserLevel(userLevel + 1);
    }
  };

  const updateMemonic = (word: string, object: UserCharacterInt) => {
    props.updateUserData(word, object);
  };

  // takes in user data and return the list of characters that need reviewing
  const dataToReview = (data: UserInt): string[] => {
    const review: string[] = [];
    const currentDate = new Date().getTime();

    Object.keys(data.characters).forEach((item) => {
      const storedDate = data.characters[item].lastPract;
      if (data.characters[item].level === 9) {
        // Good job! No need to review this anymore
      } else if (
        // Item is not ready to be rewieved
        Math.round((currentDate - storedDate) / (1000 * 60 * 60))
          >= levels[data.characters[item].level][0]
      ) {
        review.push(item);
      }
    });
    Object.keys(data.words).forEach((item) => {
      const storedDate = data.words[item].lastPract;
      if (data.words[item].level === 9) {
        // Good job! No need to review this anymore
      } else if (
        // Item is not ready to be rewieved
        Math.round((currentDate - storedDate) / (1000 * 60 * 60))
          >= levels[data.words[item].level][0]
      ) {
        review.push(item);
      }
    });
    return review;
  };
  // As name suggests, uploads the results of the review
  const uploadReviewResults = (word: string, object: UserCharacterInt) => {
    props.updateUserData(word, object);
  };
  // Upload answer into session db
  const uploadAnswer = (word: string, correct: boolean) => {
    if (correct) {
      props.answerCorrect(word);
    } else {
      props.answerIncorrect(word);
    }
  };
  // Starts or stops the current session
  const switchSession = () => {
    if (sessionOn) {
      setSessionOn(false);
    } else {
      props.startSession(dataToReview(props.userData));
      setSessionOn(true);
    }
  };

  let content;

  if (props.mainData && props.userData) {
    if (sessionOn) {
      if (props.sessionData.sessionStart) {
        content = (
          <Review
            mainData={props.mainData}
            userData={props.userData}
            reviewData={dataToReview(props.userData)}
            sessionData={props.sessionData}
            uploadReviewResults={uploadReviewResults}
            checkForAdvancement={checkForAdvancement}
            switchSession={switchSession}
            uploadAnswer={uploadAnswer}
            updateMemonic={updateMemonic}
          />
        );
      } else {
        content = <Strip message="Loading..." />;
      }
    } else {
      content = (
        <Summary
          mainData={props.mainData}
          userData={props.userData}
          reviewData={dataToReview(props.userData)}
          sessionData={props.sessionData}
          switchSession={switchSession}
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
