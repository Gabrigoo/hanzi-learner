import React from 'react';
import './App.css';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import MainMenu from './containers/MainMenu';
import ReviewCont from './containers/ReviewCont';
import AdditionCont from './containers/AdditionCont';
import SignIn from './components/Authentication/SignIn';
import SignUp from './components/Authentication/SignUp';
import ProfilePage from './components/Authentication/ProfilePage';
import PasswordReset from './components/Authentication/PasswordReset';
import Header from './components/Header';
import StagesCont from './containers/StagesCont';
import LearnCont from './containers/LearnCont';
import InfoPanel from './components/InfoPanel';


class App extends React.Component {

  render() {
    
    const routing = (
      <Switch>
          <Route path="/main" component={MainMenu} />
          <Route path="/review" component={ReviewCont} />
          <Route path="/add" component={AdditionCont} />
          <Route path="/learn" component={LearnCont} />
          <Route path="/signUp" component={SignUp}/>
          <Route path="/signIn" component={SignIn}/>
          <Route path="/passwordReset" component={PasswordReset} />
          <Route path="/user" component={ProfilePage}/>
          <Route path="/stages" component={StagesCont}/>
          <Route path="/info/:id" component={InfoPanel}/>
          <Redirect to="/main" />
      </Switch>
    )
    
    return (
      <div>
        <Header />
        {routing}
      </div>
    )
  }}
  
export default withRouter(App);
