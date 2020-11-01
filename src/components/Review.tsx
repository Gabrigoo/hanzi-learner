import React, { useState } from 'react';
import Character from './Character';
import './Review.css';
import { similarity, editDistance } from '../assets/levenshtein_distance';
import { flattenPinyin } from '../assets/tones';

interface MainCharacterInt {
    chineseSimp: string,
    chineseTrad: string,
    english: string[],
    pinyin: string,
    stage: number,
    tone: string,
  }

interface UserCharacterInt {
  lastPract: number,
  level: number,
  memoMean: string,
  memoRead: string,
}

interface ReviewProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
  },
  userData: {
      characters: {
        [key: string]: UserCharacterInt,
      },
      profileData: {
        currentStage: number
      }
    };
  reviewData: string[];
  uploadReviewResults: (character: string, object: UserCharacterInt) => void,
  mainMenu: () => void,
}

const Review: React.FC<ReviewProps> = (props) => {
  const mainData = props.mainData.characters;
  const userData = props.userData.characters;
  // randomizes the sequence
  const [shuffledDeck] = useState(shuffle(props.reviewData));
  // current character being tested
  const [current, setCurrent] = useState(shuffledDeck[0]);
  // how many time an answer was given to this particular character so far
  const [tries, setTries] = useState(0);
  // solution is currently submitted for judgement
  const [solutionSubmitted, setSolutionSubmitted] = useState(false);
  // solution submitted is correct
  const [solutionCorrect, setSolutionCorrect] = useState(false);
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

  // handle input
  const handleChange = (event: any) => {
    const { name, value }: { name: string, value: string } = event.currentTarget;

    switch (name) {
      case 'meaning':
        setMeaning(value);
        break;
      case 'reading':
        setReading(value);
        break;
      case 'meaning-memo':
        setNewMeaningMemonic(value);
        break;
      case 'reading-memo':
        setNewReadingMemonic(value);
        break;
      default:
        break;
    }
  };

  // finishes current session
  const goToSummary = ():void => {
    setCurrent('undefined');
  };
  // shuffles deck in the beginning
  function shuffle(sourceArray: string[]): string[] {
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
  const handleSubmit = (event: any): void => {
    event.preventDefault();

    if (meanInput === '' || readInput === '') {
      // do nothing
    } else if (solutionSubmitted) {
      handleContinue(event);
    } else { // evaluates the given answer and displays results
      (document.getElementById('meaning-input-box') as HTMLInputElement).disabled = true;
      (document.getElementById('reading-input-box') as HTMLInputElement).disabled = true;

      setTries(tries + 1);

      let meanCorrect = 0; // 0: incorrect, 1: partially correct, 2: completely correct
      let readCorrect = 0;

      // check if meaning is correct first
      for (let i = 0; i < 3; i += 1) { // loop through possible correct solutions from DB
        // use levensthein method to check
        const editDist = editDistance(mainData[current].english[i], meanInput);
        const similar = similarity(mainData[current].english[i], meanInput);
        // check if input and data difference are inside tolerance
        if (meanInput.length > 1 && (editDist < 2 || similar > 0.75)) {
          meanCorrect += 1;
          if (mainData[current].english[i] === meanInput) {
            meanCorrect += 1;
          }
        }
      }

      // then check reading
      let toneInput = '5';
      let readingInputFlat:string;
      // check if user marked tone at the end
      if ((!Number.isNaN(readInput.slice(-1)))
          && parseInt(readInput.slice(-1), 10) < 6
          && parseInt(readInput.slice(-1), 10) > 0) {
        readingInputFlat = readInput.substring(0, readInput.length - 1);
        toneInput = readInput.split('').splice(-1)[0];
      } else { // else check if tone is in character
        readingInputFlat = flattenPinyin(readInput)[0];
        toneInput = flattenPinyin(readInput)[1];
      }
      // remove tone from solution in order to compare
      const readDataFlat = flattenPinyin(mainData[current].pinyin)[0];
      // check if reading is correct without tone
      if (readDataFlat === readingInputFlat) {
        readCorrect += 1;
        // check if tone is also correct
        if (mainData[current].tone === toneInput) {
          readCorrect += 1;
        }
      }

      if (meanCorrect > 0 && readCorrect > 0) {
        setSolutionCorrect(true);
      }
      // color input boxes depending on result
      switch (meanCorrect) {
        case 0:
          (document.getElementById('meaning-input-box') as HTMLInputElement).style.backgroundColor = 'red';
          break;
        case 1:
          (document.getElementById('meaning-input-box') as HTMLInputElement).style.backgroundColor = 'yellow';
          break;
        default:
          (document.getElementById('meaning-input-box') as HTMLInputElement).style.backgroundColor = 'green';
          break;
      }
      switch (readCorrect) {
        case 0:
          (document.getElementById('reading-input-box') as HTMLInputElement).style.backgroundColor = 'red';
          break;
        case 1:
          (document.getElementById('reading-input-box') as HTMLInputElement).style.backgroundColor = 'yellow';
          break;
        default:
          (document.getElementById('reading-input-box') as HTMLInputElement).style.backgroundColor = 'green';
          break;
      }
      // this is needed so we can advance to the next step
      setSolutionSubmitted(true);
      (document.getElementById('board-submit-button') as HTMLButtonElement).focus();
    }
  };
    // this runs when user was given the results and wants to continue
  const handleContinue = (event: any): void => {
    event.preventDefault();

    (document.getElementById('meaning-input-box') as HTMLInputElement).style.backgroundColor = 'white';
    (document.getElementById('reading-input-box') as HTMLInputElement).style.backgroundColor = 'white';
    (document.getElementById('meaning-input-box') as HTMLInputElement).disabled = false;
    (document.getElementById('reading-input-box') as HTMLInputElement).disabled = false;

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
      if (tries === 1) { // correct solution on first try, advance level
        userCharObject.level += 1;
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
      // refresh database with results
      props.uploadReviewResults(current, userCharObject);

      // resets most things
      setChangeMemonic(false);
      setNewReadingMemonic('');
      setNewMeaningMemonic('');
      // advances to next character
      setCurrent(shuffledDeck[shuffledDeck.indexOf(current) + 1]);
      setTries(0);
      setRemainingNum(remaningNum - 1);
    }
    setSolutionSubmitted(false);
    setSolutionCorrect(false);
    setMeaning('');
    setReading('');

    (document.getElementById('meaning-input-box') as HTMLInputElement).focus();
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
                <Character
                  mainData={props.mainData}
                  userData={props.userData}
                  character={item}
                  value="true"
                  key={item + index}
                />
              ))}
          </div>
          <p id="incorrect-label">Incorrect:</p>
          <div className="mapping-div" id="incorrect-map">
            {inCorrectList.length === 0 ? 'No items'
              : inCorrectList.map((item, index) => (
                <Character
                  mainData={props.mainData}
                  userData={props.userData}
                  character={item}
                  value="false"
                  key={item + index}
                />
              ))}
          </div>
          <button
            id="main-menu-button"
            className="standard-button"
            onClick={props.mainMenu}
          >
            Back to Main
          </button>
        </div>
      </div>
    );
    // else review next character
  }
  return (
    <div>
      <div className="card" id="review-card">
        <div id="summary-flex">
          <button
            id="summary-button"
            className="standard-button"
            onClick={goToSummary}
          >
            Summary
          </button>
        </div>
        <p id="chinese-simplified-label">Simplified:</p>
        <h2 id="chinese-simplified">{mainData[current].chineseSimp}</h2>
        <h1 id="chinese-traditional">{mainData[current].chineseTrad}</h1>
        <p id="correct">
          Correct:
          {' '}
          {correctNum}
          {' '}
          -
          {' '}
          {correctNum + incorrectNum > 0
            ? Math.round((correctNum / (correctNum + incorrectNum)) * 100) : 0}
          %
        </p>
        <p id="incorrect">
          Incorrect:
          {' '}
          {incorrectNum}
          {' '}
          -
          {' '}
          {correctNum + incorrectNum > 0
            ? Math.round((incorrectNum / (correctNum + incorrectNum)) * 100) : 0}
          %
        </p>
        <p id="remaining">
          Remanining:
          {' '}
          {remaningNum}
        </p>
        <label
          id="meaning-input-box-label"
          form="submit-button-form"
          htmlFor="meaning-input-box"
        >
          Meaning:
        </label>
        <input
          id="meaning-input-box"
          form="submit-button-form"
          type="text"
          name="meaning"
          value={meanInput}
          onChange={handleChange}
        />
        <label
          id="reading-input-box-label"
          form="submit-button-form"
          htmlFor="reading-input-box-label"
        >
          Reading:
        </label>
        <input
          id="reading-input-box"
          form="submit-button-form"
          type="text"
          name="reading"
          value={readInput}
          onChange={handleChange}
        />
        <form
          id="submit-button-form"
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <input
            id="board-submit-button"
            className="standard-button"
            type="submit"
            value={solutionSubmitted ? 'Continue' : 'Submit'}
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
              {mainData[current].pinyin}
              {' '}
              (tone:
              {mainData[current].tone}
              )
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
                    onChange={handleChange}
                  />
                  <textarea
                    id="reading-memonic-input"
                    className="memonic-textarea"
                    name="reading-memo"
                    value={newReadingMemonic}
                    onChange={handleChange}
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