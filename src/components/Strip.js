import React from 'react';
import './Strip.css';

const Strip = (props) => {

    return (
        <div id="strip-card" onClick={props.clickFunc}>
            <p>{props.message}</p>
        </div>
    );
};
  
export default Strip;