import React, {useEffect, useState, useContext } from 'react';
import { instance as axios, getMainDataCharacters } from '../axios-instance';
import Strip from '../components/Strip';
import Search from '../components/Search';
import { UserContext } from '../components/providers/UserProvider';
import { flattenPinyin } from '../assets/tones';

const SearchCont = () => {

    const currentUser = useContext(UserContext);

    const [userId, setUserID] = useState(localStorage.getItem('userId'));
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect( () => {
        setToken(localStorage.getItem('token'));
        setUserID(localStorage.getItem('userId'));
    }, [currentUser]);

    const [data, setData] = useState(null);

    useEffect( () => {
            const source = axios.CancelToken.source();
            if (token) {
                getMainDataCharacters(source, token, setData);
            }
            return () => {
                source.cancel('GET request cancelled');
            }
    }, [token, userId]);

    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = (event, query) => {
        event.preventDefault();

        if (query === "") {
            setSearchResults([]);
        } else {
            let resultList = [];
            for (const character in data) {
                switch(query) {
                    case data[character].chineseTrad:
                    case data[character].chineseSimp:
                    case data[character].pinyin:
                    case flattenPinyin(data[character].pinyin)[0]:
                    case data[character].english[0]:
                    case data[character].english[1]:
                    case data[character].english[2]:
                        resultList = resultList.concat(character);
                        break;
                    default:
                        break;
                }
            }
        setSearchResults(resultList);
        }
    }

    let content;
    
    if (data) {
        content = <Search data={data} searchResults={searchResults} handleSearch={handleSearch}/>
    } else if (!token) {
        content = <Strip message = "No user is signed in" backTrack={'/main'} timeout = {4000}/>
    } else {
        content = <Strip message = "Loading..."/>
    }
    
    return (
        <div>
            {content}
        </div>
        );
  };

  export default SearchCont;