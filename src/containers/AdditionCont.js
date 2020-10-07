import React, { useContext, useState, useEffect } from 'react';
import Addition from '../components/Addition';
import axios from '../axios-instance';
import Strip from '../components/Strip';
import { UserContext } from '../components/providers/UserProvider';

const AdditionCont = () => {

    const currentUser = useContext(UserContext);

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect( () => {
        setToken(localStorage.getItem('token'));
    }, [currentUser]);

    const [data, setData] = useState(null);
    
    useEffect( () => {

        if (token) {
            axios.get("/main-data/characters.json?auth=" + token).then((res) => {
                setData(Object.keys(res.data));
                console.log('GET: main data loaded')
            }).catch((error) => console.error("Error loading main data: " + error));
        }
    }, [token])

    const uploadNewCharacter = (character, object) => {
        axios.put("/main-data/characters/" + character + ".json?auth=" + token, object)
        .then(() => {console.log('PUT: Upload complete')})
        .catch((error) => console.error("Error adding new entry: " + error))
    }

    let content;
    
    if (data) {
        content = <Addition data = {data} uploadNewCharacter={uploadNewCharacter} />
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
  
export default AdditionCont;;