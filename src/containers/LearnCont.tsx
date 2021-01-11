import React, {
  useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import { instance as axios } from '../axios-instance';
import {
  UserCharacterInt, MainInt, UserInt, ReactFullState,
} from '../interfaces';
import { loadUserData, updateUserData } from '../redux/actions';
import Learn from '../components/learning/Learn';
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

  // determines which items are to be learned by user level
  const filterNewItems = (main: MainInt, user: UserInt) => {
  // which level our user is on
    const userStage = user.profileData.currentStage;
    // characters that are right for the user's level
    const dataCharKeys = Object.keys(main.characters)
      .filter((char) => main.characters[char].stage <= userStage);
    // words that are right for the user's level
    const dataWordKeys = Object.keys(main.words)
      .filter((word) => main.words[word].stage <= userStage);
    // checks if all elements of the word are at least GURU level
    const dataWordKeysGuru = dataWordKeys.filter((item) => {
      let applicable = true;
      main.words[item].chineseTrad.forEach((comp) => {
        if (!Object.keys(user.characters).includes(comp)) {
          applicable = false;
        } else if (user.characters[comp].level < 5) {
          applicable = false;
        }
      });
      return applicable;
    });

    const dataKeys = dataCharKeys.concat(dataWordKeysGuru);
    const userKeys = Object.keys(user.characters).concat(Object.keys(user.words));

    return dataKeys.filter((char) => !userKeys.includes(char));
  };

  // adds learned character from main DB to user DB
  const learnNewWord = (word: string, object: UserCharacterInt) => {
    props.updateUserData(word, object);
  };

  let content;

  if (props.mainData && props.userData) {
    if (Object.keys(filterNewItems(props.mainData, props.userData)).length === 0) {
      content = <Strip message="No new characters to learn right now" backTrack="/main" timeout={4000} />;
    } else {
      content = (
        <Learn
          mainData={props.mainData}
          learnNewWord={learnNewWord}
          newItemKeys={filterNewItems(props.mainData, props.userData)}
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
