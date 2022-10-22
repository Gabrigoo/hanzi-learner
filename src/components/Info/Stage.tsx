import React, { ReactElement } from 'react';
import { connect } from 'react-redux';

import {
  Box,
  Typography,
  Stack,
} from '@mui/material';

import {
  UserInt, MainInt, ReactFullState,
} from '../../interfaces';
import InfoTooltip from './InfoTooltip';
import './Stage.css';

interface ReactProps {
  level: number,
  mainData: MainInt,
  userData: UserInt,
}

const Stage: React.FC<ReactProps> = (props): ReactElement => {
  const characters = Object.keys(props.mainData.characters)
    .filter((item) => props.mainData.characters[item].stage === props.level);

  const words = Object.keys(props.mainData.words)
    .filter((item) => props.mainData.words[item].stage === props.level);

  return (
    <Stack spacing={1} sx={{ mb: 3 }}>
      <Typography
        variant="h4"
        className={`levels-h1 ${props.userData.profileData.currentStage >= props.level ? 'active' : ''}`}
      >
        {`Stage ${props.level}`}
      </Typography>

      <Box display="flex" flexWrap="wrap" gap="10px">
        {characters.concat(words).map((item, index) => (
          <InfoTooltip
            word={item}
            key={item + index}
          />
        ))}
      </Box>
    </Stack>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  mainData: state.data.mainData,
  userData: state.data.userData,
});

export default connect(
  mapStateToProps,
)(Stage);
