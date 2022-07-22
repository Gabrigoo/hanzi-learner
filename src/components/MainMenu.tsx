import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { Typography, Button } from '@mui/material';

interface TitleBoxProps {
  userId: string;
}

const MainMenu: React.FC<TitleBoxProps> = (props): ReactElement => {
  const adminList = [
    'AGBKwyOAwKhJyNenUVyE8GEIU8B2',
  ];

  const isAdmin = adminList.includes(props.userId);

  return (
    <div className="card">
      <Typography variant="h3" component="h1" color="primary">Hanzi SRS</Typography>
      <Link className="no-underline" to="/learn">
        <Button
          sx={{ width: '120px', marginTop: '2vh' }}
          variant="contained"
          color="primary"
          size="large"
        >
          Learn
        </Button>
      </Link>
      <Link className="no-underline" to="/review">
        <Button
          sx={{ width: '120px', marginTop: '2vh' }}
          variant="contained"
          color="primary"
          size="large"
        >
          Review
        </Button>
      </Link>
      <Link className="no-underline" to="/stages">
        <Button
          sx={{ width: '120px', marginTop: '2vh' }}
          variant="contained"
          color="primary"
          size="large"
        >
          Stages
        </Button>
      </Link>
      <Link className="no-underline" to="/search">
        <Button
          sx={{ width: '120px', marginTop: '2vh' }}
          variant="contained"
          color="primary"
          size="large"
        >
          Search
        </Button>
      </Link>
      {isAdmin
        ? (
          <Link className="no-underline" to="/add">
            <Button
              sx={{ width: '120px', marginTop: '2vh' }}
              variant="contained"
              color="primary"
              size="large"
            >
              Addition
            </Button>
          </Link>
        )
        : null}
    </div>
  );
};

export default MainMenu;
