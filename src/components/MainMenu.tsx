import React, { ReactElement } from 'react';
import './MainMenu.css';
import { Link } from 'react-router-dom';

interface TitleBoxProps {
  userId: string;
}

const MainMenu: React.FC<TitleBoxProps> = (props): ReactElement => {
  const adminList = [
    'BjnlPmoMJAgRyJdkfjMGWROujbm1',
  ];

  const isAdmin = adminList.includes(props.userId);

  return (
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
      {isAdmin
        ? (
          <Link
            to="/add"
            className="standard-button"
          >
            Add new
          </Link>
        )
        : ''}
      <Link
        to="/search"
        className="standard-button"
      >
        Search
      </Link>
    </div>
  );
};

export default MainMenu;
