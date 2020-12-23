import React, { ReactElement } from 'react';
import './TitleBox.css';
import { Link } from 'react-router-dom';

const TitleBox = (): ReactElement => (
  <div className="card" id="title-card">
    <h2 id="title">Hanzi SRS</h2>
    <Link
      to="/learn"
      className="standard-button"
    >
      Learn
    </Link>
    <Link
      to="/review"
      className="standard-button"
    >
      Practice
    </Link>
    <Link
      to="/stages"
      className="standard-button"
    >
      Stages
    </Link>
    <Link
      to="/add"
      className="standard-button"
    >
      Add new
    </Link>
    <Link
      to="/search"
      className="standard-button"
    >
      Search
    </Link>
  </div>
);

export default TitleBox;
