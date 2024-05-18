import React, { useEffect, ReactElement } from 'react';
import { connect } from 'react-redux';
import {
  Typography,
  Container,
  Stack,
  Box,
  Divider,
} from '@mui/material';
import { CancelTokenSource } from 'axios';
import { loadUserData } from '../../redux/actions';
import { instance as axios } from '../../axios-instance';
import {
  MainInt, ReactFullState, SessionInt, UserInt,
} from '../../interfaces';
import LearningService from '../../services/Learning.service';
import InfoTooltip from '../info/InfoTooltip';
import NavButton from '../partials/NavButton';

interface ReactProps {
  token: string,
  loadUserData: (source: CancelTokenSource) => any,
  mainData: MainInt,
  userData: UserInt,
  sessionData: SessionInt,
}

const Summary: React.FC<ReactProps> = (props): ReactElement => {
  const numberOfItemsToReview = LearningService.itemsToReview(props.userData).length;
  const numberOfItemsToLearn = LearningService.itemsToLearn(props.mainData, props.userData).length;

  // Loading user data
  useEffect(() => {
    const source: CancelTokenSource = axios.CancelToken.source();
    if (!props.userData && props.token) {
      props.loadUserData(source);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [props.userData, props.token]);

  const mapResults = (correct: boolean) => {
    const list = correct ? 'correctList' : 'incorrectList';
    return props.sessionData[list].map((item, index) => (
      <InfoTooltip
        word={item}
        result
        key={item + index}
      />
    ));
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 2 }}>
      <Stack spacing={3}>

        <Stack spacing={2}>
          <Typography variant="h4">Last session</Typography>
          <Typography variant="h5">Correct:</Typography>
          {!props.sessionData.correctList.length
            ? <Typography>No items</Typography>
            : (
              <Box display="flex" flexWrap="wrap" gap="10px">
                {mapResults(true)}
              </Box>
            )}
          <Typography variant="h5">Incorrect:</Typography>
          {!props.sessionData.incorrectList.length
            ? <Typography>No items</Typography>
            : (
              <Box display="flex" flexWrap="wrap" gap="10px">
                {mapResults(false)}
              </Box>
            )}
        </Stack>

        <Divider />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack spacing={2}>
            <Typography variant="h4">Review</Typography>
            <Typography variant="h5">{`${numberOfItemsToReview} items to review`}</Typography>
          </Stack>

          {numberOfItemsToReview ? (
            <NavButton title="Start Review" to="/review" />
          ) : null}
        </Box>

        <Divider />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Stack spacing={2}>
            <Typography variant="h4">Learn</Typography>
            <Typography variant="h5">{`${numberOfItemsToLearn} items to learn`}</Typography>
          </Stack>

          {numberOfItemsToLearn ? (
            <NavButton title="Learn" to="/learn" />
          ) : null}
        </Box>

      </Stack>
    </Container>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  token: state.auth.token,
  mainData: state.data.mainData,
  userData: state.data.userData,
  sessionData: state.session,
});

export default connect(
  mapStateToProps,
  { loadUserData },
)(Summary);
