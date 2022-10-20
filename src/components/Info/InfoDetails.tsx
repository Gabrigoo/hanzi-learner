import React, { useState, useEffect, ReactElement } from 'react';
import { format } from 'date-fns';

import {
  Box,
  Container,
  Typography,
  TextField,
  Stack,
  IconButton,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';

import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';
import InfoTooltip from './InfoTooltip';
import NavButton from '../partials/NavButton';
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

  useEffect(() => {
    setMeaningMemonic(userData[current]?.memoMean);
    setReadingMemonic(userData[current]?.memoRead);
    setChangeMemonic(false);
  }, [current]);

  const switchChangeMemonics = () => {
    if (changeMemonic) {
      // updates memonic in the database
      const object = {
        lastPract: userData[current].lastPract,
        level: userData[current].level,
        memoMean: meaningMemonic,
        memoRead: readingMemonic,
      };
      props.updateMemonic(current, object);
    }
    setChangeMemonic(!changeMemonic);
  };

  const getLastPracticed = (): string => format(new Date(userData[current].lastPract), 'yyyy MMMM dd. H:mm');

  const getNextPractice = (): string => {
    if (userData[current].level > 8) {
      return 'Congratulations! No need to practice this anymore!';
    }
    return format(new Date(userData[current].lastPract
      + (LEVELS[userData[current].level][0] * (1000 * 60 * 60))), 'yyyy MMMM dd. H:mm');
  };

  const mapComponents = () => current.split('').map((item, index) => (
    <InfoTooltip
      key={item + index}
      word={item}
    />
  ));

  const mapUsedIn = () => {
    const words = Object.keys(props.mainData.words).filter((word) => {
      let includes = false;
      word.split('').forEach((comp) => {
        if (comp === current) {
          includes = true;
        }
      });
      return includes;
    });
    if (!words.length) {
      return <Typography variant="h5">None</Typography>;
    }
    return words.map(((item, index) => (
      <InfoTooltip
        key={item + index}
        word={item}
      />
    )));
  };

  const displayPinyin = () => {
    const pinyin = mainData[current].pinyin;
    const tone = mainData[current].tone;
    if (pinyin instanceof Array && tone instanceof Array) {
      return `Reading: ${pinyin.filter((p) => !!p).join('')} (tone: ${tone.filter((t) => !!t).join('')})`;
    } else {
      return `Reading: ${pinyin} (tone: ${tone})`;
    }
  };

  let userContent = <Typography variant="h5">This character is not yet learned.</Typography>;

  const content = (
    <Stack spacing={3} sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="h1">{current}</Typography>
        <Box display="flex" flexDirection="column" justifyContent="space-between">
          <Typography variant="h4">
            {`Stage: ${mainData[current].stage}`}
          </Typography>
          <NavButton title="Stages" to="/stages" variant="outlined" />
        </Box>
      </Box>

      <Typography variant="h3">{mainData[current].chineseSimp}</Typography>

      <Typography variant="h5">
        Meaning:
        {' '}
        {mainData[current].english.filter((word) => !!word).map((word) => word).join(', ')}
      </Typography>

      <Typography variant="h5">
        {displayPinyin()}
      </Typography>

      <Box display="flex" justifyContent="start" alignItems="center" gap="10px">
        <Typography variant="h5">{type === 'word' ? 'Components:' : 'Found in:'}</Typography>
        {type === 'word' ? mapComponents() : mapUsedIn()}
      </Box>
    </Stack>
  );
  // from here is only displayed if user already has relevant learning data
  if (userData[current]) {
    userContent = (
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" gap="20px">
          <TextField
            label="Meaning memonic"
            variant="outlined"
            minRows="2"
            multiline
            fullWidth
            disabled={!changeMemonic}
            value={meaningMemonic}
            onChange={(event) => setMeaningMemonic(event.target.value)}
          />
          <IconButton
            onClick={switchChangeMemonics}
            aria-label={changeMemonic ? 'save-memonics' : 'change-memonics'}
            size="large"
            color="primary"
            sx={{ height: '60px' }}
          >
            {changeMemonic
              ? <SaveIcon sx={{ fontSize: 40 }} />
              : <EditIcon sx={{ fontSize: 40 }} />}
          </IconButton>
          <TextField
            label="Reading memonic"
            minRows="2"
            variant="outlined"
            multiline
            fullWidth
            disabled={!changeMemonic}
            value={readingMemonic}
            onChange={(event) => setReadingMemonic(event.target.value)}
          />
        </Box>

        <Typography variant="h5">
          {`Last practiced: ${getLastPracticed()}`}
        </Typography>

        <Typography variant="h5">
          {`Next practice: ${getNextPractice()}`}
        </Typography>

        <Typography variant="h5">
          {`User level: ${`${userData[current].level} "${LEVELS[userData[current].level][1]}"`}`}
        </Typography>
      </Stack>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>
      {content}
      {userContent}
    </Container>
  );
};

export default InfoDetails;
