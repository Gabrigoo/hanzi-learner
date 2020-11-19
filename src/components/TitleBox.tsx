import React, { MouseEvent, ReactElement } from 'react';
import './TitleBox.css';
import { withRouter } from 'react-router-dom';
import history from '../history';

const TitleBox = (): ReactElement => {
  const switchScreen = (event: MouseEvent<HTMLButtonElement>) => {
    let path = '';
    switch (event.currentTarget.name) {
      case 'start-learn':
        path = '/learn';
        break;
      case 'start-practice':
        path = '/review';
        break;
      case 'start-add':
        path = '/add';
        break;
      case 'check-stages':
        path = '/stages';
        break;
      case 'start-search':
        path = '/search';
        break;
      default:
        break;
    }
    history.push(path);
  };

  return (
    <div className="card" id="title-card">
      <h2 id="title">Hanzi SRS</h2>
      <button
        name="start-learn"
        id="start-learn-button"
        className="standard-button"
        onClick={switchScreen}
      >
        Learn
      </button>
      <button
        name="start-practice"
        id="start-practice-button"
        className="standard-button"
        onClick={switchScreen}
      >
        Practice
      </button>
      <button
        name="check-stages"
        id="start-stages-button"
        className="standard-button"
        onClick={switchScreen}
      >
        Stages
      </button>
      <button
        name="start-add"
        id="start-add-button"
        className="standard-button"
        onClick={switchScreen}
      >
        Add new
      </button>
      <button
        name="start-search"
        id="start-search-button"
        className="standard-button"
        onClick={switchScreen}
      >
        Search
      </button>
    </div>
  );
};

export default withRouter(TitleBox);
