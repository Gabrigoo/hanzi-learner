import React, { useState } from 'react';
import axios from '../axios-instance';
import './Addition.css';
import {TONES} from '../assets/tones';

const Addition = (props) => {
    //states for user input
    const [chineseTrad, setChineseTrad] = useState("");
    const [chineseSimp, setChineseSimp] = useState("");
    const [english_1, setEnglish1] = useState("");
    const [english_2, setEnglish2] = useState("");
    const [english_3, setEnglish3] = useState("");
    const [pinyin, setPinyin] = useState("");
    const [tone, setTone] = useState("");
    const [stage, setStage] = useState("");

    //import data in order to check if entry exists
    const [data, setData] = useState(props.data)
    //set if already existing entry should be overwritten or not
    const [overwrite, setOverwrite] = useState(false);
    //handles state change
    const handleChange = (event) => {
        const {name, value} = event.currentTarget;

        switch(name) {
            case "chineseTrad":
                setChineseTrad(value);
                break;
            case "chineseSimp":
                setChineseSimp(value);
                break;
            case "pinyin":
                setPinyin(value);
                setTone(toneCheck(value));
                break;
            case "tone":
                setTone(value);
                break;
            case "english-1":
                setEnglish1(value);
                break;
            case "english-2":
                setEnglish2(value);
                break;
            case "english-3":
                setEnglish3(value);
                break;
            case "stage":
                setStage(value);
                break;
            default:
                break;
        }
    }
    //automatically checks the tone and fills input box
    const toneCheck = (pinyin) => {
        for (let i = 0; i < pinyin.length; i++) {
            for (let j = 0; j < Object.keys(TONES).length; j++) {
                if (TONES[Object.keys(TONES)[j]].includes(pinyin[i])) {
                    return Object.keys(TONES)[j]
                }
            }
        }
        if (pinyin === "") {
            return ""
        } else {
            return "5"
        }
    }
    // determines whether user is allowed to overwrite existing character entry
    const switchOverwrite = () => {
        if (overwrite) {
            setOverwrite(false);
        } else {
            setOverwrite(true);
            alert("Please use caution when overwriting data entries.")
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (chineseTrad === "") {
            alert("Insert a valid character")
        }
        else if (data.includes(chineseTrad) && overwrite === false) {
            alert("Entry already exists")
        } else {
            axios.put("/main-data/characters/" + chineseTrad + ".json?auth=" + props.token,
        {
            chineseTrad: chineseTrad,
            chineseSimp: chineseSimp,
            english: [english_1.toLowerCase(), english_2.toLowerCase(), english_3.toLowerCase()],
            pinyin: pinyin.toLowerCase(),
            tone: tone,
            stage: parseInt(stage),
        })
        .then(() => {
            console.log('PUT: Upload complete');
            setData(data.concat(chineseTrad));
            setChineseTrad("");
            setChineseSimp("");
            setEnglish1("");
            setEnglish2("");
            setEnglish3("");
            setPinyin("");
            setTone("");
            setStage("");
        }
        ).catch((error) => console.error("Error adding new entry: " + error))
        }
    }

    return (
        <div id="board">
            <form id="addition-grid-card" autoComplete="off" onSubmit={handleSubmit}>
                <h1 className="add-h1">Add new entry</h1>
                <label>Traditional chinese:
                    <input
                        className="hanzi-input" 
                        type="text" name="chineseTrad" 
                        value={chineseTrad} 
                        onChange={handleChange}>
                    </input>
                </label>
                <label>Simplified chinese:
                    <input 
                        className="hanzi-input" 
                        type="text" 
                        name="chineseSimp" 
                        value={chineseSimp} 
                        onChange={handleChange}>
                    </input>
                </label>
                <label>Pinyin:
                    <input 
                        type="text" 
                        name="pinyin" 
                        value={pinyin} 
                        onChange={handleChange}>
                    </input>
                </label>
                <label>Tone:
                    <input 
                        type="text" 
                        name="tone" 
                        value={tone} 
                        onChange={handleChange}>
                    </input>
                </label>
                <label>Meaning:
                    <input 
                        className="margin-bottom-3" 
                        type="text" name="english-1" 
                        value={english_1} 
                        onChange={handleChange}>
                    </input>
                    <input 
                        className="margin-bottom-2" 
                        type="text" 
                        name="english-2" 
                        value={english_2} 
                        onChange={handleChange}>
                    </input>
                    <input 
                        type="text" 
                        name="english-3" 
                        value={english_3} 
                        onChange={handleChange}>
                    </input>
                </label>
                <label>Stage:
                    <input 
                        type="text"
                        name="stage"
                        value={stage}
                        onChange={handleChange}>
                    </input>
                </label>
                <div id="bottom-flex">
                    <p>Overwrite:</p>
                    <label className="switch">
                        <input onChange={switchOverwrite} type="checkbox" />
                        <span className="slider round" />
                    </label>
                    <input
                        id="submit-button" 
                        type="submit" 
                        value="Submit">
                    </input>
                </div>
            </form>
        </div>
    );
};

export default Addition;