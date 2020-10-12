import React, { useEffect } from 'react';
import './Strip.css';
import history from '../history';

const Strip = (props) => {
    // if no backtract url is specified, default is main menu
    let path = '/main';
        if (props.backTrack) {
            path = props.backTrack
        }
    // on the jump to whatever url saven in backtract
    const clickHandler = (event) => {
        event.preventDefault();
        history.push(path);
    }
    // set up and clear a timeout for jumping to backtract automatically
    useEffect(() => {
        let myTimeout;
        if (props.timeout) {
            myTimeout = setTimeout(() => {history.push(path)}, props.timeout)
        }
        return () => {
            clearTimeout(myTimeout);
        }
    })
    
    return (
        <div id="strip-card" onClick={clickHandler}>
            <p>{props.message}</p>
        </div>
    );
};
  
export default Strip;