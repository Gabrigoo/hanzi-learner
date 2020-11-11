import React, {
  useContext, useState, useEffect, ReactElement,
} from 'react';
import { AxiosError } from 'axios';
import { instance as axios, getMainData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import { MainCharacterInt, MainWordInt } from '../interfaces';
import Addition from '../components/Addition';
import Strip from '../components/Strip';

const AdditionCont = (): ReactElement => {
  // setting up user status
  const currentUser = useContext(UserContext);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
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
  }, [token]);
  // function for data upload when next character is added to DB
  const uploadNewCharacter = (character: string, object: MainCharacterInt) => {
    axios.put(`/main-data/characters/${character}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: Upload complete'); })
      .catch((error: AxiosError) => console.error(`Error adding new entry: ${error}`));
  };

  const uploadNewWord = (word: string, object: MainWordInt) => {
    axios.put(`/main-data/words/${word}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: Upload complete'); })
      .catch((error: AxiosError) => console.error(`Error adding new entry: ${error}`));
  };

  let content;

  if (mainData) {
    content = (
      <Addition
        mainData={mainData}
        uploadNewCharacter={uploadNewCharacter}
        uploadNewWord={uploadNewWord}
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

export default AdditionCont;
