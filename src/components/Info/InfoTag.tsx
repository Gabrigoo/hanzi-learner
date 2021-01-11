import React, { useState, ReactElement } from 'react';

import {
  Typography,
} from '@material-ui/core';

import { Link } from 'react-router-dom';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import './InfoTag.css';

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
  word: string,
  value?: string
}

const InfoTag: React.FC<InfoTagProps> = (props): ReactElement => {
  // checking type of display, setting correct datasource according to it
  const type = props.word.length > 1 ? 'word' : 'character';
  const mainData = type === 'character'
    ? props.mainData.characters : props.mainData.words;
  const userData = type === 'character'
    ? props.userData.characters : props.userData.words;
  // these are for the small popup box when hovering over a character
  const [showBox, setShowBox] = useState(false);

  const handleBoxEnter = () => {
    setShowBox(true);
  };
  const handleBoxLeave = () => {
    setShowBox(false);
  };

  // background color indicating status
  let backColor:string;
  if (props.value === 'true') {
    backColor = 'theme-correct';
  } else if (props.value === 'false') {
    backColor = 'theme-incorrect';
  } else if (!Object.prototype.hasOwnProperty.call(userData, props.word)) {
    backColor = 'theme-grey';
  } else if (userData[props.word].level === 0) {
    backColor = 'theme-grey';
  } else if (userData[props.word].level < 5) {
    backColor = 'theme-brown';
  } else if (userData[props.word].level < 7) {
    backColor = 'theme-bronze';
  } else if (userData[props.word].level < 8) {
    backColor = 'theme-silver';
  } else if (userData[props.word].level < 9) {
    backColor = 'theme-gold';
  } else {
    backColor = 'theme-diamond';
  }
  // Popup box position adjustment
  const leftDist = () => {
    switch (props.word.length) {
      case 1:
        return 'left-16';
      case 2:
        return 'left-32';
      case 3:
        return 'left-48';
      default:
        return 'left 64';
    }
  };

  return (
    <div id="mapped-word-div" onMouseEnter={handleBoxEnter} onMouseLeave={handleBoxLeave}>
      <Link
        id="mapped-word"
        to={`/info/${props.word}`}
        className={backColor}
      >
        {props.word}
      </Link>
      {showBox
        ? (
          <div className={`popup-box ${leftDist()}`}>
            <div className="arrow-up" />
            <Typography>
              {`Mean: ${mainData[props.word].english[0]}`}
            </Typography>
            <Typography className="short-hint">
              Read:
              {' '}
              {mainData[props.word].pinyin}
            </Typography>
            <Typography>
              {userData[props.word] ? `Level: ${userData[props.word].level}` : null}
            </Typography>
          </div>
        )
        : null}
    </div>
  );
};

InfoTag.defaultProps = {
  value: '',
};

export default InfoTag;
