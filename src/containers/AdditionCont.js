import React, { useContext, useState, useEffect } from 'react';
import Addition from '../components/Addition';
import axios from '../axios-instance';
import Strip from '../components/Strip';
import history from '../history';
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

    let content;
    
    if (data) {
        content = <Addition data = {data} token = {token} />
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
  
export default AdditionCont;;