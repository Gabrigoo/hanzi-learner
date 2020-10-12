import React, { useContext, useState, useEffect } from 'react';
import Learn from '../components/Learn';
import { instance as axios, getMainDataCharacters, getUserData } from '../axios-instance';
import Strip from '../components/Strip';
import { UserContext } from '../components/providers/UserProvider';

const LearnCont = () => {

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

    // determines which items are to be learned by user level
    const getNewItems = (data, userData) => {

        let userStage = userData.userData.currentStage;
        let dataKeys = Object.keys(data).filter(char => data[char].stage <= userStage);
        let userKeys = Object.keys(userData.characters);

        return dataKeys.filter(char => !userKeys.includes(char));
    }

    const putUserNewCharacter = (character, object) => {
        axios.put("/" + userId + "/characters/" + character + ".json?auth=" + token, object)
        .then(() => {console.log("PUT: new data uploaded")})
        .catch((error) => console.error("Error uploading new data: " + error));
    }

    let content;
    
    if (data && userData) {
        if (Object.keys(getNewItems(data, userData)).length === 0) {
            content = <Strip message = "No new characters to learn right now" backTrack={'/main'} timeout = {4000}/>
        } else {
            content = <Learn 
                data = {data}
                putUserNewCharacter={putUserNewCharacter} 
                newKeys= {getNewItems(data, userData)} 
            />
        }
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
  
export default LearnCont;;