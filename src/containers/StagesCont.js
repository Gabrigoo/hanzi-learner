import React, { useState, useContext, useEffect } from 'react';
import { instance as axios, getMainDataCharacters } from '../axios-instance';
import Strip from '../components/Strip';
import Stage from '../components/Stage';
import { UserContext } from '../components/providers/UserProvider'; 

const StagesCont = () => {
    
    const currentUser = useContext(UserContext);

    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect( () => {
        setToken(localStorage.getItem('token'));
    }, [currentUser]);

    const [data, setData] = useState(null);

    useEffect( () => {
        const source = axios.CancelToken.source();
        if (token) {
            getMainDataCharacters(source, token, setData);
        }
        return () => {
            source.cancel('GET request cancelled');
        }
    }, [token])

    const findHighestStage = (data) => {
        let highest = 0;
        for (let character in data) {
            if (data[character].stage > highest) {
                highest = data[character].stage;
            }
        }
        return highest;
    }

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
            {loopThrough(findHighestStage(data), data)}
        </div>
    } else if (!token) {
        content = <Strip message = "No user is signed in" backTrack={'/main'} timeout = {4000} />
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