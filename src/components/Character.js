import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Character.css';
import history from '../history';

const Character = (props) => {
  // these are for the small popup box when hovering over a character
  const [showBox, setShowBox] = useState(false);

  const handleBoxEnter = () => {
    setShowBox(true);
  };
  const handleBoxLeave = () => {
    setShowBox(false);
  };

  const handleClick = () => {
    const path = '/info/' + props.character;
    history.push(path);
  };
  // background color indicating correct and incorrect (or none)
  let backColor;
  if (props.value === 'true') {
    backColor = 'theme-correct';
  } else if (props.value === 'false') {
    backColor = 'theme-incorrect';
  } else if (!props.userData.hasOwnProperty(props.character)) {
    backColor = 'theme-grey';
  } else if (props.userData[props.character].level === 0) {
    backColor = 'theme-grey';
  } else if (props.userData[props.character].level < 5) {
    backColor = 'theme-brown';
  } else if (props.userData[props.character].level < 7) {
    backColor = 'theme-bronze';
  } else if (props.userData[props.character].level < 8) {
    backColor = 'theme-silver';
  } else if (props.userData[props.character].level < 9) {
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
              Mean:{' '}
              {props.mainData[props.character].english[0]}
            </p>
            <p className="short-hint">
              Read:{' '}
              {props.mainData[props.character].pinyin}
            </p>
            {props.userData[props.character] ?
            <p className="short-hint">
              Level:{' '}
              {props.userData[props.character].level}
            </p>:
            ""}
          </div>
        )
        : ''}
    </div>
  );
};

Character.defaultProps = {
  value: '',
  userData: {},
};

Character.propTypes = {
  mainData: PropTypes.objectOf(PropTypes.object).isRequired,
  userData: PropTypes.objectOf(PropTypes.object),
  character: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Character;
