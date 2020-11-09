import React, {
  useState, ChangeEvent, FormEvent, ReactElement,
} from 'react';
import './Learn.css';
import Strip from './Strip';

interface MainCharacterInt {
  chineseSimp: string,
  chineseTrad: string,
  english: string[],
  pinyin: string,
  stage: number,
  tone: string,
}

interface MainWordInt {
  chineseSimp: string[],
  chineseTrad: string[],
  english: string[],
  pinyin: string[],
  stage: number,
  tone: string[],
}

interface UserCharacterInt {
  lastPract: number,
  level: number,
  memoMean: string,
  memoRead: string,
}

interface LearnProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  newKeys: string[],
  putUserNewCharacter: (character: string, object: UserCharacterInt) => void,
  putUserNewWord: (word: string, object: UserCharacterInt) => void,
}

const Learn: React.FC<LearnProps> = (props): ReactElement => {
  // starts with first element of to-learn list
  const [current, setCurrent] = useState(props.newKeys[0]);
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
  const [remaningNum, setRemainingNum] = useState(props.newKeys.length);
  // on continue uploads new character to use DB and continue to next one
  const handleContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newObj = {
      lastPract: new Date().getTime(),
      level: 0,
      memoMean: meaningMemonic,
      memoRead: readingMemonic,
    };
    if (Object.keys(props.mainData.characters).includes(current)) {
      props.putUserNewCharacter(current, newObj);
    } else {
      props.putUserNewWord(current, newObj);
    }
    const next = props.newKeys[props.newKeys.indexOf(current) + 1];
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

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value }: { name: string, value: string} = event.currentTarget;

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
        onChange={handleChange}
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
        onChange={handleChange}
      />
    </div>
  );
};

export default Learn;
