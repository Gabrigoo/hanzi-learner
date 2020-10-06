import React, { useContext, useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import './InfoPanel.css';
import { UserContext } from '../components/providers/UserProvider';
import axios from '../axios-instance';
import history from '../history';
import Strip from '../components/Strip';
import levels from '../assets/levels';


const InfoPanel = () => {
    
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
        if (token) {
            axios.get("/" + userId + ".json?auth=" + token).then(res => {
                setUserData(res.data.characters);
                console.log("GET: user data loaded")
            }).catch(error => console.error("Error loading user data: " + error));

            axios.get("/main-data/characters.json?auth=" + token).then(res => {
                setData(res.data);
                console.log("GET: main data loaded")
            }).catch(error => console.log("Error loading main data: " + error));
        }
    }, [token, userId])

    let content;

    if (data && userData) {
        content = 
        <>
            <h1 id="chinese-trad-info">{id}</h1>
            <h2 id="chinese-simp-info">{data[id].chineseSimp}</h2>
            <div className="horiz-div">
                <p>Stage:</p>
                <p>{data[id].stage}</p>
            </div>
            <div className="horiz-div">
                {data[id].english.map((word, index) => <p className="mean-info" key={word+index}>{word}</p>)}
            </div>
            <p>Reading:</p>
            <div className="horiz-div">
                <p className="read-info">{data[id].pinyin}</p>
                <p>{data[id].tone}</p>
            </div>
            <p>Meaning memonic:</p>
            {userData[id].memoMean === "" ?
            "Currently no meaning memonic added" :
            userData[id].memoMean}
            <p>Reading memonic:</p>
            {userData[id].memoRead === "" ?
            "Currently no reading memonic added" :
            userData[id].memoRead}
            <p>Last practiced:</p>
            <p>{userData[id].lastPract}</p>
            <p>User level:</p>
            <div className="horiz-div">
                <p className="read-info">{userData[id].level}</p>
                <p>{levels[userData[id].level][1]}</p>
            </div>
        </>
    } else if (!token) {
        content = <Strip message = "No user is signed in"/>
        setTimeout(() => {history.push(`/main`)}, 3000)
    } else {
        content = <Strip message = "Loading..."/>
    }

    return (
        <div className="card" id="info-card">
            {content}
        </div>
    );
};

export default InfoPanel;