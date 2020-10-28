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

Character.defaultProps = {
  userData: {},
};

Stage.propTypes = {
  stageData: PropTypes.objectOf(
    PropTypes.exact({
      chineseSimp: PropTypes.string,
      chineseTrad: PropTypes.string,
      english: PropTypes.arrayOf(PropTypes.string),
      pinyin: PropTypes.string,
      stage: PropTypes.number,
      tone: PropTypes.string
    }),
  ).isRequired,
  userData: PropTypes.shape({
    characters: PropTypes.objectOf(
      PropTypes.exact({
        lastPract: PropTypes.string,
        level: PropTypes.number,
        memoMean: PropTypes.string,
        memoRead: PropTypes.string,
      }),
    ),
    profileData: PropTypes.exact({
      currentStage: PropTypes.number,
    }),
  }),
  level: PropTypes.string.isRequired,
};

export default Stage;
