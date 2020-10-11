import React, { useContext, useState, useEffect } from 'react';
import Addition from '../components/Addition';
import { instance as axios } from '../axios-instance';
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
        const source = axios.CancelToken.source();
        if (token) {
            axios.get("/main-data/characters.json?auth=" + token, {
                cancelToken: source.token
              }).then((res) => {
                setData(Object.keys(res.data));
                console.log('GET: main data loaded')
            }).catch(error => {
                if (axios.isCancel(error)) {
                    console.log(error)
                } else {
                    console.error("Error loading main data: " + error)
                }
            });
        }
        return () => {
            source.cancel('GET request cancelled');
        }
    }, [token]);

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