import React, { ReactElement } from 'react';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import InfoTag from './InfoTag';
import './Stage.css';

interface StageProps {
  stageData: string[];
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  userData: {
    characters: {
      [key: string]: UserCharacterInt,
    },
    words: {
      [key: string]: UserCharacterInt,
    },
    profileData: {
      currentStage: number
    }
  };
  level: string,
}
// all the elements for the current stage mapped
const Stage: React.FC<StageProps> = (props): ReactElement => (
  <div className="justify-left">
    <div>
      <h2>
        {props.level === '1' ? `User level: ${props.userData.profileData.currentStage}` : null}
      </h2>
      <h1 className="levels-h1">
        {`Stage ${props.level}`}
      </h1>
    </div>

    <div className="stage-flex">
      {props.stageData.map((item, index) => (
        <InfoTag
          mainData={props.mainData}
          userData={props.userData}
          word={item}
          key={item + index}
        />
      ))}
    </div>
  </div>
);

export default Stage;
