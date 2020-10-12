import React, { useContext, useState, useEffect } from 'react';
import './Header.css';
import unknownUser from '../../src/assets/unknown-user.png';
import mainMenu from '../../src/assets/main-menu.png';
import { UserContext } from './providers/UserProvider';
import history from '../history';


const Header = () => {
    //setting up user status
    const currentUser = useContext(UserContext);

    const [user, setUser] = useState(localStorage.getItem('user'));
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [photo, setPhoto] = useState(localStorage.getItem('photo'));

    useEffect( () => {
        setUser(localStorage.getItem('user'));
        setEmail(localStorage.getItem('email'));
        setPhoto(localStorage.getItem('photo'));
        console.log('header reloads');
    }, [currentUser])

    const switchScreen = (event) => {
        let path = ``;
        switch (event.target.name) {
            case "main-menu":
                path = `/main`;
                break;
            case "start-lesson":
                path = `/lesson`;
                break;
            case "start-add":
                path = `/add`;
                break;
            case "sign-in":
                path = `/signIn`;
                break;
            case "sign-up":
                path = `/signUp`;
                break;
            case "profile":
                path = `/user`;
                break;
            case "password-reset":
                path = `/passwordReset`;
                break;
            default:
                break;
        }
        history.push(path);
    }

    let content = null;

    if (currentUser) {

        let photoURL = null;

        if (photo === "null") {
            photoURL = unknownUser;
        } else {
            photoURL = photo;
        }

        content =
        <header id="header">
            <img name="profile" id="profile-img" src={photoURL} alt="profile" onClick={switchScreen}/>
            {user !== "null" ? <p>{user}</p> : ""}
            {email !== "null" ? <p>{email}</p> : ""}
            <img name="main-menu" id="main-menu-icon" src={mainMenu} alt="mainmenu" onClick={switchScreen}/>
        </header>

    } else {
        content =
        <header id="header">
            <img name="profile" id="profile-img" src={unknownUser} alt="profile"/>
            <button type="button" name="sign-in" id="sing-in-button" onClick={switchScreen}>Sign in</button>
            <button type="button" name="sign-up" id="sing-up-button" onClick={switchScreen}>Sign up</button>
            <img name="main-menu" id="main-menu-icon" src={mainMenu} alt="mainmenu" onClick={switchScreen}/>
        </header>
    }

    return (
        <div>
            {content}
        </div>
        
    );
};
  
export default Header;