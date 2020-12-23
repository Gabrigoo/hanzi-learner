import React, {
  useState, MouseEvent, FormEvent, ReactElement,
} from 'react';
import { Link } from 'react-router-dom';

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
  const mainData = props.mainData;
  // query is the currently searched string by the user
  const [query, setQuery] = useState('');

  const clearInput = (event: MouseEvent<HTMLButtonElement>) => {
    setQuery('');
    props.handleSearch(event, '', mainData);
  };

  // all search results mapped
  const resultList = props.searchResults.map((item, index) => {
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
        <label id="search-label">
          <p id="search-p">Search:</p>
          <input
            id="search-input"
            type="text"
            name="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <input
          id="search-button"
          className="standard-button"
          type="submit"
          value="Search"
        />
        <button
          id="clear-search-button"
          className="standard-button"
          onClick={clearInput}
        >
          Clear
        </button>
      </form>
      {resultList}
    </div>
  );
};

Search.defaultProps = {
  searchResults: [],
};

export default Search;
