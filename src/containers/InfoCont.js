import React, { useContext, useState, useEffect } from 'react';
import InfoPanel from '../components/InfoPanel';
import { useParams } from 'react-router-dom';
import { instance as axios, getMainDataCharacters, getUserData } from '../axios-instance';
import Strip from '../components/Strip';
import { UserContext } from '../components/providers/UserProvider';

const InfoCont = () => {

    const { id } = useParams();

    const currentUser = useContext(UserContext);

    const [userId, setUserID] = useState(localStorage.getItem('userId'));
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect( () => {
        setToken(localStorage.getItem('token'));
        setUserID(localStorage.getItem('userId'));
    }, [currentUser]);

    const [data, setData] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect( () => {
        const source = axios.CancelToken.source();
        if (token) {
            getMainDataCharacters(source, token, setData);
            getUserData(source, token, userId, setUserData);
        }
        return () => {
            source.cancel('GET request cancelled');
        }
    }, [token, userId])

    const putUserNewMemonic = (character, object) => {
        axios.put("/" + userId + "/characters/" + character + ".json?auth=" + token, object)
        .then(() => {console.log("PUT: new user data uploaded")})
        .catch((error) => console.error("Error uploading new data: " + error));
    }

    let content;

    if (data && userData) {
        content = <InfoPanel id={id} data={data} characters={userData.characters} putUserNewMemonic={putUserNewMemonic}/>
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
  
export default InfoCont;;