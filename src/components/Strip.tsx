import React, { useEffect, SyntheticEvent, ReactElement } from 'react';
import './Strip.css';
import history from '../history';

interface StripProps {
  message?: string,
  backTrack?: any,
  timeout?: number | null,
}

const Strip: React.FC<StripProps> = (props): ReactElement => {
  // on the jump to whatever url saven in backtract
  const clickHandler = (event: SyntheticEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (props.timeout) {
      history.push(props.backTrack);
    }
  };
  // set up and clear a timeout for jumping to backtract automatically
  useEffect(() => {
    let myTimeout: ReturnType<typeof setTimeout>;
    if (props.timeout) {
      myTimeout = setTimeout(() => { history.push(props.backTrack); }, props.timeout);
    }
    return () => {
      clearTimeout(myTimeout);
    };
  });

  const handleKey = () => {
    history.push(props.backTrack);
  };

  useEffect(() => {
    if (props.timeout) {
      (document.getElementById('strip-card') as HTMLDivElement).focus();
    }
  });

  return (
    <div id="strip-card" onClick={clickHandler} onKeyPress={handleKey} role="button" tabIndex={0}>
      <p>{props.message}</p>
    </div>
  );
};

Strip.defaultProps = {
  message: '',
  backTrack: '/main',
  timeout: null,
};

export default Strip;
