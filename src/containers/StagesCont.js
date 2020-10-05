import React, { useState, useContext, useEffect } from 'react';
import axios from '../axios-instance';
import Strip from '../components/Strip';
import Stage from '../components/Stage';
import history from '../history';
import { UserContext } from '../components/providers/UserProvider'; 

const StagesCont = () => {
    
    const currentUser = useContext(UserContext);

    const highestStage = 4;

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect( () => {
        setToken(localStorage.getItem('token'));
    }, [currentUser]);

    const [data, setData] = useState(null);

    useEffect( () => {
        if (token) {
            axios.get("/main-data/characters.json?auth=" + token).then((res) => {
                setData(res.data);
                console.log("GET: main data downloaded");
            }).catch((error) => console.error("Error downloading main data: " + error));
        }
    }, [token])


    const sortDataToLevel = (data, level) => {
        let levelObject = {};

        for (let character in data) {
            if (data[character].stage === level) {
                levelObject[character] = data[character]
            }
        }
        return levelObject;
    }

    const loopThrough = (highestStage, data) => {
        let items = [];
        for (let i = 1; i <= highestStage; i++) {
            items.push(<Stage level= {i.toString()} stageData= {sortDataToLevel(data, i)} key={'stage' + i}/>)
        }
        return items;
    }

    let content;
    
    if (data) {
        content = 
        <div className="card" id="stage-flex-card">
            {loopThrough(highestStage, data)}
        </div>
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

  export default StagesCont;