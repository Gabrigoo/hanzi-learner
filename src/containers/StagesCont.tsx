import React, {
  useEffect, ReactElement,
} from 'react';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import { instance as axios } from '../axios-instance';
import {
  MainCharacterInt, MainInt, UserInt, ReactFullState,
} from '../interfaces';
import { loadUserData } from '../redux/actions';
import Strip from '../components/Strip';
import Stage from '../components/info/Stage';

interface ReactProps {
  token: string,
  mainData: MainInt,
  userData: UserInt,
  loadUserData: (source: CancelTokenSource) => any,
}

const StagesCont: React.FC<ReactProps> = (props): ReactElement => {
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
  const mapAllStages = (highestStage: number, main: MainInt, user: UserInt) => {
    const items = [];
    for (let i = 1; i <= highestStage; i += 1) {
      items.push(<Stage level={i.toString()} stageData={sortDataToStage(main, i)} mainData={main} userData={user} key={`stage${i}`} />);
    }
    return items;
  };

  let content;

  if (props.mainData && props.userData) {
    content = (
      <div className="card" id="stage-flex-card">
        {mapAllStages(findHighestStage(props.mainData.characters), props.mainData, props.userData)}
      </div>
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
});

export default connect(
  mapStateToProps,
  { loadUserData },
)(StagesCont);
