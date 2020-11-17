import React, {
  useContext, useState, useEffect, ReactElement,
} from 'react';
import { AxiosError } from 'axios';
import { instance as axios, getMainData, getUserData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import { UserCharacterInt, MainInt, UserInt } from '../interfaces';
import Learn from '../components/Learn';
import Strip from '../components/Strip';

const LearnCont = (): ReactElement => {
  // setting up user status
  const currentUser = useContext(UserContext);

  const [userId, setUserID] = useState(localStorage.getItem('userId'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserID(localStorage.getItem('userId'));
  }, [currentUser]);
  // setting up data
  const [mainData, setMainData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token && userId) {
      getMainData(source, token, setMainData);
      getUserData(source, token, userId, setUserData);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [token, userId]);

  // determines which items are to be learned by user level
  const getNewItems = (main: MainInt, user: UserInt) => {
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
  const putUserNewCharacter = (character: string, object: UserCharacterInt) => {
    axios.put(`/${userId}/characters/${character}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: new user data uploaded'); })
      .catch((error: AxiosError) => console.error(`Error uploading new data: ${error}`));
  };
  const putUserNewWord = (word: string, object: UserCharacterInt) => {
    axios.put(`/${userId}/words/${word}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: new user data uploaded'); })
      .catch((error: AxiosError) => console.error(`Error uploading new data: ${error}`));
  };

  let content;

  if (mainData && userData) {
    if (Object.keys(getNewItems(mainData, userData)).length === 0) {
      content = <Strip message="No new characters to learn right now" backTrack="/main" timeout={4000} />;
    } else {
      content = (
        <Learn
          mainData={mainData}
          putUserNewCharacter={putUserNewCharacter}
          putUserNewWord={putUserNewWord}
          newKeys={getNewItems(mainData, userData)}
        />
      );
    }
  } else if (!token) {
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

export default LearnCont;
