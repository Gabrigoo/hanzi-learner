import React, { useEffect, SyntheticEvent, ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  // on the jump to whatever url saven in backtrack
  const clickHandler = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (timeout) {
      navigate(backTrack);
    }
  };

  // set up and clear a timeout for jumping to backtract automatically
  useEffect(() => {
    let myTimeout: ReturnType<typeof setTimeout>;
    if (timeout) {
      myTimeout = setTimeout(() => { navigate(backTrack); }, timeout);
    }
    return () => {
      clearTimeout(myTimeout);
    };
  });

  const handleKey = () => {
    navigate(backTrack);
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
