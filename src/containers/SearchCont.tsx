import React, {
  useEffect, useState, useContext, MouseEvent, FormEvent, ReactElement,
} from 'react';
import { instance as axios, getMainData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import { MainInt } from '../interfaces';
import Strip from '../components/Strip';
import Search from '../components/Info/Search';
import { toneChecker } from '../assets/tones';

const SearchCont = (): ReactElement => {
  // setting up user status
  const currentUser = useContext(UserContext);

  const [userId, setUserID] = useState(localStorage.getItem('userId'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserID(localStorage.getItem('userId'));
  }, [currentUser]);
  // setting up data
  const [mainData, setMainData] = useState<any>(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token) {
      getMainData(source, token, setMainData);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [token, userId]);

  const [searchResults, setSearchResults] = useState<string[]>([]);
  // handles search by input and refreshes search results
  const handleSearch = (
    event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>,
    query: string,
    main: MainInt,
  ) => {
    event.preventDefault();

    if (query === '') {
      setSearchResults([]);
    } else {
      let resultList: string[] = [];

      Object.keys(main.characters).forEach((item) => {
        switch (query) {
          case main.characters[item].chineseTrad:
          case main.characters[item].chineseSimp:
          case main.characters[item].pinyin:
          case toneChecker(main.characters[item].pinyin)[0]:
          case main.characters[item].english[0]:
          case main.characters[item].english[1]:
          case main.characters[item].english[2]:
            resultList = resultList.concat(item);
            break;
          default:
            break;
        }
      });
      Object.keys(main.words).forEach((item) => {
        switch (query) {
          case main.words[item].chineseTrad.join(''):
          case main.words[item].chineseSimp.join(''):
          case main.words[item].pinyin.join(''):
          case main.words[item].english[0]:
          case main.words[item].english[1]:
          case main.words[item].english[2]:
            resultList = resultList.concat(item);
            break;
          default:
            break;
        }
        if (main.words[item].chineseTrad.includes(query)
        || main.words[item].chineseSimp.includes(query)
        || main.words[item].pinyin.includes(query)
        || toneChecker(main.words[item].pinyin)[0] === query) {
          resultList = resultList.concat(item);
        }
      });
      const uniqResultList = resultList.filter((item, pos) => resultList.indexOf(item) === pos);
      setSearchResults(uniqResultList);
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
