import React, {
  useState, useEffect, ChangeEvent, FormEvent, ReactElement,
} from 'react';

import {
  Button,
  Box,
  FormControlLabel,
  Typography,
  InputLabel,
  Switch,
  Input,
  IconButton,
  Container,
  Stack,
} from '@mui/material';
import LoopIcon from '@mui/icons-material/Loop';

import AxiosErrorObj from 'axios-error';
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
  uploadNewWord: (character: string, object: MainCharacterInt | MainWordInt) => AxiosErrorObj,
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
  const [dataKeys, setDataKeys] = useState(['']);

  useEffect(() => {
    setDataKeys(Object.keys(props.mainData.characters).concat(Object.keys(props.mainData.words)));
  }, [props.mainData.characters, props.mainData.words]);

  // set if already existing entry should be overwritten or not
  const [overwrite, setOverwrite] = useState(false);

  // a warning to the user if character is already in db
  const [error, setError] = useState('');

  // a variable to follow which input system to use
  const [multiChar, setMultiChar] = useState(false);

  const toogleInputType = () => setMultiChar(!multiChar);

  // Checks if current input is already in database
  useEffect(() => {
    const currentString = chineseTrad.join('');
    if (dataKeys.includes(currentString) && chineseTrad[0] !== '') {
      setError('Character is already in database!');
    } else {
      setError('');
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

  const autoFillField = (origin: string, desired: 'chineseSimp' | 'pinyin' | 'tone'): string => {
    if (Object.keys(props.mainData.characters).includes(origin)) {
      return props.mainData.characters[origin][desired];
    }
    return '';
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
    } else if (!multiChar) {
      const newObj = {
        chineseTrad: chineseTrad[0].trim(),
        chineseSimp: chineseSimp[0].trim(),
        english: english.map((item) => item.toLocaleLowerCase().trim()),
        pinyin: pinyin[0].toLowerCase().trim(),
        stage: parseInt(stage, 10),
        tone: tone[0].trim(),
      };

      // This is important, this is where the upload happens!
      const resultError = props.uploadNewWord(chineseTrad[0], newObj);

      if (resultError) {
        setError(resultError.message);
      } else {
        clearInput();
      }
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
      const resultError = props.uploadNewWord(chineseTrad.join(''), newObj);

      if (resultError) {
        setError(resultError.message);
      } else {
        clearInput();
      }
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4 }}>
      <form autoComplete="off" onSubmit={handleSubmit}>
        <Stack spacing={2}>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h4">New entry:</Typography>

            <Button
              variant="contained"
              color={multiChar ? 'secondary' : 'primary'}
              sx={{ minWidth: '120px' }}
              onClick={toogleInputType}
            >
              {multiChar ? 'Word' : 'Character'}
            </Button>

            <IconButton aria-label="switch" size="large" sx={{ ml: '-50px' }} onClick={toogleInputType}>
              <LoopIcon />
            </IconButton>
          </Box>

          {error ? <Typography color="error">{error}</Typography> : null}

          <InputLabel>Traditional chinese:</InputLabel>
          {!multiChar ? (
            <Input
              className="addition-input"
              type="text"
              name="chineseTrad-1"
              value={chineseTrad[0]}
              onChange={handleChange}
            />
          )
            : (
              <Box display="flex" gap="3px">
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
              </Box>
            )}

          <InputLabel>Simplified chinese:</InputLabel>
          {!multiChar ? (
            <Input
              className="addition-input"
              type="text"
              name="chineseSimp-1"
              value={chineseSimp[0]}
              onChange={handleChange}
            />
          )
            : (
              <Box display="flex" gap="3px">
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
              </Box>
            )}

          <InputLabel>Pinyin:</InputLabel>
          {!multiChar ? (
            <Input
              className="addition-input"
              type="text"
              name="pinyin-1"
              value={pinyin[0]}
              onChange={handleChange}
            />
          )
            : (
              <Box display="flex" gap="3px">
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
              </Box>
            )}

          <InputLabel>Tone:</InputLabel>
          {!multiChar ? (
            <Input
              className="addition-input"
              type="text"
              name="tone-1"
              value={tone[0]}
              onChange={handleChange}
            />
          )
            : (
              <Box display="flex" gap="3px">
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
              </Box>
            )}

          <InputLabel>Meaning:</InputLabel>
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

          <InputLabel>Stage:</InputLabel>
          <Input
            className="addition-input"
            type="text"
            name="stage"
            value={stage}
            onChange={handleChange}
          />

          <Box display="flex" justifyContent="space-evenly">
            <Button variant="contained" size="large" type="submit">
              Submit
            </Button>
            <Button type="reset" variant="contained" color="warning" onClick={clearInput}>
              Clear
            </Button>
          </Box>

          <Box display="flex" justifyContent="center">
            <FormControlLabel
              label="Overwrite"
              control={
                <Switch color="warning" onChange={switchOverwrite} />
          }
            />
          </Box>

        </Stack>
      </form>
    </Container>
  );
};

export default Addition;
