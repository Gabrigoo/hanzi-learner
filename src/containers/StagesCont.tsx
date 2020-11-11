import React, {
  useState, useContext, useEffect, ReactElement,
} from 'react';
import { instance as axios, getMainData, getUserData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import { MainCharacterInt, MainInt, UserInt } from '../interfaces';
import Strip from '../components/Strip';
import Stage from '../components/Info/Stage';

const StagesCont = (): ReactElement => {
  // setting up user status
  const currentUser = useContext(UserContext);

  const [userId, setUserID] = useState(localStorage.getItem('userId'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserID(localStorage.getItem('userId'));
  }, [currentUser]);

  const [mainData, setMainData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  // setting up data
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
  // finds the highest stage level among all data
  const findHighestStage = (data: {[key: string]: MainCharacterInt}) => {
    let highest = 0;
    Object.keys(data).forEach((item) => {
      if (data[item].stage > highest) {
        highest = data[item].stage;
      }
    });
    return highest;
  };
  // only returns data that is the same as current stage
  const sortDataToStage = (data: MainInt, currentStage: number) => {
    const stageArray: string[] = [];
    Object.keys(data.characters).forEach((item) => {
      if (data.characters[item].stage === currentStage) {
        stageArray.push(item);
      }
    });
    Object.keys(data.words).forEach((item) => {
      if (data.words[item].stage === currentStage) {
        stageArray.push(item);
      }
    });
    return stageArray;
  };
  // steps through the stages until the current highest
  const loopThrough = (highestStage: number, main: MainInt, user: UserInt) => {
    const items = [];
    for (let i = 1; i <= highestStage; i += 1) {
      items.push(<Stage level={i.toString()} stageData={sortDataToStage(main, i)} mainData={main} userData={user} key={`stage${i}`} />);
    }
    return items;
  };

  let content;

  if (mainData && userData) {
    content = (
      <div className="card" id="stage-flex-card">
        {loopThrough(findHighestStage(mainData.characters), mainData, userData)}
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
