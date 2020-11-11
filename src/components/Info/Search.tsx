import React, {
  useState, ChangeEvent, MouseEvent, FormEvent, ReactElement,
} from 'react';
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value }: { name: string, value: string } = event.currentTarget;

    switch (name) {
      case 'search':
        setQuery(value);
        break;
      default:
        break;
    }
  };

  const clearInput = (event: MouseEvent<HTMLButtonElement>) => {
    setQuery('');
    props.handleSearch(event, '', mainData);
  };
  // all search results mapped
  const resultList = props.searchResults.map((item, index) => {
    const data = Object.keys(mainData.characters).includes(item)
      ? mainData.characters : mainData.words;
    return (
      <div id="result-flex" key={item + index}>
        <div id="smallflex-1">
          <p>{data[item].chineseTrad}</p>
          <p>{data[item].chineseSimp}</p>
          <p>{data[item].pinyin}</p>
        </div>
        <div id="smallflex-2">
          <p>{data[item].english[0]}</p>
          <p>{data[item].english[1]}</p>
          <p>{data[item].english[2]}</p>
        </div>
      </div>
    );
  });

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
