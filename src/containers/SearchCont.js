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
  const handleSearch = (event, query, main) => {
    event.preventDefault();

    if (query === '') {
      setSearchResults([]);
    } else {
      let resultList = [];
      Object.keys(main).forEach((item) => {
        switch (query) {
          case main[item].chineseTrad:
          case main[item].chineseSimp:
          case main[item].pinyin:
          case flattenPinyin(main[item].pinyin)[0]:
          case main[item].english[0]:
          case main[item].english[1]:
          case main[item].english[2]:
            resultList = resultList.concat(item);
            break;
          default:
            break;
        }
      });
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
