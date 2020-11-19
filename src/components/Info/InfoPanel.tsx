import React, { useState, ChangeEvent, ReactElement } from 'react';
import './InfoPanel.css';
import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import InfoTag from './InfoTag';
import LEVELS from '../../assets/levels';

interface InfoPanelProps {
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
  putUserNewMemonic: (character: string, object: UserCharacterInt) => void,
}

const InfoPanel: React.FC<InfoPanelProps> = (props): ReactElement => {
  // getting data the panel is supposed to display
  const current = props.id;
  // getting type, character or word, setting currect datascources
  const type = Object.keys(props.mainData.characters).includes(current) ? 'Character' : 'Word';
  const mainData = (type === 'Character')
    ? props.mainData.characters : props.mainData.words;
  const userData = type === 'Character'
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
    props.putUserNewMemonic(current, object);
    setChangeMemonic(false);
  };

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value }: { name: string; value: string } = event.currentTarget;

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
        <p id="stage-count">
          Stage:
          {' '}
          {mainData[current].stage}
        </p>
      </div>
      <div className="horiz-div">
        <p className="margin-right-30">Meaning:</p>
        {mainData[current].english.map((word, index) => <p className="mean-info" key={word + index}>{word}</p>)}
      </div>

      <div className="horiz-div">
        <p className="margin-right-30">Reading:</p>
        <p className="read-info">
          {type === 'Character' ? mainData[current].pinyin : mainData[current].pinyin}
        </p>
        <p>{mainData[current].tone}</p>
      </div>
      {type === 'Word' ? (
        <>
          <div className="horiz-div">
            <p className="margin-right-30">Components:</p>
            {current.split('').map((item, index) => (
              <InfoTag
                mainData={props.mainData}
                userData={props.userData}
                character={item}
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
                  character={item}
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
                onChange={handleChange}
              />
              <p>Reading memonic:</p>
              <textarea
                id="reading-memonic-input"
                className="memo-info"
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

export default InfoPanel;
