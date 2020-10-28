import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Learn.css';
import Strip from './Strip';

const Learn = (props) => {
  const mainData = props.mainData.characters;
  // starts with first element of to-learn list
  const [current, setCurrent] = useState(props.newKeys[0]);
  // memonics in case they are changed
  const [meaningMemonic, setMeaningMemonic] = useState('');
  const [readingMemonic, setReadingMemonic] = useState('');
  const [remaningNum, setRemainingNum] = useState(props.newKeys.length);
  // on continue uploads new character to use DB and continue to next one
  const handleContinue = (event) => {
    event.preventDefault();

    const newObj = {
      lastPract: new Date(),
      level: 0,
      memoMean: meaningMemonic,
      memoRead: readingMemonic,
    };
    props.putUserNewCharacter(current, newObj);
    setCurrent(props.newKeys[props.newKeys.indexOf(current) + 1]);
    setMeaningMemonic('');
    setReadingMemonic('');
    setRemainingNum(remaningNum - 1);
  };

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;

    switch (name) {
      case 'meaning':
        setMeaningMemonic(value);
        break;
      case 'reading':
        setReadingMemonic(value);
        break;
      default:
        break;
    }
  };

  if (remaningNum === 0) {
    return (
      <Strip message="No new characters to learn right now" timeout={4000} />
    );
  }
  return (
    <div className="card" id="learn-card">
      <p id="chinese-simplified-label">Simplified:</p>
      <h3 id="chinese-simplified">{mainData[current].chineseSimp}</h3>
      <h1 id="chinese-traditional">{mainData[current].chineseTrad}</h1>
      <p id="remaining">
        Remanining:
        {' '}
        {remaningNum}
      </p>
      <p id="meaning-label">Meaning:</p>
      <p id="reading-label">Reading:</p>
      <form
        id="continue-button-form"
        autoComplete="off"
        onSubmit={handleContinue}
      >
        <input
          id="learn-continue-button"
          className="standard-button"
          type="submit"
          value="Continue"
        />
      </form>
      <p id="meaning-learn">
        {mainData[current].english.filter(
          (x) => typeof x === 'string' && x.length > 0,
        )
          .join(', ')}
      </p>
      <label
        id="meaning-memonic-learn-label"
        form="continue-button-form"
        htmlFor="meaning-memonic"
      >
        Meaning memonic:
      </label>
      <textarea
        id="meaning-memonic-learn"
        className="memonic-textarea"
        form="continue-button-form"
        type="text"
        name="meaning"
        value={meaningMemonic}
        onChange={handleChange}
      />
      <p id="reading-learn">
        {mainData[current].pinyin}
        {' '}
        (tone:
        {mainData[current].tone}
        )
      </p>
      <label
        id="reading-memonic-learn-label"
        form="continue-button-form"
        htmlFor="reading-memonic"
      >
        Reading memonic:
      </label>
      <textarea
        id="reading-memonic-learn"
        className="memonic-textarea"
        form="continue-button-form"
        type="text"
        name="reading"
        value={readingMemonic}
        onChange={handleChange}
      />
    </div>
  );
};

Learn.propTypes = {
  mainData: PropTypes.shape({
    characters: PropTypes.objectOf(
      PropTypes.exact({
        chineseSimp: PropTypes.string,
        chineseTrad: PropTypes.string,
        english: PropTypes.arrayOf(PropTypes.string),
        pinyin: PropTypes.string,
        stage: PropTypes.number,
        tone: PropTypes.string,
      }),
    ),
  }).isRequired,
  newKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  putUserNewCharacter: PropTypes.func.isRequired,
};

export default Learn;
