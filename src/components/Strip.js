import React, { useEffect } from 'react';
import './Strip.css';
import history from '../history';

const Strip = (props) => {

    let path = '/main';
        if (props.backTrack) {
            path = props.backTrack
        }

    const clickHandler = (event) => {
        event.preventDefault();
        history.push(path);
    }

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