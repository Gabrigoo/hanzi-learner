import React, {
  useState, useEffect, ChangeEvent, FormEvent, ReactElement, MouseEvent,
} from 'react';

import {
  Button,
  Grid,
  Typography,
  InputLabel,
  Input,
} from '@material-ui/core';

import { MainCharacterInt, MainWordInt } from '../../interfaces';
import { TONES } from '../../assets/tones';
import './Addition.css';

interface AdditionProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  uploadNewWord: (character: string, object: MainCharacterInt | MainWordInt) => void,
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
  useEffect(() => {
    setDataKeys(Object.keys(props.mainData.characters).concat(Object.keys(props.mainData.words)));
  }, [props.mainData.characters, props.mainData.words]);

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
  // Checks if current input is already in database
  useEffect(() => {
    const currentString = chineseTrad.join('');
    if (dataKeys.includes(currentString) && chineseTrad[0] !== '') {
      setMessage('Character is already in database!');
    } else {
      setMessage('');
    }
  }, [dataKeys, chineseTrad]);

  // Automatically checks the tone and fills tone input box
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
  const autoFillField = (origin: string, desired: string): string => {
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
  // Handles state change
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string, value: string } = event.currentTarget;
    let arrIndex: number;
    switch (name.slice(0, -2)) {
      case 'chineseTrad':
        arrIndex = parseInt(name.slice(-1), 10) - 1;
        setChineseTrad(Object.assign([], chineseTrad, { [arrIndex]: value }));
        setChineseSimp(Object.assign(
          [],
          chineseSimp,
          { [arrIndex]: autoFillField(value, 'chineseSimp') },
        ));
        setPinyin(Object.assign(
          [],
          pinyin,
          { [arrIndex]: autoFillField(value, 'pinyin') },
        ));
        setTone(Object.assign(
          [],
          tone,
          { [arrIndex]: autoFillField(value, 'tone') },
        ));
        break;
      case 'chineseSimp':
        arrIndex = parseInt(name.slice(-1), 10) - 1;
        setChineseSimp(Object.assign([], chineseSimp, { [arrIndex]: value }));
        break;
      case 'pinyin':
        arrIndex = parseInt(name.slice(-1), 10) - 1;
        setPinyin(Object.assign([], pinyin, { [arrIndex]: value }));
        setTone(Object.assign([], tone, { [arrIndex]: toneCheck(value) }));
        break;
      case 'tone':
        arrIndex = parseInt(name.slice(-1), 10) - 1;
        setTone(Object.assign([], tone, { [arrIndex]: value }));
        break;
      case 'english':
        arrIndex = parseInt(name.slice(-1), 10) - 1;
        setEnglish(Object.assign([], english, { [arrIndex]: value }));
        break;
      case 'sta':
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
      // This is important, this is where the upload happens!
      props.uploadNewWord(chineseTrad[0], newObj);
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
      // This is important, this is where the upload happens!
      props.uploadNewWord(chineseTrad.join(''), newObj);
      clearInput();
    }
  };

  return (
    <div>
      <form id="addition-card" className="card" autoComplete="off" onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item container direction="row" justifyContent="space-between" alignItems="center">
            <Grid item xs={12} sm={7} container justifyContent="center">
              <Typography variant="h4">Add new entry:</Typography>
            </Grid>
            <Grid item xs={9} sm={5} container justifyContent="flex-end">
              <Button variant="contained" color="primary" onClick={changeInputType}>
                {inputType}
              </Button>
            </Grid>
          </Grid>
          <Grid item>
            <Typography color="error">
              {message}
            </Typography>
          </Grid>

          <Grid item>
            <InputLabel className="addition-label">
              <p>Traditional chinese:</p>
              {inputType === 'Character' ? (
                <Input
                  className="addition-input"
                  type="text"
                  name="chineseTrad-1"
                  value={chineseTrad[0]}
                  onChange={handleChange}
                />
              )
                : (
                  <div className="horizontal-flex-div">
                    {Array(5).fill('').map((x, index: number) => (
                      <Input
                        className="addition-input-short"
                        type="text"
                        name={`chineseTrad-${index + 1}`}
                        value={chineseTrad[index]}
                        onChange={handleChange}
                        key={x + index}
                      />
                    ))}
                  </div>
                )}
            </InputLabel>
            <InputLabel className="addition-label">
              <p>Simplified chinese:</p>
              {inputType === 'Character' ? (
                <Input
                  className="addition-input"
                  type="text"
                  name="chineseSimp-1"
                  value={chineseSimp[0]}
                  onChange={handleChange}
                />
              )
                : (
                  <div className="horizontal-flex-div">
                    {Array(5).fill('').map((x, index: number) => (
                      <Input
                        className="addition-input-short"
                        type="text"
                        name={`chineseSimp-${index + 1}`}
                        value={chineseSimp[index]}
                        onChange={handleChange}
                        key={x + index}
                      />
                    ))}
                  </div>
                )}
            </InputLabel>
            <InputLabel className="addition-label">
              <p>Pinyin:</p>
              {inputType === 'Character' ? (
                <Input
                  className="addition-input"
                  type="text"
                  name="pinyin-1"
                  value={pinyin[0]}
                  onChange={handleChange}
                />
              )
                : (
                  <div className="horizontal-flex-div">
                    {Array(5).fill('').map((x, index: number) => (
                      <Input
                        className="addition-input-short"
                        type="text"
                        name={`pinyin-${index + 1}`}
                        value={pinyin[index]}
                        onChange={handleChange}
                        key={x + index}
                      />
                    ))}
                  </div>
                )}
            </InputLabel>
            <InputLabel className="addition-label">
              <p>Tone:</p>
              {inputType === 'Character' ? (
                <Input
                  className="addition-input"
                  type="text"
                  name="tone-1"
                  value={tone[0]}
                  onChange={handleChange}
                />
              )
                : (
                  <div className="horizontal-flex-div">
                    {Array(5).fill('').map((x, index: number) => (
                      <Input
                        className="addition-input-short"
                        type="text"
                        name={`tone-${index + 1}`}
                        value={tone[index]}
                        onChange={handleChange}
                        key={x + index}
                      />
                    ))}
                  </div>
                )}
            </InputLabel>
            <InputLabel className="addition-label">
              <p>Meaning:</p>
              {Array(3).fill('').map((x, index: number) => (
                <Input
                  className="addition-input margin-bottom-2"
                  type="text"
                  name={`english-${index + 1}`}
                  value={english[index]}
                  onChange={handleChange}
                  key={x + index}
                />
              ))}
            </InputLabel>
            <InputLabel className="addition-label">
              <p>Stage:</p>
              <Input
                className="addition-input"
                type="text"
                name="stage"
                value={stage}
                onChange={handleChange}
              />
            </InputLabel>
          </Grid>

          <Grid item container direction="row" justifyContent="space-evenly" alignItems="center">
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Submit
              </Button>
            </Grid>
            <Grid item>
              <Button type="reset" variant="contained" color="secondary" onClick={clearInput}>
                Clear
              </Button>
            </Grid>
          </Grid>
          <Grid item container direction="row" justifyContent="center" alignItems="center" spacing={2}>
            <Grid item>
              <Typography>Overwrite:</Typography>
            </Grid>
            <Grid item>
              <label className="switch">
                <input onChange={switchOverwrite} type="checkbox" />
                <span className="slider round" />
              </label>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default Addition;
