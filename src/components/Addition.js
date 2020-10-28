import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './Addition.css';
import { TONES } from '../assets/tones';

const Addition = (props) => {
  // states for user input
  const [chineseTrad, setChineseTrad] = useState('');
  const [chineseSimp, setChineseSimp] = useState('');
  const [english1, setEnglish1] = useState('');
  const [english2, setEnglish2] = useState('');
  const [english3, setEnglish3] = useState('');
  const [pinyin, setPinyin] = useState('');
  const [tone, setTone] = useState('');
  const [stage, setStage] = useState('');

  // import data in order to check if entry exists
  const [dataKeys, setDataKeys] = useState(Object.keys(props.mainData.characters));
  // set if already existing entry should be overwritten or not
  const [overwrite, setOverwrite] = useState(false);
  // a message warning the user if character is already in db
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (dataKeys.includes(chineseTrad)) {
      setMessage('Character is already in database!');
    } else {
      setMessage('');
    }
  }, [dataKeys, chineseTrad]);

  // automatically checks the tone and fills tone input box
  const toneCheck = (input) => {
    for (let i = 0; i < input.length; i += 1) {
      for (let j = 0; j < Object.keys(TONES).length; j += 1) {
        if (TONES[Object.keys(TONES)[j]].includes(input[i])) {
          return Object.keys(TONES)[j];
        }
      }
    }
    if (input === '') {
      return '';
    }
    return '5';
  };
  // handles state change
  const handleChange = (event) => {
    const { name, value } = event.currentTarget;

    switch (name) {
      case 'chineseTrad':
        setChineseTrad(value);
        break;
      case 'chineseSimp':
        setChineseSimp(value);
        break;
      case 'pinyin':
        setPinyin(value);
        setTone(toneCheck(value));
        break;
      case 'tone':
        setTone(value);
        break;
      case 'english-1':
        setEnglish1(value);
        break;
      case 'english-2':
        setEnglish2(value);
        break;
      case 'english-3':
        setEnglish3(value);
        break;
      case 'stage':
        setStage(value);
        break;
      default:
        break;
    }
  };
  // determines whether user is allowed to overwrite existing character entry
  const switchOverwrite = () => {
    if (overwrite) {
      setOverwrite(false);
    } else {
      setOverwrite(true);
      alert('Please use caution when overwriting data entries.');
    }
  };
  // resets all input fields to empty string
  const clearInput = () => {
    setChineseTrad('');
    setChineseSimp('');
    setEnglish1('');
    setEnglish2('');
    setEnglish3('');
    setPinyin('');
    setTone('');
    setStage('');
  };
  // handles uploading of character
  const handleSubmit = (event) => {
    event.preventDefault();

    if (chineseTrad === '') {
      alert('Insert a valid character');
    } else if (dataKeys.includes(chineseTrad) && overwrite === false) {
      alert('Entry already exists');
    } else {
      const newObj = {
        chineseTrad,
        chineseSimp,
        english: [english1.toLowerCase(), english2.toLowerCase(), english3.toLowerCase()],
        pinyin: pinyin.toLowerCase(),
        tone,
        stage: parseInt(stage, 10),
      };
      props.uploadNewCharacter(chineseTrad, newObj);
      setDataKeys(dataKeys.concat(chineseTrad));
      clearInput();
    }
  };

  return (
    <div>
      <form id="addition-grid-card" autoComplete="off" onSubmit={handleSubmit}>
        <h1 className="add-h1">Add new entry</h1>
        <div id="add-message">
          {message}
        </div>
        <label>
          Traditional chinese:
          <input
            className="hanzi-input"
            type="text"
            name="chineseTrad"
            value={chineseTrad}
            onChange={handleChange}
          />
        </label>
        <label>
          Simplified chinese:
          <input
            className="hanzi-input"
            type="text"
            name="chineseSimp"
            value={chineseSimp}
            onChange={handleChange}
          />
        </label>
        <label>
          Pinyin:
          <input
            type="text"
            name="pinyin"
            value={pinyin}
            onChange={handleChange}
          />
        </label>
        <label>
          Tone:
          <input
            type="text"
            name="tone"
            value={tone}
            onChange={handleChange}
          />
        </label>
        <label>
          Meaning:
          <input
            className="margin-bottom-3"
            type="text"
            name="english-1"
            value={english1}
            onChange={handleChange}
          />
          <input
            className="margin-bottom-2"
            type="text"
            name="english-2"
            value={english2}
            onChange={handleChange}
          />
          <input
            type="text"
            name="english-3"
            value={english3}
            onChange={handleChange}
          />
        </label>
        <label>
          Stage:
          <input
            type="text"
            name="stage"
            value={stage}
            onChange={handleChange}
          />
        </label>
        <div id="bottom-flex">
          <p>Overwrite:</p>
          <label className="switch">
            <input onChange={switchOverwrite} type="checkbox" />
            <span className="slider round" />
          </label>
          <input
            id="submit-button"
            type="submit"
            value="Submit"
          />
          <button type="reset" id="clear-button" onClick={clearInput}>
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

Addition.propTypes = {
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
  uploadNewCharacter: PropTypes.func.isRequired,
};

export default Addition;
