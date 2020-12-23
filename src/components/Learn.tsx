import React, {
  useState, FormEvent, ReactElement,
} from 'react';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../interfaces';
import Strip from './Strip';
import './Learn.css';

interface LearnProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  newItemKeys: string[],
  learnNewWord: (word: string, object: UserCharacterInt) => void,
}

const Learn: React.FC<LearnProps> = (props): ReactElement => {
  // starts with first element of to-learn list
  const [current, setCurrent] = useState(props.newItemKeys[0]);
  const [mainData, setMainData] = useState<
  {[key: string]: MainCharacterInt} | {[key: string]: MainWordInt}
  >(
    Object.keys(props.mainData.characters).includes(current)
      ? props.mainData.characters
      : props.mainData.words,
  );

  // memonics in case they are changed
  const [meaningMemonic, setMeaningMemonic] = useState('');
  const [readingMemonic, setReadingMemonic] = useState('');
  const [remaningNum, setRemainingNum] = useState(props.newItemKeys.length);
  // on continue uploads new character to use DB and continue to next one
  const handleContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newObj = {
      lastPract: new Date().getTime(),
      level: 0,
      memoMean: meaningMemonic,
      memoRead: readingMemonic,
    };
    props.learnNewWord(current, newObj);
    const next = props.newItemKeys[props.newItemKeys.indexOf(current) + 1];
    setCurrent(next);
    if (Object.keys(props.mainData.characters).includes(next)) {
      setMainData(props.mainData.characters);
    } else {
      setMainData(props.mainData.words);
    }
    setMeaningMemonic('');
    setReadingMemonic('');
    setRemainingNum(remaningNum - 1);
  };

  if (remaningNum === 0) {
    return (
      <Strip message="No new characters to learn right now" timeout={4000} />
    );
  }
  return (
    <div className="card" id="learn-card">
      <p id="chinese-simplified-label">Simplified:</p>
      <h2 id="chinese-simplified">{mainData[current].chineseSimp}</h2>
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
      <p id="meaning-display">
        {mainData[current].english.filter(
          (x: string) => x.length > 0,
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
        name="meaning"
        value={meaningMemonic}
        onChange={(event) => setMeaningMemonic(event.target.value)}
      />
      <p id="reading-display">
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
        name="reading"
        value={readingMemonic}
        onChange={(event) => setReadingMemonic(event.target.value)}
      />
    </div>
  );
};

export default Learn;
