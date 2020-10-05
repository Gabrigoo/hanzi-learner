import React, { useContext, useState, useEffect } from 'react';
import Learn from '../components/Learn';
import axios from '../axios-instance';
import Strip from '../components/Strip';
import history from '../history';
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
        if (token) {
            axios.get("/" + userId + ".json?auth=" + token).then(res => {
                setUserData(res.data);
                console.log("GET: user data loaded")
            }).catch(error => console.error("Error loading user data: " + error));

            axios.get("/main-data/characters.json?auth=" + token).then(res => {
                setData(res.data);
                console.log("GET: main data loaded")
            }).catch(error => console.log("Error loading main data: " + error));
        }
    }, [token, userId])

    const mainMenu = () => {
        history.push(`/main`);
    }

    const getNewItems = (data, userData) => {

        let userStage = userData.userData.currentStage;
        let dataKeys = Object.keys(data).filter(char => data[char].stage <= userStage);
        let userKeys = Object.keys(userData.characters);

        return dataKeys.filter(char => !userKeys.includes(char));
    }

    let content;
    
    if (data && userData) {
        if (Object.keys(getNewItems(data,userData)).length === 0) {
            content = <Strip message = "No new characters to learn right now" clickFunc={mainMenu}/>
        } else {
            content = <Learn data = {data} userId= {userId} token = {token} newKeys= {getNewItems(data, userData)} />
        }
    } else if (!token) {
        content = <Strip message = "No user is signed in"/>
        setTimeout(() => {history.push(`/main`)}, 3000)
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