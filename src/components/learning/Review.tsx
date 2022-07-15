import React, {
  useState, FormEvent, ReactElement, useRef,
} from 'react';

import AxiosErrorObj from 'axios-error';

import {
  Button,
  Typography,
  Grid,
  Input,
  InputLabel,
  TextField,
} from '@material-ui/core';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';

import {
  MainInt, UserInt, MainCharacterInt, MainWordInt, UserCharacterInt, SessionInt,
} from '../../interfaces';
import { similarity, editDistance } from '../../assets/levenshtein_distance';
import { toneChecker } from '../../assets/tones';
import LEVELS from '../../assets/levels';
import './Review.css';

interface ReviewProps {
  mainData: MainInt,
  userData: UserInt,
  reviewData: string[],
  sessionData: SessionInt,
  uploadReviewResults: (character: string, object: UserCharacterInt) => AxiosErrorObj,
  updateMemonic: (character: string, object: UserCharacterInt) => AxiosErrorObj,
  checkForLevelAdvancement: () => void,
  switchSession: () => void,
  uploadAnswer: (word: string, correct: boolean) => any,
}

const Review: React.FC<ReviewProps> = (props): ReactElement => {
  // randomizes the sequence
  const shuffleArray = (sourceArray: string[]): string[] => {
    const newArray = [...sourceArray];
    if (newArray.length > 1) {
      for (let i = newArray.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    }
    return newArray;
  };
  const [shuffledDeck] = useState(shuffleArray(props.reviewData));

  // current character being tested
  const [current, setCurrent] = useState(shuffledDeck[0]);

  const [mainData, setMainData] = useState<
  {[key: string]: MainCharacterInt} | {[key: string]: MainWordInt}
  >(
    Object.keys(props.mainData.characters).includes(current)
      ? props.mainData.characters
      : props.mainData.words,
  );
  const [userData, setUserData] = useState<{[key: string]: UserCharacterInt}>(
    Object.keys(props.mainData.characters).includes(current)
      ? props.userData.characters
      : props.userData.words,
  );

  const [error, setError] = useState('');

  // how many time an answer was given to this particular character so far
  const [savedTries, setSavedTries] = useState(0);
  // solution is currently submitted for judgement
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  // solution submitted is correct
  const [solutionCorrect, setSolutionCorrect] = useState(false);
  // Displays new level after solution submit
  const [newLevel, setNewLevel] = useState(0);
  // user input
  const [meanInput, setMeaning] = useState('');
  const [readInput, setReading] = useState('');

  const [lastPract, setLastPract] = useState(userData[current].lastPract);

  const meanInputRef = useRef<HTMLInputElement>(null);
  const readInputRef = useRef<HTMLInputElement>(null);

  // statistics about the success rate so far
  const correctNum = props.sessionData.correctList.length;
  const incorrectNum = props.sessionData.incorrectList.length;
  const remaningNum = props.sessionData.remainingList.length;

  // memonic data that is changeable by the user
  const [changeMemonic, setChangeMemonic] = useState(false);
  const [meaningMemonic, setMeaningMemonic] = useState(userData[current].memoMean);
  const [readingMemonic, setReadingMemonic] = useState(userData[current].memoRead);

  const switchChangeMemonics = async () => {
    if (changeMemonic) {
      // updates memonic in the database
      const object = {
        lastPract,
        level: newLevel,
        memoMean: meaningMemonic,
        memoRead: readingMemonic,
      };

      const resultError = await props.updateMemonic(current, object);

      if (resultError) {
        setError(resultError.message);
      } else {
        setError('');
        setChangeMemonic(!changeMemonic);
      }
    } else {
      setChangeMemonic(!changeMemonic);
    }
  };

  const resetOnSolutionAccepted = () => {
    const next = shuffledDeck[shuffledDeck.indexOf(current) + 1];
    if (next === undefined) {
      props.switchSession();
    } else if (Object.keys(props.mainData.characters).includes(next)) {
      setMainData(props.mainData.characters);
      setUserData(props.userData.characters);
      setMeaningMemonic(props.userData.characters[next].memoMean);
      setReadingMemonic(props.userData.characters[next].memoRead);
    } else {
      setMainData(props.mainData.words);
      setUserData(props.userData.words);
      setMeaningMemonic(props.userData.words[next].memoMean);
      setReadingMemonic(props.userData.words[next].memoRead);
    }
    setCurrent(next);
    setChangeMemonic(false);
    setSavedTries(0);
    setSolutionCorrect(false);
    setNewLevel(0);
  };

  const isMeaningCorrect = (): number => {
    let correct = 0; // 0: incorrect, 1: partially correct, 2: completely correct

    const formattedMeanInput = meanInput.trim().split(' ').filter((e) => e !== 'to').join(' ');

    for (let i = 0; i < 3; i += 1) { // loop through possible correct solutions from DB
      // use levensthein method to check
      const editDist = editDistance(mainData[current].english[i], formattedMeanInput);
      const similar = similarity(mainData[current].english[i], formattedMeanInput);
      // check if input and data difference are inside tolerance
      if ((formattedMeanInput.length > 1 && (editDist < 2 || similar > 0.75))
    || mainData[current].english[i] === formattedMeanInput) {
        correct += 1;
        if (mainData[current].english[i] === formattedMeanInput) {
          correct += 1;
        }
      }
    }
    return correct;
  };

  const isReadingCorrect = (): number => {
    let correct = 0; // 0: incorrect, 1: partially correct, 2: completely correct

    const formattedReadInput = readInput.trim();

    // remove tone from input in order to compare
    const readingInputFlat = toneChecker(formattedReadInput)[0];
    const toneInput = toneChecker(formattedReadInput)[1];
    // have to turn into an array in case we have an array as data
    const toneInputArray = Array(5).fill('');
    toneInputArray.splice(0, toneInput.length, ...toneInput.split(''));
    // remove tone from solution in order to compare
    const readDataFlat = toneChecker(mainData[current].pinyin)[0];
    // check if reading is correct without tone
    if (readDataFlat === readingInputFlat) {
      correct += 1;
      // check if tone is also correct
      if (mainData[current].tone instanceof Array) {
        if (JSON.stringify(mainData[current].tone) === JSON.stringify(toneInputArray)) {
          correct += 1;
        }
      } else if (mainData[current].tone === toneInput) {
        correct += 1;
      }
    }
    return correct;
  };

  const checkForCharacterAdvancement = (
    userCharObject: UserCharacterInt,
    meaningCorrect: number,
    readingCorrect: number,
  ) => {
    const charObject = userCharObject;

    // user will always advance to level 1, regardless of performance
    if (userCharObject.level === 0) {
      charObject.level = 1;
    }

    // If solution correct
    if (meaningCorrect > 0 && readingCorrect > 0) {
      charObject.level += 1;

      // Char is now guru, so check advancement
      if (userCharObject.level === 5) {
        props.checkForLevelAdvancement();
      }
    } else if (userCharObject.level in [5, 6]) {
      // From Guru fall back to Apprentice
      charObject.level = 4;
    } else if (userCharObject.level in [7, 8]) {
      // From Master and Enlightened, fall back to Guru
      charObject.level = 6;
    }

    return charObject;
  };

  // runs when answer is initially submitted
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const meaningCorrect = isMeaningCorrect();
    const readingCorrect = isReadingCorrect();

    const currentTime = new Date().getTime();

    // creates a new object to upload new information
    let userCharObject: UserCharacterInt = {
      lastPract: currentTime,
      level: userData[current].level,
      memoMean: userData[current].memoMean,
      memoRead: userData[current].memoRead,
    };

    if (newLevel !== 0) {
      userCharObject.level = newLevel;
    }

    // We only check advancement on the first try
    if (savedTries === 0) {
      userCharObject = checkForCharacterAdvancement(userCharObject, meaningCorrect, readingCorrect);
    }

    // refresh database with results
    const resultError = await props.uploadReviewResults(current, userCharObject);

    if (resultError) {
      setError(resultError.message);
    } else {
      setError('');
      if (meaningCorrect > 0 && readingCorrect > 0) {
        props.uploadAnswer(current, true);
        setSolutionCorrect(true);
        // Then set new level to display
        setNewLevel(userCharObject.level);
      } else {
        props.uploadAnswer(current, false);
      }

      // this is needed so we can advance to the next step
      setSolutionSubmitted(true);

      // color input boxes depending on result
      if (meanInputRef.current && readInputRef.current) {
        const statusColors = ['red', 'orange', 'green'];
        meanInputRef.current.disabled = true;
        readInputRef.current.disabled = true;
        meanInputRef.current.style.color = statusColors[meaningCorrect];
        readInputRef.current.style.color = statusColors[readingCorrect];
      }

      setSavedTries(savedTries + 1);
      setLastPract(currentTime);
      (document.getElementById('board-submit-button') as HTMLInputElement).focus();
    }
  };

  // this runs when user was given the results and wants to continue
  const handleContinue = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (meanInputRef.current && readInputRef.current) {
      meanInputRef.current.style.color = 'black';
      readInputRef.current.style.color = 'black';
      meanInputRef.current.disabled = false;
      readInputRef.current.disabled = false;
    }

    if (solutionCorrect) {
      resetOnSolutionAccepted();
    }
    setMeaning('');
    setReading('');
    (document.getElementById('meaning-input') as HTMLInputElement).focus();
    setSolutionSubmitted(false);
  };

  return (
    <div className="card">
      <form
        id="submit-button-form"
        autoComplete="off"
        onSubmit={solutionSubmitted ? handleContinue : handleSubmit}
      >
        <Grid container direction="column" spacing={3}>
          <Grid item container direction="row" justify="space-around" spacing={1}>
            <Grid item xs={12} sm={4}>
              <Typography>
                {`Remanining: ${remaningNum}`}
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography>
                {`Correct: ${correctNum} - `}
                {correctNum + incorrectNum > 0
                  ? Math.round((correctNum / (correctNum + incorrectNum)) * 100) : 0}
                %
              </Typography>
            </Grid>
            <Grid item xs={6} sm={4}>
              <Typography>
                {`Incorrect: ${incorrectNum} - `}
                {correctNum + incorrectNum > 0
                  ? Math.round((incorrectNum / (correctNum + incorrectNum)) * 100) : 0}
                %
              </Typography>
            </Grid>
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

          <Grid id="new-level" item container justify="center">
            {newLevel
              ? (
                <Grid item>
                  <Typography
                    variant="h6"
                    style={solutionCorrect && savedTries === 1 ? { color: 'green' } : { color: 'red' }}
                  >
                    {LEVELS[newLevel][2]}
                    {solutionCorrect && savedTries === 1
                      ? <KeyboardArrowUpIcon />
                      : <KeyboardArrowDownIcon />}
                  </Typography>
                </Grid>
              )
              : null}
          </Grid>

          <Grid item container direction="row" spacing={1} alignItems="flex-start">
            <Grid item container xs={6}>
              <Grid item>
                <InputLabel
                  id="meaning-label"
                  form="submit-button-form"
                  htmlFor="meaning-input"
                >
                  {`Meaning: `}
                </InputLabel>
              </Grid>
              <Grid item>
                <Input
                  ref={meanInputRef}
                  id="meaning-input"
                  type="text"
                  name="meaning"
                  value={meanInput}
                  onChange={(event) => setMeaning(event.target.value)}
                />
                {solutionSubmitted
                  ? (
                    <Typography id="meaning-solution">
                      {mainData[current].english.filter(
                        (x) => typeof x === 'string' && x.length > 0,
                      )
                        .join(', ')}
                    </Typography>
                  )
                  : null}
              </Grid>
            </Grid>

            <Grid item container xs={6}>
              <Grid item>
                <InputLabel
                  id="reading-label"
                  form="submit-button-form"
                  htmlFor="reading-input-box"
                >
                  {`Reading: `}
                </InputLabel>
              </Grid>
              <Grid item>
                <Input
                  ref={readInputRef}
                  id="reading-input"
                  type="text"
                  name="reading"
                  value={readInput}
                  onChange={(event) => setReading(event.target.value)}
                />
                {solutionSubmitted
                  ? (
                    <Typography id="reading-solution">
                      {mainData[current].pinyin}
                      &nbsp;
                      (tone:
                      {mainData[current].tone}
                      )
                    </Typography>
                  )
                  : null}
              </Grid>
            </Grid>
          </Grid>

          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <Typography variant="h6" color="error">{error}</Typography>
          </Grid>

          <Grid
            className="margin-top-15"
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                size="large"
                type="submit"
                id="board-submit-button"
                disabled={meanInput === '' || readInput === '' || changeMemonic}
              >
                {!solutionSubmitted ? 'Submit' : solutionCorrect ? 'Continue' : 'Again'}
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={props.switchSession}
              >
                Summary
              </Button>
            </Grid>
          </Grid>

          {!solutionSubmitted ? null : (
            <Grid id="memonics" item container spacing={3} justify="space-evenly" alignItems="center">
              <Grid item xs={12} sm={5}>
                <TextField
                  type="text"
                  label="Meaning memonic"
                  variant="outlined"
                  multiline
                  fullWidth
                  disabled={!changeMemonic}
                  value={meaningMemonic}
                  onChange={(event) => setMeaningMemonic(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  type="text"
                  label="Reading memonic"
                  variant="outlined"
                  multiline
                  fullWidth
                  disabled={!changeMemonic}
                  value={readingMemonic}
                  onChange={(event) => setReadingMemonic(event.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2} container justify="center">
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={switchChangeMemonics}
                >
                  {changeMemonic ? 'Save' : 'Change'}
                </Button>
              </Grid>
            </Grid>
          )}
        </Grid>
      </form>
    </div>
  );
};

export default Review;
