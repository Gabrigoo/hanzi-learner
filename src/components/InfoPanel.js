import React, { useState } from 'react';
import './InfoPanel.css';
import levels from '../assets/levels';

const InfoPanel = (props) => {

    const id = props.id;

    const [changeMemonic, setChangeMemonic] = useState(false);
    const [meaningMemonic, setMeaningMemonic] = useState("");
    const [readingMemonic, setReadingMemonic] = useState("");

    const switchChangeMemonics = () => {
        setChangeMemonic(true);
        if (meaningMemonic === "") {
            setMeaningMemonic(props.characters[id].memoMean);
        }
        if (readingMemonic === "") {
            setReadingMemonic(props.characters[id].memoRead);
        }
    }

    const sendMemonic = () => {
        let object = {
            lastPract: props.characters[id].lastPract,
            level: props.characters[id].level,
            memoMean: meaningMemonic,
            memoRead: readingMemonic,
        }
        props.putUserNewMemonic(id, object);
        setChangeMemonic(false);
    }

    const handleChange = (event) => {
        const {name, value} = event.currentTarget;

        switch(name) {
            case "meaning-memo":
                setMeaningMemonic(value);
                break;
            case "reading-memo":
                setReadingMemonic(value);
                break;
            default:
                break;
        }
    }

    const dateToString = (jason) => {
        let date = new Date(jason);
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (month < 10) {month= '0' + month};
        if (day < 10) {day= '0' + day};
        
        return year + "/" + month + "/" + day + " " + hours + ":" + minutes;
    }

    let content;
    let userContent = "This character is not yet learned.";

    content = <>
            <h1 id="chinese-trad-info">{id}</h1>
            <h2 id="chinese-simp-info">{props.data[id].chineseSimp}</h2>
            <div className="horiz-div">
                <p>Stage:</p>
                <p>{props.data[id].stage}</p>
            </div>
            <p>Meaning:</p>
            <div className="horiz-div">
                {props.data[id].english.map((word, index) => <p className="mean-info" key={word+index}>{word}</p>)}
            </div>
            <p>Reading:</p>
            <div className="horiz-div">
                <p className="read-info">{props.data[id].pinyin}</p>
                <p>{props.data[id].tone}</p>
            </div>
        </>
    if (props.characters[id]) {
        userContent = 
        <>
            {changeMemonic ?
                <>
                    <p>Meaning memonic:</p>
                    <textarea 
                        id="meaning-memonic-input"
                        className="memonic-textarea"
                        type="text"
                        name="meaning-memo"
                        value={meaningMemonic}
                        onChange={handleChange}>
                    </textarea>
                    <p>Reading memonic:</p>
                    <textarea
                        id="reading-memonic-input"
                        className="memonic-textarea"
                        type="text"
                        name="reading-memo"
                        value={readingMemonic}
                        onChange={handleChange}>
                    </textarea>
                    <button
                        id="change-memo-button" 
                        className="board-button" 
                        onClick={sendMemonic}
                        >Save memonics
                    </button>
                </>  
                :
                <>
                    <p>Meaning memonic:</p>
                    {meaningMemonic !== "" ? 
                    meaningMemonic :
                    props.characters[id].memoMean === "" ?
                    "Currently no meaning memonic added" :
                    props.characters[id].memoMean}
                    <p>Reading memonic:</p>
                    {readingMemonic !== "" ? 
                    readingMemonic :
                    props.characters[id].memoRead === "" ?
                    "Currently no reading memonic added" :
                    props.characters[id].memoRead}
                    <button
                        id="change-memo-button" 
                        className="board-button" 
                        onClick={switchChangeMemonics}
                        >Change memonics
                    </button>
                </>
                }
            <p>Last practiced:</p>
            <p>{dateToString(props.characters[id].lastPract)}</p>
            <p>User level:</p>
            <div className="horiz-div">
                <p className="read-info">{props.characters[id].level}</p>
                <p>{levels[props.characters[id].level][1]}</p>
            </div>
        </>
    }

    return (
        <div className="card" id="info-card">
            {content}
            {userContent}
        </div>
    );
};

export default InfoPanel;