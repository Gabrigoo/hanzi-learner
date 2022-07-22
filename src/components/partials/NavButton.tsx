import * as React from 'react';

import { Link } from 'react-router-dom';

import { Button } from '@mui/material';

type Props = {
  title: string;
  to: string;
  variant?: 'text' | 'contained' | 'outlined' | undefined;
  color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning' | undefined;
};

const NavButton: React.FC<Props> = (props) => (
  <Link tabIndex={-1} className="no-underline" to={props.to}>
    <Button
      variant={props.variant || 'contained'}
      size="large"
      color={props.color || 'primary'}
      sx={{ mx: 1 }}
    >
      {props.title}
    </Button>
  </Link>
);

export default NavButton;
