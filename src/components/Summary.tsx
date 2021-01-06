import React, { ReactElement, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  MainInt, SessionInt, UserInt,
} from '../interfaces';
import InfoTag from './info/InfoTag';

interface SummaryProps {
  mainData: MainInt,
  userData: UserInt,
  reviewData: string[],
  sessionData: SessionInt,
  switchSession: () => void,
}

const Summary: React.FC<SummaryProps> = (props): ReactElement => {
  const ref = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    if (props.reviewData.length === 0 && ref.current) {
      ref.current.disabled = true;
      ref.current.style.filter = 'grayscale(100%)';
    }
  });

  return (
    <div>
      <div className="card" id="summary-card">
        <p id="correct-label">Correct:</p>
        <div className="mapping-div" id="correct-map">
          {props.sessionData.correctList.length === 0 ? 'No items'
            : props.sessionData.correctList.map((item, index) => (
              <InfoTag
                mainData={props.mainData}
                userData={props.userData}
                word={item}
                value="true"
                key={item + index}
              />
            ))}
        </div>
        <p id="incorrect-label">Incorrect:</p>
        <div className="mapping-div" id="incorrect-map">
          {props.sessionData.incorrectList.length === 0 ? 'No items'
            : props.sessionData.incorrectList.map((item, index) => (
              <InfoTag
                mainData={props.mainData}
                userData={props.userData}
                word={item}
                value="false"
                key={item + index}
              />
            ))}
        </div>
        <Link
          to="/main"
          id="main-menu-button"
          className="standard-button"
        >
          Back to Main
        </Link>
        <button ref={ref} className="standard-button" onClick={props.switchSession}>
          Start Session
        </button>
      </div>
    </div>
  );
};

export default Summary;
