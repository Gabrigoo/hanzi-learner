import React, { useEffect, useState, useContext } from 'react';
import { instance as axios, getMainData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import Strip from '../components/Strip';
import Search from '../components/Search';
import { flattenPinyin } from '../assets/tones';

const SearchCont = () => {
  // setting up user status
  const currentUser = useContext(UserContext);

  const [userId, setUserID] = useState(localStorage.getItem('userId'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserID(localStorage.getItem('userId'));
  }, [currentUser]);
  // setting up data
  const [mainData, setMainData] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token) {
      getMainData(source, token, setMainData);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [token, userId]);

  const [searchResults, setSearchResults] = useState([]);
  // handles search by input and refreshes search results
  const handleSearch = (event, query, mainData) => {
    event.preventDefault();

    if (query === '') {
      setSearchResults([]);
    } else {
      let resultList = [];
      for (const character in mainData) {
        if (Object.prototype.hasOwnProperty.call(mainData, character)) {
          switch (query) {
          case mainData[character].chineseTrad:
          case mainData[character].chineseSimp:
          case mainData[character].pinyin:
          case flattenPinyin(mainData[character].pinyin)[0]:
          case mainData[character].english[0]:
          case mainData[character].english[1]:
          case mainData[character].english[2]:
            resultList = resultList.concat(character);
            break;
          default:
            break;
          }
        }
      }
      setSearchResults(resultList);
    }
  };

  let content;

  if (mainData) {
    content = (
      <Search
        mainData={mainData}
        searchResults={searchResults}
        handleSearch={handleSearch}
      />
    );
  } else if (!token) {
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

export default SearchCont;
