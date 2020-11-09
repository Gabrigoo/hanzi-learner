import React, {
  useEffect, useState, useContext, ReactElement,
} from 'react';
import { instance as axios, getMainData, getUserData } from '../axios-instance';
import history from '../history';
import { UserContext } from '../components/providers/UserProvider';
import Review from '../components/Review';
import Strip from '../components/Strip';
import levels from '../assets/levels';

interface UserInt {
  characters: {
    [key: string]: UserCharacterInt,
  },
  words: {
    [key: string]: UserCharacterInt,
  },
  profileData: {
    currentStage: number
  }
}

interface UserCharacterInt {
  lastPract: number,
  level: number,
  memoMean: string,
  memoRead: string,
}

const ReviewCont = (): ReactElement => {
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
  // after component unmounts user progress is checked advancement is determined
  useEffect(() => () => {
    if (mainData && userData) {
      const userLevel = userData.profileData.currentStage;

      axios.get(`/${userId}/characters.json?auth=${token}`).then((res:any) => {
        console.log('GET user data loaded');
        // possible characters from main DB for users current level
        const currentLevelKeys = Object.keys(mainData.characters)
          .filter((char) => mainData.characters[char].stage === userLevel);
        // character that are known by the user at least at Guru level
        const learnedKeys = Object.keys(res.data).filter((char) => res.data[char].level > 4);
        const fullLength = currentLevelKeys.length;
        const knownLength = currentLevelKeys.filter((char) => learnedKeys.includes(char)).length;
        console.log(`Full: ${fullLength}`);
        console.log(`Known: ${knownLength}`);
        const ratio = (knownLength / fullLength) * 100;
        console.log(`asessing user data... level completion: ${ratio}`);
        if (ratio > 90) {
          console.log(`User level increased to: ${userLevel + 1}`);
          axios.put(`/${userId}/profileData/currentStage.json?auth=${token}`, userLevel + 1)
            .then(() => {
              console.log('PUT database overwritten');
            }).catch((error: any) => console.error(`Error updating database: ${error}`));
        }
      }).catch((error: any) => console.error(`Error loading user data: ${error}`));
    }
  });

  const mainMenu = () => {
    history.push('/main');
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
        Math.round((currentDate - storedDate) / (1000 * 60 * 60))
          >= levels[data.words[item].level][0]
      ) {
        review.push(item);
      }
    });
    return review;
  };
  // as name suggests, uploads the results of the review
  const putUserNewCharacter = (character: string, object: UserCharacterInt) => {
    axios.put(`/${userId}/characters/${character}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: new user data uploaded'); })
      .catch((error: any) => console.error(`Error uploading new data: ${error}`));
  };
  const putUserNewWord = (word: string, object: UserCharacterInt) => {
    axios.put(`/${userId}/words/${word}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: new user data uploaded'); })
      .catch((error: any) => console.error(`Error uploading new data: ${error}`));
  };

  let content;

  if (mainData && userData) {
    if (userData.characters === 'α') {
      content = <Strip message="You do not have any characters to review yet. Please visit Learn first." backTrack="/main" timeout={4000} />;
    } else if (dataToReview(userData).length === 0) {
      content = <Strip message="No characters to review right now" backTrack="/main" timeout={4000} />;
    } else {
      content = (
        <Review
          mainData={mainData}
          userData={userData}
          reviewData={dataToReview(userData)}
          putUserNewCharacter={putUserNewCharacter}
          putUserNewWord={putUserNewWord}
          mainMenu={mainMenu}
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

export default ReviewCont;
