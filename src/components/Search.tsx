import React, { useState } from 'react';
import './Search.css';

interface MainCharacterInt {
  chineseSimp: string,
  chineseTrad: string,
  english: string[],
  pinyin: string,
  stage: number,
  tone: string,
}

interface SearchProps {
  mainData: {
    characters: {
      [key: string]: MainCharacterInt,
    },
  },
  searchResults: string[],
  handleSearch: (event: any, query: string, main: {[key: string]: MainCharacterInt}) => void,
}

const Search: React.FC<SearchProps> = (props) => {
  const mainData = props.mainData.characters;
  // query is the currently searched string by the user
  const [query, setQuery] = useState('');

  const handleChange = (event: any) => {
    const { name, value }: { name: string, value: string } = event.currentTarget;

    switch (name) {
      case 'search':
        setQuery(value);
        break;
      default:
        break;
    }
  };

  const clearInput = (event: any) => {
    setQuery('');
    props.handleSearch(event, '', mainData);
  };
  // all search results mapped
  const resultList = props.searchResults.map((item, index) => (
    <div id="result-flex" key={item + index}>
      <div id="smallflex-1">
        <p>{mainData[item].chineseTrad}</p>
        <p>{mainData[item].chineseSimp}</p>
        <p>{mainData[item].pinyin}</p>
      </div>
      <div id="smallflex-2">
        <p>{mainData[item].english[0]}</p>
        <p>{mainData[item].english[1]}</p>
        <p>{mainData[item].english[2]}</p>
      </div>
    </div>
  ));

  return (
    <div id="search-card" className="card">
      <form
        id="search-form"
        autoComplete="off"
        onSubmit={(event) => props.handleSearch(event, query, mainData)}
      >
        <label>
          Search:
          <input
            id="search-input"
            type="text"
            name="search"
            value={query}
            onChange={handleChange}
          />
        </label>
        <input
          id="search-button"
          className="standard-button"
          type="submit"
          value="Search"
        />
        <button
          id="clear-button"
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
