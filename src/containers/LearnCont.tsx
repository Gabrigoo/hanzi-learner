import React, { useContext, useState, useEffect } from 'react';
import { instance as axios, getMainData, getUserData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import Learn from '../components/Learn';
import Strip from '../components/Strip';

interface MainCharacterInt {
  chineseSimp: string,
  chineseTrad: string,
  english: string[],
  pinyin: string,
  stage: number,
  tone: string,
}

interface UserCharacterInt {
  lastPract: number,
  level: number,
  memoMean: string,
  memoRead: string,
}

interface MainInt {
  characters: {
    [key: string]: MainCharacterInt,
  },
}

interface UserInt {
  characters: {
    [key: string]: UserCharacterInt,
  },
  profileData: {
    currentStage: number
  }
}

const LearnCont = () => {
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
    const userStage = user.profileData.currentStage;
    const dataKeys = Object.keys(main.characters)
      .filter((char) => main.characters[char].stage <= userStage);
    const userKeys = Object.keys(user.characters);
    return dataKeys.filter((char) => !userKeys.includes(char));
  };
  // adds learned character from main DB to user DB
  const putUserNewCharacter = (character: string, object: UserCharacterInt) => {
    axios.put(`/${userId}/characters/${character}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: new user data uploaded'); })
      .catch((error: any) => console.error(`Error uploading new data: ${error}`));
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
