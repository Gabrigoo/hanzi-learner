import React, {
  useState, useEffect, ChangeEvent, FormEvent, ReactElement, MouseEvent,
} from 'react';
import './Addition.css';
import { MainCharacterInt, MainWordInt } from '../interfaces';
import { TONES } from '../assets/tones';

interface AdditionProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  uploadNewCharacter: (character: string, object: MainCharacterInt) => void,
  uploadNewWord: (word: string, object: MainWordInt) => void,
}

const Addition: React.FC<AdditionProps> = (props): ReactElement => {
  // states for user input
  const [chineseTrad, setChineseTrad] = useState<string[]>(Array(5).fill(''));
  const [chineseSimp, setChineseSimp] = useState<string[]>(Array(5).fill(''));
  const [english, setEnglish] = useState<string[]>(Array(3).fill(''));
  const [pinyin, setPinyin] = useState<string[]>(Array(5).fill(''));
  const [tone, setTone] = useState<string[]>(Array(5).fill(''));
  const [stage, setStage] = useState('');

  // import data in order to check if entry exists
  const [dataKeys, setDataKeys] = useState(
    Object.keys(props.mainData.characters).concat(Object.keys(props.mainData.words)),
  );
  // set if already existing entry should be overwritten or not
  const [overwrite, setOverwrite] = useState(false);
  // a message warning the user if character is already in db
  const [message, setMessage] = useState('');
  // a variable to follow which input system to use
  const [inputType, setInputType] = useState('Character');

  const changeInputType = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (inputType === 'Character') {
      setInputType('Word');
    } else {
      setInputType('Character');
    }
  };

  useEffect(() => {
    const currentString = chineseTrad.join('');
    if (dataKeys.includes(currentString) && chineseTrad[0] !== '') {
      setMessage('Character is already in database!');
    } else {
      setMessage('');
    }
  }, [dataKeys, chineseTrad]);

  // automatically checks the tone and fills tone input box
  const toneCheck = (input: string): string => {
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
  const autoFill = (origin: string, desired: string): string => {
    let output = '';
    if (Object.keys(props.mainData.characters).includes(origin)) {
      switch (desired) {
        case 'chineseSimp':
          output = props.mainData.characters[origin].chineseSimp;
          break;
        case 'pinyin':
          output = props.mainData.characters[origin].pinyin;
          break;
        case 'tone':
          output = props.mainData.characters[origin].tone;
          break;
        default:
          break;
      }
    }
    return output;
  };
  // handles state change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string, value: string } = event.currentTarget;
    switch (name) {
      case 'chineseTrad-1':
      case 'chineseTrad-2':
      case 'chineseTrad-3':
      case 'chineseTrad-4':
      case 'chineseTrad-5': {
        const arrIndex = parseInt(name.slice(-1), 10) - 1;
        setChineseTrad(Object.assign([], chineseTrad, { [arrIndex]: value }));
        setChineseSimp(Object.assign([], chineseSimp,
          { [arrIndex]: autoFill(value, 'chineseSimp') }));
        setPinyin(Object.assign([], pinyin,
          { [arrIndex]: autoFill(value, 'pinyin') }));
        setTone(Object.assign([], tone,
          { [arrIndex]: autoFill(value, 'tone') }));
        break;
      }
      case 'chineseSimp-1':
      case 'chineseSimp-2':
      case 'chineseSimp-3':
      case 'chineseSimp-4':
      case 'chineseSimp-5': {
        const arrIndex = parseInt(name.slice(-1), 10) - 1;
        setChineseSimp(Object.assign([], chineseSimp, { [arrIndex]: value }));
        break;
      }
      case 'pinyin-1':
      case 'pinyin-2':
      case 'pinyin-3':
      case 'pinyin-4':
      case 'pinyin-5': {
        const arrIndex = parseInt(name.slice(-1), 10) - 1;
        setPinyin(Object.assign([], pinyin, { [arrIndex]: value }));
        setTone(Object.assign([], tone, { [arrIndex]: toneCheck(value) }));
        break;
      }
      case 'tone-1':
      case 'tone-2':
      case 'tone-3':
      case 'tone-4':
      case 'tone-5': {
        const arrIndex = parseInt(name.slice(-1), 10) - 1;
        setTone(Object.assign([], tone, { [arrIndex]: value }));
        break;
      }
      case 'english-1':
      case 'english-2':
      case 'english-3': {
        const arrIndex = parseInt(name.slice(-1), 10) - 1;
        setEnglish(Object.assign([], english, { [arrIndex]: value }));
        break;
      }
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
    setChineseTrad(Array(5).fill(''));
    setChineseSimp(Array(5).fill(''));
    setEnglish(Array(3).fill(''));
    setPinyin(Array(5).fill(''));
    setTone(Array(5).fill(''));
    setStage('');
  };
  // handles uploading of character
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (chineseTrad[0] === '') {
      alert('Insert a valid character');
    } else if (chineseTrad[0].length > 1) {
      alert('For multiple characters, please input them separately in Word');
    } else if (!chineseSimp || !english[0] || !pinyin || !stage) {
      alert('Please fill all fields');
    } else if (dataKeys.includes(chineseTrad.join('')) && overwrite === false) {
      alert('Entry already exists');
    } else if (inputType === 'Character') {
      const newObj = {
        chineseTrad: chineseTrad[0].trim(),
        chineseSimp: chineseSimp[0].trim(),
        english: english.map((item) => item.toLocaleLowerCase().trim()),
        pinyin: pinyin[0].toLowerCase().trim(),
        stage: parseInt(stage, 10),
        tone: tone[0].trim(),
      };
      props.uploadNewCharacter(chineseTrad[0], newObj);
      setDataKeys(dataKeys.concat(chineseTrad));
      clearInput();
    } else {
      const newObj = {
        chineseTrad: chineseTrad.map((item) => item.trim()),
        chineseSimp: chineseSimp.map((item) => item.trim()),
        english: english.map((item) => item.toLocaleLowerCase().trim()),
        pinyin: pinyin.map((item) => item.toLocaleLowerCase().trim()),
        stage: parseInt(stage, 10),
        tone: tone.map((item) => item.trim()),
      };
      props.uploadNewWord(chineseTrad.join(''), newObj);
      // would be a datakeys concat here
      clearInput();
    }
  };

  return (
    <div>
      <form id="addition-grid-card" autoComplete="off" onSubmit={handleSubmit}>
        <div id="top-flex">
          <h1 className="add-h1">Add new entry:</h1>
          {inputType === 'Character'
            ? (
              <button id="button-character" className="standard-button" onClick={changeInputType}>
                Character
              </button>
            )
            : (
              <button id="button-word" className="standard-button" onClick={changeInputType}>
                Word
              </button>
            )}
        </div>
        <div id="add-message">
          {message}
        </div>
        <label>
          Traditional chinese:
          {inputType === 'Character' ? (
            <input
              className="hanzi-input"
              type="text"
              name="chineseTrad-1"
              value={chineseTrad[0]}
              onChange={handleChange}
            />
          )
            : (
              <div className="horizontal-flex-div">
                {Array(5).fill('').map((x, index: number) => (
                  <input
                    className="hanzi-input-short"
                    type="text"
                    name={`chineseTrad-${index + 1}`}
                    value={chineseTrad[index]}
                    onChange={handleChange}
                    key={x + index}
                  />
                ))}
              </div>
            )}
        </label>
        <label>
          Simplified chinese:
          {inputType === 'Character' ? (
            <input
              className="hanzi-input"
              type="text"
              name="chineseSimp-1"
              value={chineseSimp[0]}
              onChange={handleChange}
            />
          )
            : (
              <div className="horizontal-flex-div">
                {Array(5).fill('').map((x, index: number) => (
                  <input
                    className="hanzi-input-short"
                    type="text"
                    name={`chineseSimp-${index + 1}`}
                    value={chineseSimp[index]}
                    onChange={handleChange}
                    key={x + index}
                  />
                ))}
              </div>
            )}
        </label>
        <label>
          Pinyin:
          {inputType === 'Character' ? (
            <input
              className="hanzi-input"
              type="text"
              name="pinyin-1"
              value={pinyin[0]}
              onChange={handleChange}
            />
          )
            : (
              <div className="horizontal-flex-div">
                {Array(5).fill('').map((x, index: number) => (
                  <input
                    className="hanzi-input-short"
                    type="text"
                    name={`pinyin-${index + 1}`}
                    value={pinyin[index]}
                    onChange={handleChange}
                    key={x + index}
                  />
                ))}
              </div>
            )}
        </label>
        <label>
          Tone:
          {inputType === 'Character' ? (
            <input
              className="hanzi-input"
              type="text"
              name="tone-1"
              value={tone[0]}
              onChange={handleChange}
            />
          )
            : (
              <div className="horizontal-flex-div">
                {Array(5).fill('').map((x, index: number) => (
                  <input
                    className="hanzi-input-short"
                    type="text"
                    name={`tone-${index + 1}`}
                    value={tone[index]}
                    onChange={handleChange}
                    key={x + index}
                  />
                ))}
              </div>
            )}
        </label>
        <label>
          Meaning:
          {Array(3).fill('').map((x, index: number) => (
            <input
              className="margin-bottom-2"
              type="text"
              name={`english-${index + 1}`}
              value={english[index]}
              onChange={handleChange}
              key={x + index}
            />
          ))}
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
        <div className="bottom-flex">
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

export default Addition;
