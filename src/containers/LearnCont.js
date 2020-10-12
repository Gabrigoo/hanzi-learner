import React, { useContext, useState, useEffect } from 'react';
import { instance as axios, getMainDataCharacters, getUserData } from '../axios-instance';
import { UserContext } from '../components/providers/UserProvider';
import Learn from '../components/Learn';
import Strip from '../components/Strip';

const LearnCont = () => {
    //setting up user status
    const currentUser = useContext(UserContext);

    const [userId, setUserID] = useState(localStorage.getItem('userId'));
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect( () => {
        setToken(localStorage.getItem('token'));
        setUserID(localStorage.getItem('userId'));
    }, [currentUser]);
    //setting up data
    const [mainData, setMainData] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect( () => {
        const source = axios.CancelToken.source();
        if (token) {
            getMainDataCharacters(source, token, setMainData);
            getUserData(source, token, userId, setUserData);
        }
        return () => {
            source.cancel('GET request cancelled');
        }
    }, [token, userId])

    // determines which items are to be learned by user level
    const getNewItems = (mainData, userData) => {

        let userStage = userData.userData.currentStage;
        let dataKeys = Object.keys(mainData).filter(char => mainData[char].stage <= userStage);
        let userKeys = Object.keys(userData.characters);

        return dataKeys.filter(char => !userKeys.includes(char));
    }
    // adds learned character from main DB to user DB
    const putUserNewCharacter = (character, object) => {
        axios.put("/" + userId + "/characters/" + character + ".json?auth=" + token, object)
        .then(() => {console.log("PUT: new user data uploaded")})
        .catch((error) => console.error("Error uploading new data: " + error));
    }

    let content;
    
    if (mainData && userData) {
        if (Object.keys(getNewItems(mainData, userData)).length === 0) {
            content = <Strip message = "No new characters to learn right now" backTrack={'/main'} timeout = {4000}/>
        } else {
            content = <Learn 
                mainData = {mainData}
                putUserNewCharacter={putUserNewCharacter} 
                newKeys= {getNewItems(mainData, userData)} 
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