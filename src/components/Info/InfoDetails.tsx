import React, { useState, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  Grid,
  Typography,
  TextField,
} from '@material-ui/core';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import InfoTag from './InfoTag';
import LEVELS from '../../assets/levels';
import './InfoDetails.css';

interface InfoDetailsProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  userData: {
    characters: {
      [key: string]: UserCharacterInt,
    },
    words: {
      [key: string]: UserCharacterInt,
    },
    profileData: {
      currentStage: number
    }
  };
  id: string,
  updateMemonic: (character: string, object: UserCharacterInt) => void,
}

const InfoDetails: React.FC<InfoDetailsProps> = (props): ReactElement => {
  // getting data the panel is supposed to display
  const current = props.id;
  // getting type, character or word, setting currect datascources
  const type = current.length > 1 ? 'word' : 'character';
  const mainData = type === 'character'
    ? props.mainData.characters : props.mainData.words;
  const userData = type === 'character'
    ? props.userData.characters : props.userData.words;
  // memonics in case they are changed
  const [changeMemonic, setChangeMemonic] = useState(false);
  const [meaningMemonic, setMeaningMemonic] = useState('');
  const [readingMemonic, setReadingMemonic] = useState('');

  const switchChangeMemonics = () => {
    setChangeMemonic(true);
    if (meaningMemonic === '') {
      setMeaningMemonic(userData[current].memoMean);
    }
    if (readingMemonic === '') {
      setReadingMemonic(userData[current].memoRead);
    }
  };
  // updates memonic in the database
  const sendMemonic = () => {
    const object = {
      lastPract: userData[current].lastPract,
      level: userData[current].level,
      memoMean: meaningMemonic,
      memoRead: readingMemonic,
    };
    props.updateMemonic(current, object);
    setChangeMemonic(false);
  };

  // convert numeric date into the displayed date
  const dateToString = (numericDate: number) => {
    const date = new Date(numericDate);
    const year = date.getFullYear();
    let currentMonth:string = (date.getMonth() + 1).toString();
    let currentDay:string = (date.getDate()).toString();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    if (parseInt(currentMonth, 10) < 10) { currentMonth = `0${currentMonth}`; }
    if (parseInt(currentDay, 10) < 10) { currentDay = `0${currentDay}`; }

    return `${year}/${currentMonth}/${currentDay} ${hours}:${minutes}`;
  };

  let userContent = <p>This character is not yet learned.</p>;
  // From here it's rendering
  const renderMemonic = () => {
    const renderMeanMemonic = () => {
      if (meaningMemonic !== '') {
        return meaningMemonic;
      } else {
        return userData[current].memoMean;
      }
    };

    const renderReadMemonic = () => {
      if (readingMemonic !== '') {
        return readingMemonic;
      } else {
        return userData[current].memoRead;
      }
    };

    return (
      <Grid item container spacing={3} justify="space-evenly" alignItems="center">
        <Grid item xs={12} sm={5}>
          <TextField
            type="text"
            label="Meaning memonic"
            variant="outlined"
            multiline
            fullWidth
            disabled={!changeMemonic}
            value={renderMeanMemonic()}
            onChange={(event) => setMeaningMemonic(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={5}>
          <TextField
            type="text"
            label="Reading memonic"
            variant="outlined"
            multiline
            fullWidth
            disabled={!changeMemonic}
            value={renderReadMemonic()}
            onChange={(event) => setReadingMemonic(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2} container justify="center">
          {changeMemonic
            ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={sendMemonic}
              >
                Save
              </Button>
            )
            : (
              <Button
                variant="outlined"
                color="primary"
                onClick={switchChangeMemonics}
              >
                Change
              </Button>
            )}
        </Grid>
      </Grid>
    );
  };

  const content = (
    <>
      <Grid item container direction="row" alignItems="flex-end" spacing={2}>
        <Grid item xs={4} sm={2} md={2}>
          <Typography variant="h2">{current}</Typography>
        </Grid>
        <Grid item xs={3} sm={2} md={1}>
          <Typography variant="h5">{`(${mainData[current].chineseSimp})`}</Typography>
        </Grid>
        <Grid item xs={5} sm={3} md={5} />
        <Grid item xs={6} sm={3} md={2}>
          <Typography variant="h5">
            {`Stage: ${mainData[current].stage}`}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={2} md={2}>
          <Link className="no-underline" to="/stages">
            <Button
              variant="outlined"
              color="primary"
            >
              Stages
            </Button>
          </Link>
        </Grid>
      </Grid>

      <Grid item container direction="row" className="horiz-div" spacing={2}>
        <Grid item>
          <Typography>Meaning:</Typography>
        </Grid>
        {mainData[current].english.map((word, index) => (
          <Grid item key={word + index}>
            <Typography key={word + index}>{word}</Typography>
          </Grid>
        ))}
      </Grid>

      <Grid item container direction="row" className="horiz-div" spacing={2}>
        <Grid item>
          <Typography>Reading: </Typography>
        </Grid>
        <Grid item>
          {type === 'character' ? mainData[current].pinyin : mainData[current].pinyin}
        </Grid>
        <Grid item>{mainData[current].tone}</Grid>
      </Grid>

      {type === 'word' ? (
        <Grid item container direction="row" alignItems="center" spacing={2}>
          <Grid item>
            <Typography>Components:</Typography>
          </Grid>
          {current.split('').map((item, index) => (
            <Grid item>
              <InfoTag
                mainData={props.mainData}
                userData={props.userData}
                word={item}
                key={item + index}
              />
            </Grid>
          ))}
        </Grid>
      )
        : (
          <Grid item container direction="row" spacing={2}>
            <Grid item>
              <Typography>
                {Object.keys(props.userData.words).length ? 'Found in' : null}
              </Typography>
            </Grid>
            {Object.keys(props.userData.words).filter((word) => {
              let includes = false;
              word.split('').forEach((comp) => {
                if (comp === current) {
                  includes = true;
                }
              });
              return includes;
            }).map((item, index) => (
              <Grid item>
                <InfoTag
                  mainData={props.mainData}
                  userData={props.userData}
                  word={item}
                  key={item + index}
                />
              </Grid>
            ))}
          </Grid>
        )}
    </>
  ); // from here is only displayed if user already has relevant learning data
  if (userData[current]) {
    userContent = (
      <>
        {renderMemonic()}
        <Grid
          item
          container
          direction="row"
          justify="flex-start"
          spacing={2}
        >
          <Grid item container direction="column" alignItems="flex-start" spacing={1} xs={5} sm={4} md={3}>
            <Grid item>
              <Typography>Last practiced:</Typography>
            </Grid>
            <Grid item>
              <Typography>Next practice:</Typography>
            </Grid>
            <Grid item>
              <Typography>User level:</Typography>
            </Grid>
          </Grid>

          <Grid item container direction="column" alignItems="flex-start" spacing={1} xs={7} sm={5} md={4}>
            <Grid item>
              <Typography>{dateToString(userData[current].lastPract)}</Typography>
            </Grid>
            <Grid item>
              <Typography>
                {dateToString(userData[current].lastPract
                  + (LEVELS[userData[current].level][0] * (1000 * 60 * 60)))}
              </Typography>
            </Grid>
            <Grid item>
              <Typography>
                {`${userData[current].level} "${LEVELS[userData[current].level][1]}"`}
              </Typography>
            </Grid>
          </Grid>

        </Grid>
      </>
    );
  }

  return (
    <div className="card" id="info-card">
      <Grid container spacing={3}>
        {content}
        {userContent}
      </Grid>
    </div>
  );
};

export default InfoDetails;
