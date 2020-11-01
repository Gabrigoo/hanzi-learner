import React, { useState } from 'react';
import './Character.css';
import history from '../history';

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

interface CharacterProps {
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
  character: string,
  value?: string
}

const Character: React.FC<CharacterProps> = (props) => {
  const mainData = props.mainData.characters;
  const userData = props.userData.characters;
  // these are for the small popup box when hovering over a character
  const [showBox, setShowBox] = useState(false);

  const handleBoxEnter = () => {
    setShowBox(true);
  };
  const handleBoxLeave = () => {
    setShowBox(false);
  };

  const handleClick = () => {
    const path = `/info/${props.character}`;
    history.push(path);
  };
  // background color indicating status
  let backColor:string;
  if (props.value === 'true') {
    backColor = 'theme-correct';
  } else if (props.value === 'false') {
    backColor = 'theme-incorrect';
  } else if (!Object.prototype.hasOwnProperty.call(userData, props.character)) {
    backColor = 'theme-grey';
  } else if (userData[props.character].level === 0) {
    backColor = 'theme-grey';
  } else if (userData[props.character].level < 5) {
    backColor = 'theme-brown';
  } else if (userData[props.character].level < 7) {
    backColor = 'theme-bronze';
  } else if (userData[props.character].level < 8) {
    backColor = 'theme-silver';
  } else if (userData[props.character].level < 9) {
    backColor = 'theme-gold';
  } else {
    backColor = 'theme-diamond';
  }

  return (
    <div id="mapped-character-div" onMouseEnter={handleBoxEnter} onMouseLeave={handleBoxLeave}>
      <button className={backColor} id="mapped-character" onClick={handleClick}>{props.character}</button>
      {showBox
        ? (
          <div className="popup-box">
            <div className="arrow-up" />
            <p className="short-hint">
              Mean:
              {' '}
              {mainData[props.character].english[0]}
            </p>
            <p className="short-hint">
              Read:
              {' '}
              {mainData[props.character].pinyin}
            </p>
            {userData[props.character]
              ? (
                <p className="short-hint">
                  Level:
                  {' '}
                  {userData[props.character].level}
                </p>
              )
              : ''}
          </div>
        )
        : ''}
    </div>
  );
};

Character.defaultProps = {
  value: '',
};

export default Character;
