import React, { useState } from 'react';
import Character from './Character';
import history from '../history';
import './Review.css';
import axios from '../axios-instance';
import { similarity, editDistance } from '../assets/levenshtein_distance';
import { TONES, NEUTRAL_TONES } from '../assets/tones';

const Review = (props) => {
    //randomizes the sequence
    const [shuffledDeck] = useState(shuffle(Object.keys(props.reviewData)));
    //current character being tested
    const [current, setCurrent] = useState(shuffledDeck[0]);
    //how many time an answer was given to this particular character so far
    const [tries, setTries] = useState(0);
    //solution is currently submitted for judgement
    const [solutionSubmitted, setSolutionSubmitted] = useState(false);
    //solution submitted is correct
    const [solutionCorrect, setSolutionCorrect] = useState(false);
    //user input
    const [meanInput, setMeaning] = useState("");
    const [readInput, setReading] = useState("");
    //statistics about the success rate so far
    const [correctNum, setCorrectNum] = useState(0);
    const [incorrectNum, setIncorrectNum] = useState(0);
    const [remaningNum, setRemainingNum] = useState(shuffledDeck.length);
    //arrays with correct and incorrect tries
    const [correctList, setCorrectList] = useState([]);
    const [inCorrectList, setIncorrectList] = useState([]);
    //memonic data that is changeable by the user
    const [changeMemonic, setChangeMemonic] = useState(false);
    const [newMeaningMemonic, setNewMeaningMemonic] = useState("");
    const [newReadingMemonic, setNewReadingMemonic] = useState("");

    //handle input
    const handleChange = (event) => {
        const {name, value} = event.currentTarget;

        switch(name) {
            case "meaning":
                setMeaning(value);
                break;
            case "reading":
                setReading(value);
                break;
            case "meaning-memo":
                setNewMeaningMemonic(value);
                break;
            case "reading-memo":
                setNewReadingMemonic(value);
                break;
            default:
                break;
        }
    }
    const mainMenu = () => {
        history.push(`/main`);
    }
    //finishes current session
    const goToSummary = () => {
      setCurrent('undefined')
    }
    //shuffles deck in the beginning
    function shuffle(sourceArray) {
        if (sourceArray.length > 1) {
            for (var i = 0; i < sourceArray.length - 1; i++) {
                var j = i + Math.floor(Math.random() * (sourceArray.length - i));
                var temp = sourceArray[j];
                sourceArray[j] = sourceArray[i];
                sourceArray[i] = temp;
            }
        }
        return sourceArray;
    }
    const switchChangeMemonics = () => {
        setChangeMemonic(true);
        setNewReadingMemonic(props.reviewData[current].memoMean);
        setNewReadingMemonic(props.reviewData[current].memoRead);
    }
    //runs when asnwer is initially submitted
    const handleSubmit = (event) => {
        event.preventDefault();

        if (meanInput === "" || readInput === "") {
          // do nothing
        } else if (solutionSubmitted) {
          handleContinue(event);
        } else { // evaluates the given answer and displays results

            document.getElementById("meaning-input-box").disabled = true;
            document.getElementById("reading-input-box").disabled = true;

            setTries(tries + 1)

            let meanCorrect = 0; // 0: incorrect, 1: partially correct, 2: completely correct
            let readCorrect = 0;
            
            // check if meaning is correct first
            for (let i = 0; i < 3; i++ ) {                       // loop through possible correct solutions from DB
                // use levensthein method to check
                let editDist = editDistance(props.data[current].english[i], meanInput)   
                let similar = similarity(props.data[current].english[i], meanInput) 
                // check if input and data difference are inside tolerance
                if (meanInput.length > 1 && (editDist < 2 || similar > 0.75)) { 
                    meanCorrect++;
                    if (props.data[current].english[i] === meanInput) {
                        meanCorrect++;
                    }
                }
            }

            // then check reading
            let toneInput = "5";
            let readingInputFlat = ""
            //check if user marked tone at the end
            if ((!isNaN(readInput.slice(-1))) && readInput.slice(-1) < 6 && readInput.slice(-1) > 0) { 
                toneInput = readInput.split("").splice(-1)[0];
                readingInputFlat = readInput.substring(0, readInput.length - 1);
            } else {    // else check if tone is in character                                                                
                readingInputFlat = readInput.toLowerCase().split("").map(char => {
                    for (let i = 1; i < 5; i++) {
                        if (TONES[i].includes(char)) {
                          toneInput = i.toString();
                          return NEUTRAL_TONES[i][TONES[i].indexOf(char)]; 
                        }}
                    return char;
                    }).join("");
            }
            // remove tone from solution in order to compare
            let readDataFlat = props.data[current].pinyin.split("").map(char => { 
                for (let i = 1; i < 5; i++) {
                    if (TONES[i].includes(char)) {
                      return NEUTRAL_TONES[i][TONES[i].indexOf(char)]; 
                    }}
                return char;
                }).join("");
            // check if reading is correct without tone
            if (readDataFlat === readingInputFlat) { 
                readCorrect++;
                // check if tone is also correct
                if (props.data[current].tone === toneInput) { 
                    readCorrect++;
                }
            }

            if (meanCorrect > 0 && readCorrect > 0) {
                setSolutionCorrect(true);
            }
            //color input boxes depending on result
            switch (meanCorrect) {
                case 0:
                    document.getElementById("meaning-input-box").style.backgroundColor = "red";
                    break;
                case 1:
                    document.getElementById("meaning-input-box").style.backgroundColor = "yellow";
                    break;
                default:
                    document.getElementById("meaning-input-box").style.backgroundColor = "green";
                    break;
            }
            switch (readCorrect) {
                case 0:
                    document.getElementById("reading-input-box").style.backgroundColor = "red";
                    break;
                case 1:
                    document.getElementById("reading-input-box").style.backgroundColor = "yellow";
                    break;
                default:
                    document.getElementById("reading-input-box").style.backgroundColor = "green";
                    break;
            }
            //this is needed so we can advance to the next step
            setSolutionSubmitted(true);
            document.getElementById("board-submit-button").focus();
        }
    }; 
    //this runs when user was given the results and wants to continue
    const handleContinue = (event) => {
        event.preventDefault();

        document.getElementById("meaning-input-box").style.backgroundColor = "white";
        document.getElementById("reading-input-box").style.backgroundColor = "white";
        document.getElementById("meaning-input-box").disabled = false;
        document.getElementById("reading-input-box").disabled = false;

        // this is only activates when the user finally gets it right (regardless of number of tries)
        if (solutionCorrect) {
            // creates a new object to upload new information
            let userCharObject = {
            lastPract: new Date(),
            level: props.reviewData[current].level,
            memoMean: props.reviewData[current].memoMean,
            memoRead: props.reviewData[current].memoRead,
            }
            // if memonic was modified, save it
            if (changeMemonic) {
                userCharObject.memoMean = newMeaningMemonic;
                userCharObject.memoRead = newReadingMemonic;
            }
            if (tries === 1) {  // correct solution on first try, advance level
                userCharObject.level = userCharObject.level + 1;
                setCorrectNum(correctNum + 1);
                setCorrectList(correctList.concat(current))
            } else { //solution was correct but not at first try, fall back some levels
                // from Guru fall back to Apprentice
                if (userCharObject.level === 5 || userCharObject.level === 6) {
                    userCharObject.level = 4;
                // from Master and Enlightened, fall back to Guru
                } else if (userCharObject.level === 7 || userCharObject.level === 8) {
                    userCharObject.level = 6;
                }
                setIncorrectNum(incorrectNum + 1);
                setIncorrectList(inCorrectList.concat(current))
            }
            //refresh database with results
            axios.put("/" + props.userId + "/characters/" + current + ".json?auth=" + props.currentUserToken, userCharObject)
            .then(() => console.log("PUT: upload to database"))
            .catch((error) => console.error("Error refreshing database: " + error));
            //resets most things
            setSolutionSubmitted(false);
            setSolutionCorrect(false);
            setChangeMemonic(false);
            setNewReadingMemonic("");
            setNewMeaningMemonic("");
            setMeaning("");
            setReading("");
            //advances to next character
            setCurrent(shuffledDeck[shuffledDeck.indexOf(current) + 1]);
            setTries(0);
            setRemainingNum(remaningNum - 1);
        }

        document.getElementById("meaning-input-box").focus();
    }
        // go into summary when no characters left to review
        if (typeof props.data[current] === 'undefined') {
            return (
            <div id="board">
                <div className="card" id="summary-card">
                    <p id="correct-label">Correct:</p>
                        <div className="mapping-div" id="correct-map">
                        {correctList.length === 0 ? "No items" :
                        correctList.map((item, index) => 
                        <Character
                            data={props.data}
                            character={item} 
                            value='true' 
                            key={item + index} />
                        )}
                        </div>
                    <p id="incorrect-label">Incorrect:</p>
                        <div className="mapping-div" id="incorrect-map">
                        {inCorrectList.length === 0 ? "No items" :
                        inCorrectList.map((item, index) => 
                        <Character
                            data={props.data}
                            character={item}
                            value='false' 
                            key={item + index} />
                        )}
                        </div>
                    <button 
                        id="main-menu-button" 
                        className="board-button" 
                        onClick={mainMenu}
                        >Back to Main
                    </button>
                </div>
            </div>
            )
        // else review next character
        } else {
            return (
                <div id="board">
                    <div className="card" id="review-card">
                        <button 
                            id="summary-button" 
                            className="board-button" 
                            onClick={goToSummary}
                            >Summary
                        </button>
                        <p id ="chinese-simplified-label">Simplified:</p>
                        <h2 id="chinese-simplified">{props.data[current].chineseSimp}</h2>
                        <h1 id ="chinese-traditional">{props.data[current].chineseTrad}</h1>
                        <p id="correct">Correct:{' '}
                            {correctNum} - {correctNum + incorrectNum > 0 ?
                            Math.round(correctNum / (correctNum + incorrectNum)*100) : 0}%
                        </p>
                        <p id="incorrect">Incorrect: {' '}
                            {incorrectNum} - {correctNum + incorrectNum > 0 ?
                            Math.round(incorrectNum / (correctNum + incorrectNum)*100) : 0}%
                        </p>
                        <p id="remaining">Remanining:{' '}{remaningNum}</p>
                        <label 
                            id="meaning-input-box-label" 
                            form="submit-button-form" 
                            htmlFor="meaning-input-box"
                            >Meaning:
                        </label>
                            <input 
                                id="meaning-input-box" 
                                form="submit-button-form" 
                                type="text" 
                                name="meaning" 
                                value={meanInput} 
                                onChange={handleChange}>
                            </input>
                        <label 
                            id="reading-input-box-label" 
                            form="submit-button-form" 
                            htmlFor="reading-input-box-label"
                            >Reading:
                        </label>
                            <input 
                                id="reading-input-box" 
                                form="submit-button-form" 
                                type="text" 
                                name="reading" 
                                value={readInput} 
                                onChange={handleChange}>
                            </input>
                        <form 
                            id="submit-button-form" 
                            autoComplete="off" 
                            onSubmit={handleSubmit}>
                                <input id="board-submit-button" 
                                className="board-button" 
                                type="submit" 
                                value={solutionSubmitted ? "Continue" : "Submit"} />
                        </form>
                        {!solutionSubmitted ? "" :
                            <>
                            <p id="meaning-solution">
                                {props.data[current].english.filter(
                                    x => typeof x === 'string' && x.length > 0)
                                .join(", ")}</p>
                            <p id="reading-solution">
                                {props.data[current].pinyin} (tone: {props.data[current].tone})
                            </p>
                            <label
                                id="meaning-memonic-label"
                                htmlFor="meaning-memonic-input"
                                >Meaning memonic:
                            </label>
                            <label
                                id="reading-memonic-label"
                                htmlFor="reading-memonic-input"
                                >Reading memonic:
                            </label>
                            {changeMemonic ?
                                <>
                                    <textarea 
                                        id="meaning-memonic-input"
                                        className="memonic-textarea"
                                        type="text"
                                        name="meaning-memo"
                                        value={newMeaningMemonic} 
                                        onChange={handleChange}>
                                    </textarea>
                                    <textarea 
                                        id="reading-memonic-input"
                                        className="memonic-textarea"
                                        type="text"
                                        name="reading-memo"
                                        value={newReadingMemonic} 
                                        onChange={handleChange}>
                                    </textarea>
                                </>  
                                :
                                <>
                                    <button
                                        id="change-memo-button" 
                                        className="board-button" 
                                        onClick={switchChangeMemonics}
                                        >Change memonics
                                    </button>
                                    <p id="meaning-memonic" className="memonic">
                                        {props.reviewData[current].memoMean === "" ?
                                        "Currently no meaning memonic added" :
                                        props.reviewData[current].memoMean}
                                    </p>
                                    <p id="reading-memonic" className="memonic">
                                        {props.reviewData[current].memoRead === "" ?
                                        "Currently no reading memonic added" :
                                        props.reviewData[current].memoRead}
                                    </p>
                                </>
                            }
                            </>
                        }
                    </div>
                </div>
            );
        }
  };

export default Review;

