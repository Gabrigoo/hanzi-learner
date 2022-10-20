import React, { ReactElement } from 'react';
import { connect } from 'react-redux';

import {
  Typography,
  Tooltip,
  Stack,
} from '@mui/material';

import { Link } from 'react-router-dom';

import {
  MainInt, UserInt, ReactFullState,
} from '../../interfaces';
import './InfoTooltip.css';

interface ReactProps {
  mainData: MainInt,
  userData: UserInt,
  word: string,
  result?: boolean
}

const InfoTooltip: React.FC<ReactProps> = (props): ReactElement => {
  const mainData = props.word.length === 1
    ? props.mainData.characters : props.mainData.words;
  const userData = props.word.length === 1
    ? props.userData.characters : props.userData.words;

  // background color indicating status
  let backColor: string;
  if (props.result === true) {
    backColor = 'theme-correct';
  } else if (props.result === false) {
    backColor = 'theme-incorrect';
  } else if (!Object.prototype.hasOwnProperty.call(userData, props.word)) {
    backColor = 'theme-grey';
  } else if (userData[props.word].level === 0) {
    backColor = 'theme-grey';
  } else if (userData[props.word].level < 5) {
    backColor = 'theme-brown';
  } else if (userData[props.word].level < 7) {
    backColor = 'theme-bronze';
  } else if (userData[props.word].level < 8) {
    backColor = 'theme-silver';
  } else if (userData[props.word].level < 9) {
    backColor = 'theme-gold';
  } else {
    backColor = 'theme-diamond';
  }

  const displayPinyin = () => {
    const pinyin = mainData[props.word].pinyin;
    const tone = mainData[props.word].tone;
    if (pinyin instanceof Array && tone instanceof Array) {
      return `Read: ${pinyin.filter((p) => !!p).join('')}`;
    } else {
      return `Read: ${pinyin}`;
    }
  };

  const tooltipText = (
    <Stack>
      <Typography>
        {`Mean: ${mainData[props.word].english[0]}`}
      </Typography>
      <Typography>
        {displayPinyin()}
      </Typography>
      <Typography>
        {userData[props.word] ? `Level: ${userData[props.word].level}` : null}
      </Typography>
    </Stack>
  );

  return (
    <Tooltip title={tooltipText} arrow>
      <Link
        id="mapped-word"
        to={`/info/${props.word}`}
        className={backColor}
      >
        {props.word}
      </Link>
    </Tooltip>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  mainData: state.data.mainData,
  userData: state.data.userData,
});

export default connect(
  mapStateToProps,
)(InfoTooltip);
