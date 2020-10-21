import React, { useContext, useState, useEffect } from 'react';
import { instance as axios, getMainDataCharacters } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import Addition from '../components/Addition';
import Strip from '../components/Strip';

const AdditionCont = () => {
  // setting up user status
  const currentUser = useContext(UserContext);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
  }, [currentUser]);
  // setting up data
  const [mainData, setMainData] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token) {
      getMainDataCharacters(source, token, setMainData);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [token]);
  // function for data upload when next character is added to DB
  const uploadNewCharacter = (character, object) => {
    axios.put(`/main-data/characters/${character}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: Upload complete'); })
      .catch((error) => console.error(`Error adding new entry: ${error}`));
  };

  let content;

  if (mainData) {
    content = <Addition mainData={mainData} uploadNewCharacter={uploadNewCharacter} />;
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
