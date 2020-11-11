import React, { useState, ReactElement } from 'react';
import './InfoTag.css';
import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import history from '../../history';

interface InfoTagProps {
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
  character: string,
  value?: string
}

const InfoTag: React.FC<InfoTagProps> = (props): ReactElement => {
  // checking type of display, setting correct datasource according to it
  const type = Object.keys(props.mainData.characters).includes(props.character) ? 'Character' : 'Word';
  const mainData = type === 'Character'
    ? props.mainData.characters : props.mainData.words;
  const userData = type === 'Character'
    ? props.userData.characters : props.userData.words;
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
  // modifier for level advance
  let modifier = 0;
  if (props.value === 'true') {
    modifier = 1;
  }
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
                  {userData[props.character].level + modifier}
                </p>
              )
              : ''}
          </div>
        )
        : ''}
    </div>
  );
};

InfoTag.defaultProps = {
  value: '',
};

export default InfoTag;