import React, {
  useState, FormEvent, ReactElement, useRef, useLayoutEffect,
} from 'react';

import {
  MainInt, UserInt, MainCharacterInt, MainWordInt, UserCharacterInt, SessionInt,
} from '../interfaces';
import { similarity, editDistance } from '../assets/levenshtein_distance';
import { toneChecker } from '../assets/tones';
import LEVELS from '../assets/levels';
import './Review.css';

interface ReviewProps {
  mainData: MainInt,
  userData: UserInt,
  reviewData: string[],
  sessionData: SessionInt,
  uploadReviewResults: (character: string, object: UserCharacterInt) => void,
  checkForAdvancement: () => void,
  switchSession: () => void,
  uploadAnswer: (word: string, correct: boolean) => any,
}

const Review: React.FC<ReviewProps> = (props): ReactElement => {
  // randomizes the sequence
  const [shuffledDeck] = useState(shuffleDeck(props.reviewData));
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
  // how many time an answer was given to this particular character so far
  const [tries, setTries] = useState(0);
  // solution is currently submitted for judgement
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  // solution submitted is correct
  const [solutionCorrect, setSolutionCorrect] = useState(false);
  // Displays new level after solution submit
  const [newLevel, setNewLevel] = useState(0);
  // user input
  const [meanInput, setMeaning] = useState('');
  const [readInput, setReading] = useState('');

  const meanInputRef = useRef<HTMLInputElement>(null);
  const readInputRef = useRef<HTMLInputElement>(null);

  const submitButtonRef = useRef<HTMLInputElement>(null);
  useLayoutEffect(() => {
    if (submitButtonRef.current) {
      if (meanInput === '' || readInput === '') {
        submitButtonRef.current.disabled = true;
        submitButtonRef.current.style.filter = 'grayscale(100%)';
      } else {
        submitButtonRef.current.disabled = false;
        submitButtonRef.current.style.filter = 'none';
      }
    }
  });

  // statistics about the success rate so far
  const correctNum = props.sessionData.correctList.length;
  const incorrectNum = props.sessionData.incorrectList.length;
  const remaningNum = props.sessionData.remainingList.length;

  // memonic data that is changeable by the user
  const [changeMemonic, setChangeMemonic] = useState(false);
  const [newMeaningMemonic, setNewMeaningMemonic] = useState('');
  const [newReadingMemonic, setNewReadingMemonic] = useState('');

  // shuffles deck in the beginning
  function shuffleDeck(sourceArray: string[]): string[] {
    const newArray = [...sourceArray];
    if (newArray.length > 1) {
      for (let i = newArray.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    }
    return newArray;
  }
  const switchChangeMemonics = (): void => {
    setChangeMemonic(true);
    setNewMeaningMemonic(userData[current].memoMean);
    setNewReadingMemonic(userData[current].memoRead);
  };
  // runs when answer is initially submitted
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (meanInputRef.current && readInputRef.current) {
      meanInputRef.current.disabled = true;
      readInputRef.current.disabled = true;
    }
    setTries(tries + 1);

    let meanCorrect = 0; // 0: incorrect, 1: partially correct, 2: completely correct
    let readCorrect = 0;
    // remove accidental spaces
    const formattedMeanInput = meanInput.trim();
    const formattedReadInput = readInput.trim();

    // check if meaning is correct first
    for (let i = 0; i < 3; i += 1) { // loop through possible correct solutions from DB
      // use levensthein method to check
      const editDist = editDistance(mainData[current].english[i], formattedMeanInput);
      const similar = similarity(mainData[current].english[i], formattedMeanInput);
      // check if input and data difference are inside tolerance
      if ((formattedMeanInput.length > 1 && (editDist < 2 || similar > 0.75))
        || mainData[current].english[i] === formattedMeanInput) {
        meanCorrect += 1;
        if (mainData[current].english[i] === formattedMeanInput) {
          meanCorrect += 1;
        }
      }
    }
    // then check reading
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
      readCorrect += 1;
      // check if tone is also correct
      if (mainData[current].tone instanceof Array) {
        if (JSON.stringify(mainData[current].tone) === JSON.stringify(toneInputArray)) {
          readCorrect += 1;
        }
      } else if (mainData[current].tone === toneInput) {
        readCorrect += 1;
      }
    }
    // creates a new object to upload new information
    const userCharObject: UserCharacterInt = {
      lastPract: new Date().getTime(),
      level: userData[current].level,
      memoMean: userData[current].memoMean,
      memoRead: userData[current].memoRead,
    };
    if (newLevel !== 0) {
      userCharObject.level = newLevel;
    }
    // We only check advancement on the first try
    if (tries === 0) {
      // user will always advance to level 1, regardless of performance
      if (userCharObject.level === 0) {
        userCharObject.level = 1;
      }
      // If user gets it right
      if (meanCorrect > 0 && readCorrect > 0) {
        userCharObject.level += 1;
        props.uploadAnswer(current, true);
        // Char is now guru, so check advancement
        if (userCharObject.level === 5) {
          props.checkForAdvancement();
        }
        // If user gets it wrong
      } else {
        if (userCharObject.level === 5 || userCharObject.level === 6) {
          // From Guru fall back to Apprentice
          userCharObject.level = 4;
        } else if (userCharObject.level === 7 || userCharObject.level === 8) {
          // From Master and Enlightened, fall back to Guru
          userCharObject.level = 6;
        }
        props.uploadAnswer(current, false);
      }
    }
    if (meanCorrect > 0 && readCorrect > 0) {
      setSolutionCorrect(true);
      // Then set new level to display
      setNewLevel(userCharObject.level);
    }
    // refresh database with results
    props.uploadReviewResults(current, userCharObject);
    // this is needed so we can advance to the next step
    setSolutionSubmitted(true);
    // color input boxes depending on result
    if (meanInputRef.current && readInputRef.current) {
      switch (meanCorrect) {
        case 0:
          meanInputRef.current.style.backgroundColor = 'red';
          break;
        case 1:
          meanInputRef.current.style.backgroundColor = 'yellow';
          break;
        default:
          meanInputRef.current.style.backgroundColor = 'green';
          break;
      }
      switch (readCorrect) {
        case 0:
          readInputRef.current.style.backgroundColor = 'red';
          break;
        case 1:
          readInputRef.current.style.backgroundColor = 'yellow';
          break;
        default:
          readInputRef.current.style.backgroundColor = 'green';
          break;
      }
    }
    if (submitButtonRef.current) {
      submitButtonRef.current.focus();
    }
  };
    // this runs when user was given the results and wants to continue
  const handleContinue = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (meanInputRef.current && readInputRef.current) {
      meanInputRef.current.style.backgroundColor = 'white';
      readInputRef.current.style.backgroundColor = 'white';
      meanInputRef.current.disabled = false;
      readInputRef.current.disabled = false;
    }
    // if memonic was modified, save it
    if (changeMemonic) {
      // creates a new object to upload new information
      const userCharObject: UserCharacterInt = {
        lastPract: userData[current].lastPract,
        level: userData[current].level,
        memoMean: userData[current].memoMean,
        memoRead: userData[current].memoRead,
      };
      if (newLevel !== 0) {
        userCharObject.level = newLevel;
      }
      userCharObject.memoMean = newMeaningMemonic;
      userCharObject.memoRead = newReadingMemonic;
      props.uploadReviewResults(current, userCharObject);
    }
    // resets most things
    setChangeMemonic(false);
    setNewReadingMemonic('');
    setNewMeaningMemonic('');
    if (solutionCorrect) {
      const next = shuffledDeck[shuffledDeck.indexOf(current) + 1];
      if (Object.keys(props.mainData.characters).includes(next)) {
        setMainData(props.mainData.characters);
        setUserData(props.userData.characters);
      } else {
        setMainData(props.mainData.words);
        setUserData(props.userData.words);
      }
      if (next === undefined) {
        props.switchSession();
      }
      setCurrent(next);
      setTries(0);
      setSolutionCorrect(false);
      setNewLevel(0);
    }
    setMeaning('');
    setReading('');
    if (meanInputRef.current) {
      meanInputRef.current.focus();
    }
    setSolutionSubmitted(false);
  };

  return (
    <div>
      <div className="card" id="review-card">
        <button
          id="summary-button"
          className="standard-button"
          onClick={props.switchSession}
        >
          Summary
        </button>
        <p id="chinese-simplified-label">Simplified:</p>
        <h2 id="chinese-simplified">{mainData[current].chineseSimp}</h2>
        <h1 id="chinese-traditional">{mainData[current].chineseTrad}</h1>
        <p id="correct">
          {`Correct: ${correctNum} - `}
          {correctNum + incorrectNum > 0
            ? Math.round((correctNum / (correctNum + incorrectNum)) * 100) : 0}
          %
        </p>
        <p id="incorrect">
          {`Incorrect: ${incorrectNum} - `}
          {correctNum + incorrectNum > 0
            ? Math.round((incorrectNum / (correctNum + incorrectNum)) * 100) : 0}
          %
        </p>
        <p id="remaining">
          {`Remanining: ${remaningNum}`}
        </p>
        <label
          id="meaning-label"
          form="submit-button-form"
          htmlFor="meaning-input"
        >
          Meaning:
        </label>
        <input
          ref={meanInputRef}
          id="meaning-input"
          form="submit-button-form"
          type="text"
          name="meaning"
          value={meanInput}
          onChange={(event) => setMeaning(event.target.value)}
        />
        <label
          id="reading-label"
          form="submit-button-form"
          htmlFor="reading-input-box"
        >
          Reading:
        </label>
        <input
          ref={readInputRef}
          id="reading-input"
          form="submit-button-form"
          type="text"
          name="reading"
          value={readInput}
          onChange={(event) => setReading(event.target.value)}
        />
        {newLevel
          ? (
            <p
              id="new-level"
              style={solutionCorrect && tries === 1 ? { backgroundColor: 'green' } : { backgroundColor: 'red' }}
            >
              {LEVELS[newLevel][1].slice(0, -2)}
            </p>
          )
          : ''}
        <form
          id="submit-button-form"
          autoComplete="off"
          onSubmit={solutionSubmitted ? handleContinue : handleSubmit}
        >
          <input
            ref={submitButtonRef}
            id="board-submit-button"
            className="standard-button"
            type="submit"
            value={!solutionSubmitted ? 'Submit' : solutionCorrect ? 'Continue' : 'Again'}
          />
        </form>
        {!solutionSubmitted ? '' : (
          <>
            <p id="meaning-solution">
              {mainData[current].english.filter(
                (x) => typeof x === 'string' && x.length > 0,
              )
                .join(', ')}
            </p>
            <p id="reading-solution">
              {`${mainData[current].pinyin} (tone: ${mainData[current].tone})`}
            </p>
            <label
              id="meaning-memonic-label"
              htmlFor="meaning-memonic-input"
            >
              Meaning memonic:
            </label>
            <label
              id="reading-memonic-label"
              htmlFor="reading-memonic-input"
            >
              Reading memonic:
            </label>
            {changeMemonic
              ? (
                <>
                  <textarea
                    id="meaning-memonic-input"
                    className="memonic-textarea"
                    name="meaning-memo"
                    value={newMeaningMemonic}
                    onChange={(event) => setNewMeaningMemonic(event.target.value)}
                  />
                  <textarea
                    id="reading-memonic-input"
                    className="memonic-textarea"
                    name="reading-memo"
                    value={newReadingMemonic}
                    onChange={(event) => setNewReadingMemonic(event.target.value)}
                  />
                </>
              )
              : (
                <>
                  <button
                    id="change-memo-button-review"
                    className="standard-button"
                    onClick={switchChangeMemonics}
                  >
                    Change memonics
                  </button>
                  <p id="meaning-memonic" className="memonic">
                    {userData[current].memoMean === ''
                      ? 'Currently no meaning memonic added'
                      : userData[current].memoMean}
                  </p>
                  <p id="reading-memonic" className="memonic">
                    {userData[current].memoRead === ''
                      ? 'Currently no reading memonic added'
                      : userData[current].memoRead}
                  </p>
                </>
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default Review;
