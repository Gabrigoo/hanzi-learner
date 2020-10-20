import React from 'react';
import PropTypes from 'prop-types';
import './Stage.css';
import Character from './Character';

const Stage = (props) => ( // all the elements for the current stage mapped
  <div className="justify-left">
    <h1 className="levels-h1">
      Stage
      {props.level}
    </h1>
    <div className="stage-flex">
      {Object.keys(props.stageData).map((item, index) => (
        <Character
          mainData={props.stageData}
          userData={props.userData}
          character={item}
          key={item + index}
        />
      ))}
    </div>
  </div>
);

Stage.propTypes = {
  stageData: PropTypes.objectOf(PropTypes.object).isRequired,
  userData: PropTypes.objectOf(PropTypes.object).isRequired,
  level: PropTypes.string.isRequired,
};

export default Stage;
