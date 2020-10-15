import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { instance as axios, getMainDataCharacters, getUserData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import InfoPanel from '../components/InfoPanel';
import Strip from '../components/Strip';

const InfoCont = () => {
  // getting character the panel is supposed to display
  const { id } = useParams();
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
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token) {
      getMainDataCharacters(source, token, setMainData);
      getUserData(source, token, userId, setUserData);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [token, userId]);
  // function for uploading memonic changes by the user
  const putUserNewMemonic = (character, object) => {
    axios.put('/' + userId + '/characters/' + character + '.json?auth=' + token, object)
      .then(() => { console.log('PUT: new user data uploaded'); })
      .catch((error) => console.error('Error uploading new data: ' + error));
  };

  let content;

  if (mainData && userData) {
    content = (
      <InfoPanel
        id={id}
        mainData={mainData}
        userData={userData.characters}
        putUserNewMemonic={putUserNewMemonic}
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

export default InfoCont;
