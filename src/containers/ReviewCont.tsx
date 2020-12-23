import React, {
  useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import { instance as axios } from '../axios-instance';
import {
  UserCharacterInt, MainInt, UserInt, ReactFullState,
} from '../interfaces';
import { DataActionTypes } from '../redux/actions/types';
import { loadUserData, updateUserData, updateUserLevel } from '../redux/actions';
import Review from '../components/Review';
import Strip from '../components/Strip';
import levels from '../assets/levels';

interface ReactProps {
  token: string,
  userId: string,
  mainData: MainInt,
  userData: UserInt,
  loadUserData: (source: CancelTokenSource, token: string, userId: string) => any,
  updateUserData: (
    word: string,
    object: UserCharacterInt,
    token: string,
    userId: string
    ) => DataActionTypes,
  updateUserLevel: (level: number, token: string, userId: string) => DataActionTypes,
}

const ReviewCont: React.FC<ReactProps> = (props): ReactElement => {
  // Loading user data
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (!props.userData) {
      props.loadUserData(source, props.token, props.userId);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [props.userData]);

  // After component unmounts user progress is checked for advancement
  useEffect(() => () => {
    if (props.mainData && props.userData) {
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
        props.updateUserLevel(userLevel + 1, props.token, props.userId);
      }
    }
  });

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
    props.updateUserData(word, object, props.token, props.userId);
  };

  let content;

  if (props.mainData && props.userData) {
    if (!props.userData.characters) {
      content = <Strip message="You do not have any characters to review yet. Please visit Learn first." backTrack="/main" timeout={4000} />;
    } else if (dataToReview(props.userData).length === 0) {
      content = <Strip message="No characters to review right now" backTrack="/main" timeout={4000} />;
    } else {
      content = (
        <Review
          mainData={props.mainData}
          userData={props.userData}
          reviewData={dataToReview(props.userData)}
          uploadReviewResults={uploadReviewResults}
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
  userId: state.auth.userId,
  mainData: state.data.mainData,
  userData: state.data.userData,
});

export default connect(
  mapStateToProps,
  { loadUserData, updateUserData, updateUserLevel },
)(ReviewCont);
