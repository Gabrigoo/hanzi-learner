import React, {
  useContext, useState, ReactElement,
} from 'react';
import { useParams } from 'react-router-dom';
import { AxiosError } from 'axios';
import { instance as axios } from '../axios-instance';
import GetData from '../customhooks/GetData';
import { UserContext } from '../components/providers/UserProvider';
import { MainInt, UserInt, UserCharacterInt } from '../interfaces';
import InfoPanel from '../components/Info/InfoPanel';
import Strip from '../components/Strip';

const InfoCont = (): ReactElement => {
  // getting character the panel is supposed to display

  const { id }: { id: string } = useParams();
  // setting up user status
  const currentUser = useContext(UserContext);

  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [token, setToken] = useState(localStorage.getItem('token'));

  const [mainData, setMainData] = useState<MainInt|null>(null);
  const [userData, setUserData] = useState<UserInt|null>(null);

  GetData(currentUser, token, userId, setToken, setUserId, setMainData, setUserData);

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
