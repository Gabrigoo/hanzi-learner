import React, {
  useState, MouseEvent, FormEvent, ReactElement,
} from 'react';
import { Link } from 'react-router-dom';

import {
  Button,
  TextField,
  Grid,
} from '@material-ui/core';

import { MainCharacterInt, MainWordInt, MainInt } from '../../interfaces';
import './Search.css';

interface SearchProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
    words: {
      [key: string]: MainWordInt,
    },
  },
  searchResults: string[],
  handleSearch: (
    event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>,
    query: string,
    main: MainInt
    ) => void,
}

const Search: React.FC<SearchProps> = (props): ReactElement => {
  const searchResults = props.searchResults || [];

  const mainData = props.mainData;
  // query is the currently searched string by the user
  const [query, setQuery] = useState('');

  const clearInput = (event: MouseEvent<HTMLButtonElement>) => {
    setQuery('');
    props.handleSearch(event, '', mainData);
  };

  // all search results mapped
  const resultList = searchResults.map((item, index) => {
    const data = Object.keys(mainData.characters).includes(item)
      ? mainData.characters : mainData.words;
    return (
      <Link id="result-flex" key={item + index} to={`/info/${item}`}>
        <div className="smallflex">
          <p className="search-p">{data[item].chineseTrad}</p>
          <p className="search-p">{data[item].chineseSimp}</p>
          <p className="search-p">{data[item].pinyin}</p>
        </div>
        <div className="smallflex">
          <p className="search-p">{data[item].english[0]}</p>
          <p className="search-p">{data[item].english[1]}</p>
          <p className="search-p">{data[item].english[2]}</p>
        </div>
      </Link>
    );
  });

  return (
    <div id="search-card" className="card">
      <form
        id="search-form"
        autoComplete="off"
        onSubmit={(event) => props.handleSearch(event, query, mainData)}
      >
        <Grid
          container
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <Grid item xs={12} md={6}>
            <TextField
              type="text"
              label="Search"
              variant="outlined"
              value={query}
              InputLabelProps={{ required: false }}
              required
              fullWidth
              onChange={(event) => setQuery(event.target.value)}
            />
          </Grid>
          <Grid item container justify="center" xs={6} md={3}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Search
            </Button>
          </Grid>
          <Grid item container justify="center" xs={6} md={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={clearInput}
            >
              Clear
            </Button>
          </Grid>
        </Grid>
      </form>
      {resultList}
    </div>
  );
};

export default Search;
