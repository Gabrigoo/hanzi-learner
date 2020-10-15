import React from 'react';
import './TitleBox.css';
import { withRouter } from 'react-router-dom';
import history from '../history';

const TitleBox = () => {
  const switchScreen = (event) => {
    let path = '';
    switch (event.target.name) {
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
    <div className="auth-flex-card">
      <h2>Hanzi SRS</h2>
      <button
        name="start-learn"
        id="start-learn-button"
        className="auth-button"
        onClick={switchScreen}
      >
        Learn
      </button>
      <button
        name="start-practice"
        id="start-practice-button"
        className="auth-button"
        onClick={switchScreen}
      >
        Practice
      </button>
      <button
        name="check-stages"
        id="start-stages-button"
        className="auth-button"
        onClick={switchScreen}
      >
        Stages
      </button>
      <button
        name="start-add"
        id="start-add-button"
        className="auth-button"
        onClick={switchScreen}
      >
        Add character
      </button>
      <button
        name="start-search"
        id="start-search-button"
        className="auth-button"
        onClick={switchScreen}
      >
        Search
      </button>
    </div>
  );
};

export default withRouter(TitleBox);
