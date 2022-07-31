import React, {
  useState, useEffect, MouseEvent, FormEvent, ReactElement,
} from 'react';
import { connect } from 'react-redux';

import { MainInt, ReactFullState } from '../interfaces';
import Strip from '../components/Strip';
import Search from '../components/info/Search';
import { toneChecker } from '../assets/tones';

interface ReactProps {
  token: string,
  mainData: MainInt,
}

const SearchCont: React.FC<ReactProps> = (props): ReactElement => {
  // setting up user status
  const [mainData, setMainData] = useState<MainInt|null>(props.mainData);

  useEffect(() => {
    setMainData(props.mainData);
  }, [props.mainData]);

  const [searchResults, setSearchResults] = useState<string[]>([]);

  // handles search by input and refreshes search results
  const handleSearch = (
    event: MouseEvent<HTMLButtonElement> | FormEvent<HTMLFormElement>,
    query: string,
  ) => {
    event.preventDefault();

    if (query === '' || !mainData) {
      setSearchResults([]);
    } else {
      let resultList: string[] = [];

      Object.keys(mainData.characters).forEach((item) => {
        switch (query) {
          case mainData.characters[item].chineseTrad:
          case mainData.characters[item].chineseSimp:
          case mainData.characters[item].pinyin:
          case toneChecker(mainData.characters[item].pinyin)[0]:
          case mainData.characters[item].english[0]:
          case mainData.characters[item].english[1]:
          case mainData.characters[item].english[2]:
            resultList = resultList.concat(item);
            break;
          default:
            break;
        }
      });
      Object.keys(mainData.words).forEach((item) => {
        switch (query) {
          case mainData.words[item].chineseTrad.join(''):
          case mainData.words[item].chineseSimp.join(''):
          case mainData.words[item].pinyin.join(''):
          case mainData.words[item].english[0]:
          case mainData.words[item].english[1]:
          case mainData.words[item].english[2]:
            resultList = resultList.concat(item);
            break;
          default:
            break;
        }
        if (mainData.words[item].chineseTrad.includes(query)
        || mainData.words[item].chineseSimp.includes(query)
        || mainData.words[item].pinyin.includes(query)
        || toneChecker(mainData.words[item].pinyin)[0] === query) {
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
  } else if (!props.token) {
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

const mapStateToProps = (state: ReactFullState) => ({
  token: state.auth.token,
  mainData: state.data.mainData,
});

export default connect(
  mapStateToProps,
)(SearchCont);
