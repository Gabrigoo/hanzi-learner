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
    backColor = 'character-correct';
  } else if (props.value === 'false') {
    backColor = 'character-incorrect';
  } else {
    backColor = 'character-standard';
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
              {props.data[props.character].english[0]}
            </p>
            <p className="short-hint">
              Read:
              {props.data[props.character].pinyin}
            </p>
          </div>
        )
        : ''}
    </div>
  );
};

Character.defaultProps = {
  value: '',
};

Character.propTypes = {
  data: PropTypes.objectOf(PropTypes.object).isRequired,
  character: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default Character;
