import React, { ReactElement } from 'react';
import './Stage.css';
import Character from './Character';

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

interface StageProps {
  stageData: string[];
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
  },
  userData: {
    characters: {
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
    <h1 className="levels-h1">
      Stage
      {props.level}
    </h1>
    <div className="stage-flex">
      {props.stageData.map((item, index) => (
        <Character
          mainData={props.mainData}
          userData={props.userData}
          character={item}
          key={item + index}
        />
      ))}
    </div>
  </div>
);

export default Stage;
