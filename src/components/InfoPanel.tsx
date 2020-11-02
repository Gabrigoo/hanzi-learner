import React, { useState, ChangeEvent, ReactElement } from 'react';
import './InfoPanel.css';
import LEVELS from '../assets/levels';

interface MainCharacterInt {
  chineseSimp: string,
  chineseTrad: string,
  english: string[],
  pinyin: string,
  stage: number,
  tone: string,
}

interface UserCharacterInt {
  lastPract: number,
  level: number,
  memoMean: string,
  memoRead: string,
}

interface InfoPanelProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
  },
  userData: {
    characters: {
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
  // getting character the panel is supposed to display
  const current = props.id;
  const mainData = props.mainData.characters;
  const userData = props.userData.characters;
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
  // convert JSON date into the displayed date
  // const dateToString = (jason:string) => {
  //   const date = new Date(jason);
  //   const year = date.getFullYear();
  //   let currentMonth:string = (date.getMonth() + 1).toString();
  //   let currentDay:string = (date.getDate()).toString();
  //   const hours = date.getHours();
  //   const minutes = date.getMinutes();
  //   if (parseInt(currentMonth, 10) < 10) { currentMonth = `0${currentMonth}`; }
  //   if (parseInt(currentDay, 10) < 10) { currentDay = `0${currentDay}`; }

  //   return `${year}/${currentMonth}/${currentDay} ${hours}:${minutes}`;
  // };

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
          <p>{userData[current].lastPract}</p>
        </div>
        <div className="horiz-div">
          <p className="margin-right-30">User level:</p>
          {' '}
          <p className="read-info">{userData[current].level}</p>
          <p>
            &quot;
            {LEVELS[userData[current].level.toString()][1]}
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
