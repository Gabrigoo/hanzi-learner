import * as React from 'react';

import { Link } from 'react-router-dom';

import { Button } from '@mui/material';

type Props = {
  title: string;
  to: string;
};

const NavButton: React.FC<Props> = (props) => (
  <Link className="no-underline" to={props.to}>
    <Button
      variant="contained"
      size="large"
      sx={{ mx: 1 }}
    >
      {props.title}
    </Button>
  </Link>
);

export default NavButton;
