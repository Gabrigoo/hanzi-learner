import React, {
  useState, FormEvent, ReactElement, useRef, useEffect,
} from 'react';

import AxiosErrorObj from 'axios-error';

import {
  Button,
  Typography,
  Input,
  InputLabel,
  TextField,
  Container,
  Stack,
  IconButton,
  Box,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import {
  MainInt, UserInt, MainCharacterInt, MainWordInt, UserCharacterInt, SessionInt,
} from '../../interfaces';
import { similarity, editDistance } from '../../assets/levenshtein_distance';
import { toneChecker } from '../../assets/tones';
import LEVELS from '../../assets/levels';
import './Review.css';
import NavButton from '../partials/NavButton';

interface ReviewProps {
  mainData: MainInt,
  userData: UserInt,
  reviewData: string[],
  sessionData: SessionInt,
  uploadReviewResults: (character: string, object: UserCharacterInt) => AxiosErrorObj,
  updateMemonic: (character: string, object: UserCharacterInt) => AxiosErrorObj,
  checkForLevelAdvancement: () => void,
  beginSession: () => void,
  uploadAnswer: (word: string, correct: boolean) => any,
}

const Review: React.FC<ReviewProps> = (props): ReactElement => {
  useEffect(() => {
    props.beginSession();
  }, []);

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
      console.log('TODO: Should navigate back to summary if no next item');
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
    correct = (correct > 2) ? 2 : correct;
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
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <form
        autoComplete="off"
        onSubmit={solutionSubmitted ? handleContinue : handleSubmit}
      >
        <Stack spacing={3}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5">
              {`Remanining: ${remaningNum}`}
            </Typography>
            <Typography variant="h5">
              {`Correct: ${correctNum} - `}
              {correctNum + incorrectNum > 0
                ? Math.round((correctNum / (correctNum + incorrectNum)) * 100) : 0}
              %
            </Typography>
            <Typography variant="h5">
              {`Incorrect: ${incorrectNum} - `}
              {correctNum + incorrectNum > 0
                ? Math.round((incorrectNum / (correctNum + incorrectNum)) * 100) : 0}
              %
            </Typography>
          </Box>

          <Typography
            variant="h2"
            id="chinese-traditional"
          >
            {mainData[current].chineseTrad}
          </Typography>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5">
              Simplified:
              {' '}
              {mainData[current].chineseSimp}
            </Typography>

            {newLevel ? (
              <Typography
                sx={{ mr: 16 }}
                variant="h6"
                style={solutionCorrect && savedTries === 1 ? { color: 'green' } : { color: 'red' }}
              >
                {LEVELS[newLevel][2]}
                {solutionCorrect && savedTries === 1
                  ? <KeyboardArrowUpIcon />
                  : <KeyboardArrowDownIcon />}
              </Typography>
            ) : null}
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Box sx={{ width: '45%' }}>
              <InputLabel
                sx={{ fontSize: '20px' }}
                id="meaning-label"
                htmlFor="meaning-input"
              >
                {`Meaning: `}
              </InputLabel>
              <Input
                sx={{ fontSize: '20px' }}
                ref={meanInputRef}
                id="meaning-input"
                name="meaning"
                fullWidth
                value={meanInput}
                onChange={(event) => setMeaning(event.target.value)}
              />
              {solutionSubmitted
                ? (
                  <Typography sx={{ fontSize: '18px' }}>
                    {mainData[current].english.filter((x) => typeof x === 'string' && x.length > 0).join(', ')}
                  </Typography>
                ) : null}
            </Box>

            <Box sx={{ width: '45%' }}>
              <InputLabel
                sx={{ fontSize: '20px' }}
                id="reading-label"
                htmlFor="reading-input-box"
              >
                {`Reading: `}
              </InputLabel>
              <Input
                sx={{ fontSize: '20px' }}
                ref={readInputRef}
                id="reading-input"
                name="reading"
                fullWidth
                value={readInput}
                onChange={(event) => setReading(event.target.value)}
              />
              {solutionSubmitted ? (
                <Typography sx={{ fontSize: '18px' }}>
                  {mainData[current].pinyin}
                  {' '}
                  (tone:
                  {' '}
                  {mainData[current].tone}
                  )
                </Typography>
              ) : null}
            </Box>
          </Box>

          <Typography variant="h5" align="center" color="error">{error}</Typography>

          <Button
            variant="contained"
            size="large"
            type="submit"
            id="board-submit-button"
            disabled={meanInput === '' || readInput === '' || changeMemonic}
          >
            {!solutionSubmitted ? 'Submit' : solutionCorrect ? 'Continue' : 'Again'}
          </Button>

          {solutionSubmitted ? (
            <Box display="flex" justifyContent="space-between" alignItems="center" gap="10px">
              <TextField
                label="Meaning memonic"
                variant="outlined"
                multiline
                minRows="2"
                fullWidth
                disabled={!changeMemonic}
                value={meaningMemonic}
                onChange={(event) => setMeaningMemonic(event.target.value)}
              />
              <IconButton
                color="primary"
                aria-label={changeMemonic ? 'save-memonics' : 'change-memonics'}
                size="large"
                sx={{ height: '60px' }}
                onClick={switchChangeMemonics}
              >
                {changeMemonic
                  ? <SaveIcon sx={{ fontSize: 40 }} />
                  : <EditIcon sx={{ fontSize: 40 }} />}
              </IconButton>
              <TextField
                label="Reading memonic"
                variant="outlined"
                multiline
                minRows="2"
                fullWidth
                disabled={!changeMemonic}
                value={readingMemonic}
                onChange={(event) => setReadingMemonic(event.target.value)}
              />
            </Box>
          ) : null}

          <Box display="flex" justifyContent="end">
            <NavButton
              color="info"
              variant="outlined"
              title="Summary"
              to="/summary"
            />
          </Box>

        </Stack>
      </form>
    </Container>
  );
};

export default Review;
