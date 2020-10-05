import React, { useState } from 'react';
import axios from '../axios-instance';
import './Learn.css';
import history from '../history';

const Learn = (props) => {

    const [remaningNum, setRemainingNum] = useState(props.newKeys.length)
    const [current, setCurrent] = useState(props.newKeys[0])

    const [meaningMemonic, setMeaningMemonic] = useState("");
    const [readingMemonic, setReadingMemonic] = useState("");

    const handleContinue = (event) => {
        event.preventDefault();

        axios.put("/" + props.userId + "/characters/" + current + ".json?auth=" + props.token,
        {
            lastPract: new Date(),
            level : 0,
            memoMean: meaningMemonic,
            memoRead: readingMemonic
        })
        .then(() => {
            setCurrent(props.newKeys[props.newKeys.indexOf(current) + 1])
            setMeaningMemonic("");
            setReadingMemonic("");
            setRemainingNum(remaningNum - 1);
            console.log("PUT: new data uploaded")
        }
        ).catch((error) => console.error("Error uploading new data: " + error))
        .finally(() => {
            if (remaningNum === 0) {
                history.push(`/learn`)
            }
        })
    }

    const handleChange = (event) => {
        const {name, value} = event.currentTarget;
  
        switch(name) {
            case "meaning":
                setMeaningMemonic(value);
                break;
            case "reading":
                setReadingMemonic(value);
                break;
            default:
                break;
        }
      }
    
    if ((typeof props.data[current] === 'undefined')) {
        return (
            <div></div>
        )
    } else {
        return (
            <div className="card" id="learn-card">
                <p id ="chinese-simplified-label">Simplified:</p>
                <h3 id="chinese-simplified">{props.data[current].chineseSimp}</h3>
                <h1 id ="chinese-traditional">{props.data[current].chineseTrad}</h1>
                <p id="remaining">Remanining:{' '}{remaningNum}</p>
                <p id="meaning-label">Meaning:</p>
                <p id="reading-label">Reading:</p>
                <form
                    id="continue-button-form" 
                    autoComplete="off" 
                    onSubmit={handleContinue}>
                        <input id="learn-continue-button" 
                        className="board-button" 
                        type="submit" 
                        value="Continue" />
                </form>
                <p id="meaning-learn">
                    {props.data[current].english.filter(
                        x => typeof x === 'string' && x.length > 0)
                    .join(", ")}</p>
                <label 
                    id="meaning-memonic-learn-label"
                    form="continue-button-form" 
                    htmlFor="meaning-memonic"
                    >Meaning memonic:
                </label>
                <textarea 
                    id="meaning-memonic-learn"
                    className="memonic-textarea"
                    form="continue-button-form" 
                    type="text"
                    name="meaning" 
                    value={meaningMemonic} 
                    onChange={handleChange}>
                </textarea>
                <p id="reading-learn">
                    {props.data[current].pinyin} (tone: {props.data[current].tone})
                </p>
                <label 
                    id="reading-memonic-learn-label"
                    form="continue-button-form" 
                    htmlFor="reading-memonic"
                    >Reading memonic:
                </label>
                <textarea 
                    id="reading-memonic-learn"
                    className="memonic-textarea"
                    form="continue-button-form" 
                    type="text"
                    name="reading"
                    value={readingMemonic}
                    onChange={handleChange}>
                </textarea>
            </div>
        );
    }
};

export default Learn;