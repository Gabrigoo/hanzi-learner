import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid, Typography } from '@mui/material';
import { MainInt, SessionInt, UserInt } from '../../interfaces';
import InfoTag from '../info/InfoTag';

interface SummaryProps {
  mainData: MainInt,
  userData: UserInt,
  reviewData: string[],
  sessionData: SessionInt,
  switchSession: () => void,
}

const Summary: React.FC<SummaryProps> = (props): ReactElement => {
  const sessionDisabled = props.reviewData.length === 0;

  return (
    <div className="card">
      <Grid container spacing={8}>
        <Grid item>
          <Typography variant="h5">Correct:</Typography>
        </Grid>
        <Grid item container direction="row">
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
        </Grid>
        <Grid item>
          <Typography variant="h5">Incorrect:</Typography>
        </Grid>
        <Grid item container direction="row">
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
        </Grid>
        <Grid item container direction="row" spacing={2} justifyContent="space-evenly">
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={sessionDisabled}
              onClick={props.switchSession}
            >
              Start Session
            </Button>
          </Grid>
          <Grid item>
            <Link className="no-underline" to="/main">
              <Button
                variant="outlined"
                color="primary"
              >
                Back to Main
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default Summary;
