import React, {
  useState, FormEvent, ReactElement,
} from 'react';
import AxiosErrorObj from 'axios-error';

import {
  Button,
  Typography,
  TextField,
  Stack,
  Container,
} from '@mui/material';

import {
  MainCharacterInt, MainInt, MainWordInt, UserCharacterInt,
} from '../../interfaces';
import Strip from '../Strip';

interface LearningProps {
  mainData: MainInt,
  newItemKeys: string[],
  learnNewWord: (word: string, object: UserCharacterInt) => AxiosErrorObj,
}

const Learning: React.FC<LearningProps> = (props): ReactElement => {
  // starts with first element of to-learn list
  const [current, setCurrent] = useState(props.newItemKeys[0]);
  const [mainData, setMainData] = useState<
  {[key: string]: MainCharacterInt} | {[key: string]: MainWordInt}
  >(
    Object.keys(props.mainData.characters).includes(current)
      ? props.mainData.characters
      : props.mainData.words,
  );

  const [error, setError] = useState('');

  // memonics in case they are changed
  const [meaningMemonic, setMeaningMemonic] = useState('');
  const [readingMemonic, setReadingMemonic] = useState('');
  const [remaningNum, setRemainingNum] = useState(props.newItemKeys.length);

  // on continue uploads new character to use DB and continue to next one
  const handleContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newObj = {
      lastPract: new Date().getTime(),
      level: 0,
      memoMean: meaningMemonic,
      memoRead: readingMemonic,
    };

    const resultError = await props.learnNewWord(current, newObj);
    if (resultError) {
      setError(resultError.message);
    } else {
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
    }
  };

  if (remaningNum === 0) {
    return (
      <Strip message="No new characters to learn right now" timeout={4000} />
    );
  }
  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <form autoComplete="off" onSubmit={handleContinue}>
        <Stack spacing={2}>
          <Typography variant="h5">{`Remanining: ${remaningNum}`}</Typography>

          <Typography
            variant="h2"
            id="chinese-traditional"
          >
            {mainData[current].chineseTrad}
          </Typography>

          <Typography variant="h4">
            Simplified:
            {' '}
            {mainData[current].chineseSimp}
          </Typography>

          <Typography variant="h5">
            {`Meaning: ${mainData[current].english.filter((x) => x.length).join(', ')}`}
          </Typography>

          <Typography variant="h5">
            Reading:
            {' '}
            {mainData[current].pinyin}
            {' '}
            (tone:
            {mainData[current].tone}
            )
          </Typography>

          <Typography variant="h5" align="center" color="error">{error}</Typography>

          <TextField
            label="Meaning memonic"
            minRows="2"
            variant="outlined"
            multiline
            fullWidth
            value={meaningMemonic}
            onChange={(event) => setMeaningMemonic(event.target.value)}
          />
          <TextField
            label="Reading memonic"
            minRows="2"
            variant="outlined"
            autoFocus
            multiline
            fullWidth
            value={readingMemonic}
            onChange={(event) => setReadingMemonic(event.target.value)}
          />

          <Button
            autoFocus
            variant="contained"
            size="large"
            type="submit"
          >
            Continue
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default Learning;
