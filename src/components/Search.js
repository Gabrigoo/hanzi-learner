import React, { useState } from 'react';
import './Search.css';

const Search= (props) => {
    // query is the currently searched string by the user
    const [query, setQuery] = useState("");

    const handleChange = (event) => {
        const {name, value} = event.currentTarget;

        switch(name) {
            case "search":
                setQuery(value);
                break;
            default:
                break;
        }
    }

    const clearInput = (event) => {
        setQuery("");
        props.handleSearch(event, "");
    }
    // all search results mapped
    const resultList = props.searchResults.map((item, index) => 
        <div className="result-flex" key={item + index}>
            <p>{props.mainData[item].chineseTrad}</p>
            <p>{props.mainData[item].chineseSimp}</p>
            <p>{props.mainData[item].pinyin}</p>
            <p>{props.mainData[item].english[0]}</p>
            <p>{props.mainData[item].english[1]}</p>
            <p>{props.mainData[item].english[2]}</p>
        </div>
    )

    return (
        <div className="card">
            <form 
                id="search-form" 
                autoComplete="off"
                onSubmit={(event) => props.handleSearch(event, query)}>
                <label>Search:
                    <input
                        type="text" 
                        name="search" 
                        value={query} 
                        onChange={handleChange}>
                    </input>
                </label>
                <input id="search-button" 
                className="board-button" 
                type="submit" 
                value="Search" />
                <button id="clear-button" onClick={clearInput}>
                    Clear
                </button>
            </form>
            {resultList}
        </div>
    );
};

export default Search;