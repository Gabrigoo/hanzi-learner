import React, {
  useState, MouseEvent, FormEvent, ReactElement,
} from 'react';

import {
  Button,
  TextField,
  Box,
  Container,
} from '@mui/material';

import { MainInt } from '../../interfaces';
import './Search.css';
import SearchResultTable from './SearchResultTable';

interface SearchProps {
  mainData: MainInt,
  searchResults: string[],
  handleSearch: (
    event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>,
    query: string,
    ) => void,
}

const Search: React.FC<SearchProps> = (props): ReactElement => {
  const [query, setQuery] = useState('');

  const clearInput = (event: MouseEvent<HTMLButtonElement>) => {
    setQuery('');
    props.handleSearch(event, '');
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <form
        autoComplete="off"
        onSubmit={(event) => props.handleSearch(event, query)}
      >
        <Box display="flex" justifyContent="space-between" sx={{ mb: '20px' }}>
          <TextField
            type="text"
            label="Search"
            variant="outlined"
            value={query}
            autoFocus
            sx={{ width: '50%' }}
            InputLabelProps={{ required: false }}
            required
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button
            variant="contained"
            type="submit"
            size="large"
          >
            Search
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="large"
            onClick={clearInput}
          >
            Clear
          </Button>
        </Box>
      </form>

      <SearchResultTable results={props.searchResults} mainData={props.mainData} />
    </Container>
  );
};

export default Search;
