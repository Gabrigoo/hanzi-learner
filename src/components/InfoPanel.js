import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './InfoPanel.css';
import levels from '../assets/levels';

const InfoPanel = (props) => {
  // getting character the panel is supposed to display
  const current = props.id;
  const { mainData } = props;
  const { userData } = props;
  // memonics in case they are changed
  const [changeMemonic, setChangeMemonic] = useState(false);
  const [meaningMemonic, setMeaningMemonic] = useState('');
  const [readingMemonic, setReadingMemonic] = useState('');

  const switchChangeMemonics = () => {
    setChangeMemonic(true);
    if (meaningMemonic === '') {
      setMeaningMemonic(userData[current].memoMean);
    }
    if (readingMemonic === '') {
      setReadingMemonic(userData[current].memoRead);
    }
  };

  const sendMemonic = () => {
    const object = {
      lastPract: userData[current].lastPract,
      level: userData[current].level,
      memoMean: meaningMemonic,
      memoRead: readingMemonic,
    };
    props.putUserNewMemonic(current, object);
    setChangeMemonic(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;

    switch (name) {
      case 'meaning-memo':
        setMeaningMemonic(value);
        break;
      case 'reading-memo':
        setReadingMemonic(value);
        break;
      default:
        break;
    }
  };
  // convert JSON date into the displayed date
  const dateToString = (jason) => {
    const date = new Date(jason);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (month < 10) { month = '0' + month; }
    if (day < 10) { day = '0' + day; }

    return year + '/' + month + '/' + day + ' ' + hours + ':' + minutes;
  };

  let content;
  let userContent = 'This character is not yet learned.';

  content = (
    <>
      <div id="horiz-div-1" className="horiz-div">
        <div id="horiz-div-2" className="horiz-div">
          <h1 id="chinese-trad-info">{current}</h1>
          <h2 id="chinese-simp-info">{mainData[current].chineseSimp}</h2>
        </div>
        <p id="stage-count">Stage:{' '}{mainData[current].stage}</p>
      </div>
      <div className="horiz-div">
        <p className="margin-right-30">Meaning:</p>
        {mainData[current].english.map((word, index) => <p className="mean-info" key={word + index}>{word}</p>)}
      </div>
      
      <div className="horiz-div">
        <p className="margin-right-30">Reading:</p>
        <p className="read-info">{mainData[current].pinyin}</p>
        <p>{mainData[current].tone}</p>
      </div>
    </>
  );
  if (userData[current]) {
    userContent = (
      <>
        {changeMemonic
          ? (
            <>
              <p>Meaning memonic:</p>
              <textarea
                id="meaning-memonic-input"
                className="memo-info"
                type="text"
                name="meaning-memo"
                value={meaningMemonic}
                onChange={handleChange}
              />
              <p>Reading memonic:</p>
              <textarea
                id="reading-memonic-input"
                className="memo-info"
                type="text"
                name="reading-memo"
                value={readingMemonic}
                onChange={handleChange}
              />
              <button
                id="change-memo-button"
                className="standard-button"
                onClick={sendMemonic}
              >
                Save memonics
              </button>
            </>
          )
          : (
            <>
              <p>Meaning memonic:</p>
              <div className="memo-info">
                {meaningMemonic !== ''
                ? meaningMemonic
                : userData[current].memoMean === ''
                  ? 'Currently no meaning memonic added'
                  : userData[current].memoMean}
              </div>
              <p>Reading memonic:</p>
              <div className="memo-info">
                {readingMemonic !== ''
                ? readingMemonic
                : userData[current].memoRead === ''
                  ? 'Currently no reading memonic added'
                  : userData[current].memoRead}
              </div>
              <button
                id="change-memo-button"
                className="standard-button"
                onClick={switchChangeMemonics}
              >
                Change memonics
              </button>
            </>
          )}
        <div className="horiz-div">
          <p className="margin-right-30">Last practiced:</p>
          <p>{dateToString(userData[current].lastPract)}</p>
        </div>
        <div className="horiz-div">
          <p className="margin-right-30">User level:</p>{' '}
          <p className="read-info">{userData[current].level}</p>
          <p>"</p><p>{levels[userData[current].level][1]}</p><p>"</p>
        </div>
      </>
    );
  }

  return (
    <div className="card" id="info-card">
      {content}
      {userContent}
    </div>
  );
};

InfoPanel.defaultProps = {
  userData: {},
};

InfoPanel.propTypes = {
  id: PropTypes.string.isRequired,
  mainData: PropTypes.objectOf(PropTypes.object).isRequired,
  userData: PropTypes.objectOf(PropTypes.object),
  putUserNewMemonic: PropTypes.func.isRequired,
};

export default InfoPanel;
