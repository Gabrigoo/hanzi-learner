import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Search.css';

const Search = (props) => {
  // query is the currently searched string by the user
  const [query, setQuery] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.currentTarget;

    switch (name) {
      case 'search':
        setQuery(value);
        break;
      default:
        break;
    }
  };

  const clearInput = (event) => {
    setQuery('');
    props.handleSearch(event, '');
  };
  // all search results mapped
  const resultList = props.searchResults.map((item, index) => (
    <div id="result-flex" key={item + index}>
      <div id="smallflex-1">
        <p>{props.mainData[item].chineseTrad}</p>
        <p>{props.mainData[item].chineseSimp}</p>
        <p>{props.mainData[item].pinyin}</p>
      </div>
      <div id="smallflex-2">
        <p>{props.mainData[item].english[0]}</p>
        <p>{props.mainData[item].english[1]}</p>
        <p>{props.mainData[item].english[2]}</p> 
      </div>
    </div>
  ));

  return (
    <div id="search-card" className="card">
      <form
        id="search-form"
        autoComplete="off"
        onSubmit={(event) => props.handleSearch(event, query)}
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
          >Clear
        </button>
      </form>
      {resultList}
    </div>
  );
};

Search.defaultProps = {
  searchResults: [],
};

Search.propTypes = {
  mainData: PropTypes.objectOf(PropTypes.object).isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.object),
  handleSearch: PropTypes.func.isRequired,
};

export default Search;
