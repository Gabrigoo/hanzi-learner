import React, {
  useContext, useState, useEffect, ReactElement,
} from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { instance as axios, getMainData, getUserData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import { UserCharacterInt } from '../interfaces';
import InfoPanel from '../components/Info/InfoPanel';
import Strip from '../components/Strip';

const InfoCont = (): ReactElement => {
  // getting character the panel is supposed to display

  const { id }: { id: string } = useParams();
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
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const source = axios.CancelToken.source();
    if (token && userId) {
      getMainData(source, token, setMainData);
      getUserData(source, token, userId, setUserData);
    }
    return () => {
      source.cancel('GET request cancelled');
    };
  }, [token, userId]);
  // function for uploading memonic changes by the user
  const putUserNewMemonic = (character: string, object: UserCharacterInt) => {
    axios.put(`/${userId}/characters/${character}.json?auth=${token}`, object)
      .then(() => { console.log('PUT: new user data uploaded'); })
      .catch((error: AxiosError) => console.error(`Error uploading new data: ${error}`));
  };

  let content;

  if (mainData && userData) {
    content = (
      <InfoPanel
        id={id}
        mainData={mainData}
        userData={userData}
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
