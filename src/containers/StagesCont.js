import React, { useState, useContext, useEffect } from 'react';
import { instance as axios, getMainDataCharacters, getUserData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import Strip from '../components/Strip';
import Stage from '../components/Stage';

const StagesCont = () => {
  // setting up user status
  const currentUser = useContext(UserContext);

  const [userId, setUserID] = useState(localStorage.getItem('userId'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserID(localStorage.getItem('userId'));
  }, [currentUser]);

  const [mainData, setMainData] = useState(null);
  const [userData, setUserData] = useState(null);
  // setting up data
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
  // finds the highest stage level among all data
  const findHighestStage = (data) => {
    let highest = 0;
    for (const character in data) {
      if (data[character].stage > highest) {
        highest = data[character].stage;
      }
    }
    return highest;
  };
  // only returns data that is the same as current stage
  const sortDataToStage = (data, currentStage) => {
    const stageObject = {};

    for (const character in data) {
      if (data[character].stage === currentStage) {
        stageObject[character] = data[character];
      }
    }
    return stageObject;
  };
  // steps through the stages until the current highest
  const loopThrough = (highestStage, main, user) => {
    const items = [];
    for (let i = 1; i <= highestStage; i += 1) {
      items.push(<Stage level={i.toString()} stageData={sortDataToStage(main, i)} userData={user.characters} key={'stage' + i} />);
    }
    return items;
  };

  let content;

  if (mainData && userData) {
    content = (
      <div className="card" id="stage-flex-card">
        {loopThrough(findHighestStage(mainData), mainData, userData)}
      </div>
    );
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

export default StagesCont;
