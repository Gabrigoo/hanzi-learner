import React, { useState } from 'react';
import './Character.css';
import history from '../history';

const Character = (props) => {
    // popup box when the user hovers above a character icon
    const [showBox, setShowBox] = useState(false);
    //these are for the small popup box when hovering over a character
    const handleBoxEnter = () => {
        setShowBox(true);
    }
    
    const handleBoxLeave = () => {
        setShowBox(false);
    }

    const handleClick = () => {
        let path = '/info/' + props.character;
        history.push(path);
    }
    //background color indicating correct and incorrect (or none)
    let backColor;

    if (props.value === 'true') {
        backColor = 'character-correct';
    } else if(props.value === 'false') {
        backColor = 'character-incorrect';
    } else {
        backColor = 'character-standard'
    }

    return (
        <div id="mapped-character-div" onMouseEnter={handleBoxEnter} onMouseLeave={handleBoxLeave}>
            <p className={backColor} id="mapped-character" onClick={handleClick}>{props.character}</p>
            {showBox ? 
                <div id="floating-div">
                    <div className="arrow-up"></div>
                    <p className = "hint-box">Mean: {props.data[props.character].english[0]}</p>
                    <p className = "hint-box">Read: {props.data[props.character].pinyin}</p>
                </div>
            : ""}
        </div>
    );
};

export default Character;