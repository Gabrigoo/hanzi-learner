import React, {
  useState, FormEvent, ReactElement,
} from 'react';
import { Link } from 'react-router-dom';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../interfaces';
import { similarity, editDistance } from '../assets/levenshtein_distance';
import { toneChecker } from '../assets/tones';
import InfoTag from './info/InfoTag';
import './Review.css';

interface ReviewProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  userData: {
      characters: {
        [key: string]: UserCharacterInt,
      },
      words: {
        [key: string]: UserCharacterInt,
      },
      profileData: {
        currentStage: number
      }
    };
  reviewData: string[];
  uploadReviewResults: (character: string, object: UserCharacterInt) => void,
  checkForAdvancement: () => void,
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
  // statistics about the success rate so far
  const [correctNum, setCorrectNum] = useState(0);
  const [incorrectNum, setIncorrectNum] = useState(0);
  const [remaningNum, setRemainingNum] = useState(shuffledDeck.length);
  // arrays with correct and incorrect tries
  const [correctList, setCorrectList] = useState<string[]>([]);
  const [inCorrectList, setIncorrectList] = useState<string[]>([]);
  // memonic data that is changeable by the user
  const [changeMemonic, setChangeMemonic] = useState(false);
  const [newMeaningMemonic, setNewMeaningMemonic] = useState('');
  const [newReadingMemonic, setNewReadingMemonic] = useState('');

  // finishes current session
  const goToSummary = () => {
    setCurrent('undefined');
  };
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
  // runs when asnwer is initially submitted
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (meanInput === '' || readInput === '') {
      // do nothing
    } else { // evaluates the given answer and displays results
      (document.getElementById('meaning-input') as HTMLInputElement).disabled = true;
      (document.getElementById('reading-input') as HTMLInputElement).disabled = true;

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

      if (meanCorrect > 0 && readCorrect > 0) {
        setSolutionCorrect(true);
      }
      // color input boxes depending on result
      switch (meanCorrect) {
        case 0:
          (document.getElementById('meaning-input') as HTMLInputElement).style.backgroundColor = 'red';
          break;
        case 1:
          (document.getElementById('meaning-input') as HTMLInputElement).style.backgroundColor = 'yellow';
          break;
        default:
          (document.getElementById('meaning-input') as HTMLInputElement).style.backgroundColor = 'green';
          break;
      }
      switch (readCorrect) {
        case 0:
          (document.getElementById('reading-input') as HTMLInputElement).style.backgroundColor = 'red';
          break;
        case 1:
          (document.getElementById('reading-input') as HTMLInputElement).style.backgroundColor = 'yellow';
          break;
        default:
          (document.getElementById('reading-input') as HTMLInputElement).style.backgroundColor = 'green';
          break;
      }
      // this is needed so we can advance to the next step
      setSolutionSubmitted(true);
      (document.getElementById('board-submit-button') as HTMLButtonElement).focus();
    }
  };
    // this runs when user was given the results and wants to continue
  const handleContinue = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    (document.getElementById('meaning-input') as HTMLInputElement).style.backgroundColor = 'white';
    (document.getElementById('reading-input') as HTMLInputElement).style.backgroundColor = 'white';
    (document.getElementById('meaning-input') as HTMLInputElement).disabled = false;
    (document.getElementById('reading-input') as HTMLInputElement).disabled = false;

    // this is only activates when the user finally gets it right (regardless of number of tries)
    if (solutionCorrect) {
      // creates a new object to upload new information
      const userCharObject: UserCharacterInt = {
        lastPract: new Date().getTime(),
        level: userData[current].level,
        memoMean: userData[current].memoMean,
        memoRead: userData[current].memoRead,
      };
      // if memonic was modified, save it
      if (changeMemonic) {
        userCharObject.memoMean = newMeaningMemonic;
        userCharObject.memoRead = newReadingMemonic;
      }
      // user will always advance to level 1, regardless of performance
      if (userCharObject.level === 0) {
        userCharObject.level = 1;
      }
      if (tries === 1) { // correct solution on first try, advance level
        userCharObject.level += 1;
        // char is now guru, so check advancement
        if (userCharObject.level === 5) {
          props.checkForAdvancement();
        }
        setCorrectNum(correctNum + 1);
        setCorrectList(correctList.concat(current));
      } else { // solution was correct but not at first try, fall back some levels
        // from Guru fall back to Apprentice
        if (userCharObject.level === 5 || userCharObject.level === 6) {
          userCharObject.level = 4;
          // from Master and Enlightened, fall back to Guru
        } else if (userCharObject.level === 7 || userCharObject.level === 8) {
          userCharObject.level = 6;
        }
        setIncorrectNum(incorrectNum + 1);
        setIncorrectList(inCorrectList.concat(current));
      }
      setNewLevel(userCharObject.level);
      // refresh database with results
      props.uploadReviewResults(current, userCharObject);
      // resets most things
      setChangeMemonic(false);
      setNewReadingMemonic('');
      setNewMeaningMemonic('');
      // advances to next character
      const next = shuffledDeck[shuffledDeck.indexOf(current) + 1];
      if (Object.keys(props.mainData.characters).includes(next)) {
        setMainData(props.mainData.characters);
        setUserData(props.userData.characters);
      } else {
        setMainData(props.mainData.words);
        setUserData(props.userData.words);
      }
      setCurrent(next);
      setTries(0);
      setRemainingNum(remaningNum - 1);
    }
    setSolutionSubmitted(false);
    setSolutionCorrect(false);
    setMeaning('');
    setReading('');

    (document.getElementById('meaning-input') as HTMLInputElement).focus();
  };

  // go into summary when no characters left to review
  if (typeof mainData[current] === 'undefined') {
    return (
      <div>
        <div className="card" id="summary-card">
          <p id="correct-label">Correct:</p>
          <div className="mapping-div" id="correct-map">
            {correctList.length === 0 ? 'No items'
              : correctList.map((item, index) => (
                <InfoTag
                  mainData={props.mainData}
                  userData={props.userData}
                  word={item}
                  value="true"
                  key={item + index}
                />
              ))}
          </div>
          <p id="incorrect-label">Incorrect:</p>
          <div className="mapping-div" id="incorrect-map">
            {inCorrectList.length === 0 ? 'No items'
              : inCorrectList.map((item, index) => (
                <InfoTag
                  mainData={props.mainData}
                  userData={props.userData}
                  word={item}
                  value="false"
                  key={item + index}
                />
              ))}
          </div>
          <Link
            to="/main"
            id="main-menu-button"
            className="standard-button"
          >
            Back to Main
          </Link>
        </div>
      </div>
    );
    // else review next character
  }
  return (
    <div>
      <div className="card" id="review-card">
        <button
          id="summary-button"
          className="standard-button"
          onClick={goToSummary}
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
          id="reading-input"
          form="submit-button-form"
          type="text"
          name="reading"
          value={readInput}
          onChange={(event) => setReading(event.target.value)}
        />
        <p id="new-level">{solutionSubmitted ? newLevel : ''}</p>
        <form
          id="submit-button-form"
          autoComplete="off"
          onSubmit={solutionSubmitted ? handleContinue : handleSubmit}
        >
          <input
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
