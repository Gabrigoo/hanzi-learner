import React, { useEffect, SyntheticEvent, ReactElement } from 'react';

import history from '../history';
import './Strip.css';

interface StripProps {
  message?: string,
  backTrack?: string,
  timeout?: number,
}

const Strip: React.FC<StripProps> = (props): ReactElement => {
  const message = props.message || '';
  const backTrack = props.backTrack || '/main';
  const timeout = props.timeout || null;

  // on the jump to whatever url saven in backtrack
  const clickHandler = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (timeout) {
      history.push(backTrack);
    }
  };
  // set up and clear a timeout for jumping to backtract automatically
  useEffect(() => {
    let myTimeout: ReturnType<typeof setTimeout>;
    if (timeout) {
      myTimeout = setTimeout(() => { history.push(backTrack); }, timeout);
    }
    return () => {
      clearTimeout(myTimeout);
    };
  });

  const handleKey = () => {
    history.push(backTrack);
  };

  useEffect(() => {
    if (timeout) {
      (document.getElementById('strip-card') as HTMLDivElement).focus();
    }
  });

  return (
    <div id="strip-card" onClick={clickHandler} onKeyPress={handleKey} role="button" tabIndex={0}>
      <p className="center-text">{message}</p>
    </div>
  );
};

export default Strip;
