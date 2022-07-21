import React, {
  useState, FormEvent, ReactElement,
} from 'react';
import AxiosErrorObj from 'axios-error';

import {
  Button,
  Typography,
  Grid,
  TextField,
} from '@material-ui/core';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import Strip from '../Strip';
import './Learning.css';

interface LearningProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
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
    <div className="card">
      <form
        id="continue-button-form"
        autoComplete="off"
        onSubmit={handleContinue}
      >
        <Grid container direction="column" spacing={3}>

          <Grid item xs={12} sm={4}>
            <Typography>
              {`Remanining: ${remaningNum}`}
            </Typography>
          </Grid>

          <Grid item xs={10} sm={12}>
            <Typography
              variant="h2"
              id="chinese-traditional"
            >
              {mainData[current].chineseTrad}
            </Typography>
          </Grid>

          <Grid id="simply-label" item container direction="row" alignItems="center" spacing={2}>
            <Grid item>
              <Typography id="chinese-simplified-label">Simplified:</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h5" id="chinese-simplified">{mainData[current].chineseSimp}</Typography>
            </Grid>
          </Grid>

          <Grid item container direction="row" spacing={1} alignItems="flex-start">
            <Grid item container direction="row" xs={6} alignItems="center" spacing={1}>
              <Grid item>
                <Typography>Meaning:</Typography>
              </Grid>
              <Grid item>
                <Typography id="meaning-show">
                  {mainData[current].english.filter(
                    (x: string) => x.length > 0,
                  )
                    .join(', ')}
                </Typography>
              </Grid>
            </Grid>
            <Grid item container direction="row" xs={6} alignItems="center" spacing={1}>
              <Grid item>
                <Typography>Reading:</Typography>
              </Grid>
              <Grid item>
                <Typography id="reading-show">
                  {mainData[current].pinyin}
                  &nbsp;
                  (tone:
                  &nbsp;
                  {mainData[current].tone}
                  )
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Typography variant="h6" color="error">{error}</Typography>
          </Grid>

          <Grid
            className="margin-top-15"
            item
            container
            justifyContent="center"
            alignItems="center"
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              type="submit"
              id="learn-continue-button"
            >
              Continue
            </Button>
          </Grid>

          <Grid item container spacing={3} justifyContent="space-evenly" alignItems="center">
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Meaning memonic"
                variant="outlined"
                multiline
                fullWidth
                value={meaningMemonic}
                onChange={(event) => setMeaningMemonic(event.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                type="text"
                label="Reading memonic"
                variant="outlined"
                multiline
                fullWidth
                value={readingMemonic}
                onChange={(event) => setReadingMemonic(event.target.value)}
              />
            </Grid>
          </Grid>

        </Grid>
      </form>
    </div>
  );
};

export default Learning;
