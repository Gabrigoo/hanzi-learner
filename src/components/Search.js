import React, { useState } from 'react';
import './Search.css';

const Search= (props) => {

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

    const resultList = props.searchResults.map((item, index) => 
        <div className="result-flex" key={item + index}>
            <p>{props.data[item].chineseTrad}</p>
            <p>{props.data[item].chineseSimp}</p>
            <p>{props.data[item].pinyin}</p>
            <p>{props.data[item].english[0]}</p>
            <p>{props.data[item].english[1]}</p>
            <p>{props.data[item].english[2]}</p>
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