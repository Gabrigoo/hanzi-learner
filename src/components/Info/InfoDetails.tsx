import React, { useState, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import InfoTag from './InfoTag';
import LEVELS from '../../assets/levels';
import './InfoDetails.css';

interface InfoDetailsProps {
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
  id: string,
  updateMemonic: (character: string, object: UserCharacterInt) => void,
}

const InfoDetails: React.FC<InfoDetailsProps> = (props): ReactElement => {
  // getting data the panel is supposed to display
  const current = props.id;
  // getting type, character or word, setting currect datascources
  const type = current.length > 1 ? 'word' : 'character';
  const mainData = type === 'character'
    ? props.mainData.characters : props.mainData.words;
  const userData = type === 'character'
    ? props.userData.characters : props.userData.words;
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
  // updates memonic in the database
  const sendMemonic = () => {
    const object = {
      lastPract: userData[current].lastPract,
      level: userData[current].level,
      memoMean: meaningMemonic,
      memoRead: readingMemonic,
    };
    props.updateMemonic(current, object);
    setChangeMemonic(false);
  };

  // convert numeric date into the displayed date
  const dateToString = (numericDate: number) => {
    const date = new Date(numericDate);
    const year = date.getFullYear();
    let currentMonth:string = (date.getMonth() + 1).toString();
    let currentDay:string = (date.getDate()).toString();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (parseInt(currentMonth, 10) < 10) { currentMonth = `0${currentMonth}`; }
    if (parseInt(currentDay, 10) < 10) { currentDay = `0${currentDay}`; }

    return `${year}/${currentMonth}/${currentDay} ${hours}:${minutes}`;
  };

  let userContent = <p>This character is not yet learned.</p>;

  const content = (
    <>
      <div id="horiz-div-1" className="horiz-div">
        <div id="horiz-div-2" className="horiz-div">
          <h1 id="chinese-trad-info">{current}</h1>
          <h2 id="chinese-simp-info">{mainData[current].chineseSimp}</h2>
        </div>
        <div>
          <p id="stage-count">
            Stage:
            {' '}
            {mainData[current].stage}
          </p>
          <Link
            to="/stages"
            className="standard-button"
          >
            Stages
          </Link>
        </div>
      </div>
      <div className="horiz-div">
        <p className="margin-right-30">Meaning:</p>
        {mainData[current].english.map((word, index) => <p className="mean-info" key={word + index}>{word}</p>)}
      </div>

      <div className="horiz-div">
        <p className="margin-right-30">Reading:</p>
        <p className="read-info">
          {type === 'character' ? mainData[current].pinyin : mainData[current].pinyin}
        </p>
        <p>{mainData[current].tone}</p>
      </div>
      {type === 'word' ? (
        <>
          <div className="horiz-div">
            <p className="margin-right-30">Components:</p>
            {current.split('').map((item, index) => (
              <InfoTag
                mainData={props.mainData}
                userData={props.userData}
                word={item}
                key={item + index}
              />
            ))}
          </div>
        </>
      )
        : (
          <>
            <div className="horiz-div">
              <p className="margin-right-30">Found in:</p>
              {Object.keys(props.userData.words).filter((word) => {
                let includes = false;
                word.split('').forEach((comp) => {
                  if (comp === current) {
                    includes = true;
                  }
                });
                return includes;
              }).map((item, index) => (
                <InfoTag
                  mainData={props.mainData}
                  userData={props.userData}
                  word={item}
                  key={item + index}
                />
              ))}
            </div>
          </>
        )}
    </>
  ); // from here is only displayed if user already has relevant learning data
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
                name="meaning-memo"
                value={meaningMemonic}
                onChange={(event) => setMeaningMemonic(event.target.value)}
              />
              <p>Reading memonic:</p>
              <textarea
                id="reading-memonic-input"
                className="memo-info"
                name="reading-memo"
                value={readingMemonic}
                onChange={(event) => setReadingMemonic(event.target.value)}
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
          <p className="margin-right-30">Next practice:</p>
          <p>
            {dateToString(userData[current].lastPract
              + (LEVELS[userData[current].level][0] * (1000 * 60 * 60)))}
          </p>
        </div>
        <div className="horiz-div">
          <p className="margin-right-30">User level:</p>
          {' '}
          <p className="read-info">{userData[current].level}</p>
          <p>
            &quot;
            {LEVELS[userData[current].level][1]}
            &quot;
          </p>
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

export default InfoDetails;
