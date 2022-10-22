import React, {
  useEffect, ReactElement, useState,
} from 'react';
import { connect } from 'react-redux';
import { CancelTokenSource } from 'axios';

import {
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  OutlinedInput,
  ListItemText,
  Checkbox,
  Button,
  Box,
} from '@mui/material';

import { instance as axios } from '../axios-instance';
import {
  MainInt, UserInt, ReactFullState,
} from '../interfaces';
import { loadUserData } from '../redux/actions';
import Strip from '../components/Strip';
import Stage from '../components/info/Stage';

interface ReactProps {
  token: string,
  mainData: MainInt,
  userData: UserInt,
  loadUserData: (source: CancelTokenSource) => any,
}

const StagesCont: React.FC<ReactProps> = (props): ReactElement => {
  const [selectedStages, setSelectedStages] = useState<string[]>([]);

  // Loading user data
  useEffect(() => {
    const source = axios.CancelToken.source();
    if (!props.userData && props.token) {
      props.loadUserData(source);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [props.userData, props.token]);

  // finds the highest stage level among all data
  const findHighestStage = () => {
    let highest = 0;
    Object.keys(props.mainData.characters).forEach((item) => {
      if (props.mainData.characters[item].stage > highest) {
        highest = props.mainData.characters[item].stage;
      }
    });
    return highest;
  };

  const mapAllStages = () => {
    const highestStage = findHighestStage();
    const items = [];
    for (let i = 1; i <= highestStage; i += 1) {
      if (!selectedStages.length || selectedStages.indexOf(i.toString()) > -1) {
        items.push(<Stage level={i} key={`stage${i}`} />);
      }
    }
    return items;
  };

  const mapStageSelection = () => {
    const highestStage = findHighestStage();
    const items = [];
    for (let i = 1; i <= highestStage; i += 1) {
      items.push(
        <MenuItem value={i.toString()} key={`menu${i}`}>
          <Checkbox checked={selectedStages.indexOf(i.toString()) > -1} />
          <ListItemText primary={`Stage ${i}`} />
        </MenuItem>,
      );
    }
    return items;
  };

  const handleChange = (event: SelectChangeEvent) => {
    const value = event.target.value;
    setSelectedStages(typeof value === 'string' ? value.split(',') : value);
  };

  const clearFilter = () => {
    setSelectedStages([]);
  };

  let content;

  if (props.mainData && props.userData) {
    content = (
      <Container maxWidth="lg" sx={{ mt: 5 }}>
        <Box display="flex" gap="20px" sx={{ height: '56px', mb: 2 }}>
          <FormControl sx={{ width: '150px' }}>
            <InputLabel id="filter-stage-label">Filter stages</InputLabel>
            <Select
              labelId="filter-stage-label"
              id="filter-stage"
              multiple
              onChange={handleChange}
              value={selectedStages as unknown as string}
              input={<OutlinedInput label="Stage Filter" />}
              renderValue={(selected) => (selected as unknown as string[]).join(', ')}
            >
              {mapStageSelection()}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="warning"
            onClick={clearFilter}
          >
            Clear
          </Button>
        </Box>
        {mapAllStages()}
      </Container>
    );
  } else if (!props.token) {
    content = <Strip message="No user is signed in" timeout={4000} />;
  } else {
    content = <Strip message="Loading..." />;
  }

  return (
    <div>
      {content}
    </div>
  );
};

const mapStateToProps = (state: ReactFullState) => ({
  token: state.auth.token,
  mainData: state.data.mainData,
  userData: state.data.userData,
});

export default connect(
  mapStateToProps,
  { loadUserData },
)(StagesCont);
