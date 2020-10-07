import React, {useEffect, useState, useContext } from 'react';
import axios from '../axios-instance';
import Review from '../components/Review';
import Strip from '../components/Strip';
import levels from '../assets/levels';
import history from '../history';
import { UserContext } from '../components/providers/UserProvider';

const ReviewCont = () => {
    
    const currentUser = useContext(UserContext);

    const [userId, setUserID] = useState(localStorage.getItem('userId'));
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect( () => {
        setToken(localStorage.getItem('token'));
        setUserID(localStorage.getItem('userId'));
    }, [currentUser]);

    const [data, setData] = useState(null);
    const [reviewData, setReviewData] = useState(null);
    const [userLevel, setUserLevel] = useState(null);

    useEffect( () => {
            if (token) {
                axios.get("/main-data/characters.json?auth=" + token).then((res) => {
                    setData(res.data);
                    console.log("GET: main data loaded");
                }).catch(error => console.error("Error loading main data: " + error));

                axios.get("/" + userId + ".json?auth=" + token).then((res) => {
                    setReviewData(dataToReview(res.data.characters));
                    setUserLevel(res.data.userData.currentStage);
                    console.log("GET: user data loaded");
                }).catch(error => console.error("Error loading user data: " + error));
            }
    }, [token, userId]);

    useEffect(() => {
        return () => {
            // Anything in here is fired on component unmount.
            if (userLevel && data) {
                axios.get("/" + userId + "/characters.json?auth=" + token).then((res) => {
                    console.log("GET user data loaded");
                    // possible characters from main DB for users current level
                    let currentLevelKeys = Object.keys(data).filter(char => data[char].stage === userLevel);
                    // character that are known by the user at least at Guru level
                    let learnedKeys = Object.keys(res.data).filter(char => res.data[char].level > 4);
                    let fullLength = currentLevelKeys.length;
                    let knownLength = currentLevelKeys.filter(char => learnedKeys.includes(char)).length;
                    console.log("Full: " + fullLength);
                    console.log("Known: " + knownLength);
                    let ratio = knownLength/fullLength * 100;
                    console.log("asessing user data... level completion: " + ratio);
                    if (ratio > 90) {
                        console.log("User level increased to: " + (userLevel + 1))
                        axios.put("/" + userId + "/userData/currentStage.json?auth=" + token, userLevel + 1)
                        .then(() => {
                            console.log("PUT database overwritten");
                        }).catch((error) => console.error("Error updating database: " + error));
                    }
                }).catch(error => console.error("Error loading user data: " + error));
            }
        }
    })

    const mainMenu = () => {
        history.push(`/main`);
    }

    const dataToReview = (data) => {
        let review = {};
        let currentDate = new Date();

        for (let character in data) {
            let storedDate = new Date(data[character].lastPract);

            if (data[character].level === 9) {
                //Good job! No need to review this anymore
            } else if (Math.round((currentDate - storedDate) / (1000 * 60 * 60)) >= levels[data[character].level][0]) {
                review[character] = data[character]
            }
        }
        return review;
    }

    const uploadReviewResults = (character, object) => {
        axios.put("/" + userId + "/characters/" + character + ".json?auth=" + token, object)
            .then(() => console.log("PUT: upload to database"))
            .catch((error) => console.error("Error refreshing database: " + error));
    }

    let content;
    
    if (data && reviewData) {
        if (Object.keys(reviewData).length === 0) {
            content = <Strip message = "No characters to review right now" backTrack={'/main'} timeout = {4000}/>
        } else {
            content = <Review data = {data} reviewData = {reviewData} uploadReviewResults={uploadReviewResults} mainMenu={mainMenu} />
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

  export default ReviewCont;