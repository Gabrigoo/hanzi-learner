import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Strip.css';
import history from '../history';

const Strip = (props) => {
  // on the jump to whatever url saven in backtract
  const clickHandler = (event) => {
    event.preventDefault();
    if (props.timeout) {
      history.push(props.backTrack);
    }
  };
  // set up and clear a timeout for jumping to backtract automatically
  useEffect(() => {
    let myTimeout;
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
      document.getElementById('strip-card').focus();
    }
  });

  return (
    <div id="strip-card" onClick={clickHandler} onKeyPress={handleKey} role="button" tabIndex="0">
      <p>{props.message}</p>
    </div>
  );
};

Strip.defaultProps = {
  backTrack: '/main',
  timeout: null,
};

Strip.propTypes = {
  message: PropTypes.string.isRequired,
  backTrack: PropTypes.string,
  timeout: PropTypes.number,
};

export default Strip;
