import React, { useEffect, useState, useContext } from 'react';
import { instance as axios, getMainDataCharacters, getUserData } from '../axios-instance';
import history from '../history';
import { UserContext } from '../components/providers/UserProvider';
import Review from '../components/Review';
import Strip from '../components/Strip';
import levels from '../assets/levels';

const ReviewCont = () => {
  // setting up user status
  const currentUser = useContext(UserContext);

  const [userId, setUserID] = useState(localStorage.getItem('userId'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserID(localStorage.getItem('userId'));
  }, [currentUser]);
  // setting up data
  const [mainData, setMainData] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token) {
      getMainDataCharacters(source, token, setMainData);
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

      axios.get(`/${userId}/characters.json?auth=${token}`).then((res) => {
        console.log('GET user data loaded');
        // possible characters from main DB for users current level
        const currentLevelKeys = Object.keys(mainData)
          .filter((char) => mainData[char].stage === userLevel);
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
            }).catch((error) => console.error(`Error updating database: ${error}`));
        }
      }).catch((error) => console.error(`Error loading user data: ${error}`));
    }
  });

  const mainMenu = () => {
    history.push('/main');
  };
  // takes in user data and return the list of characters that need reviewing
  const dataToReview = (data) => {
    const review = {};
    const currentDate = new Date();

    for (const character in data) {
      const storedDate = new Date(data[character].lastPract);

      if (data[character].level === 9) {
        // Good job! No need to review this anymore
      } else if (
        Math.round((currentDate - storedDate) / (1000 * 60 * 60))
        >= levels[data[character].level][0]
      ) {
        review[character] = data[character];
      }
    }
    return review;
  };
  // as name suggests, uploads the results of the review
  const uploadReviewResults = (character, object) => {
    axios.put(`/${userId}/characters/${character}.json?auth=${token}`, object)
      .then(() => console.log('PUT: upload to database'))
      .catch((error) => console.error(`Error refreshing database: ${error}`));
  };

  let content;

  if (mainData && userData) {
    if (userData.characters === 'α') {
      content = <Strip message="You do not have any characters to review yet. Please visit Learn first." backTrack="/main" timeout={4000} />;
    } else if (Object.keys(dataToReview(userData.characters)).length === 0) {
      content = <Strip message="No characters to review right now" backTrack="/main" timeout={4000} />;
    } else {
      content = (
        <Review
          mainData={mainData}
          reviewData={dataToReview(userData.characters)}
          uploadReviewResults={uploadReviewResults}
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
