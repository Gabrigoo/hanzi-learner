import React, { ReactElement } from 'react';
import './App.css';
import {
  Route, Router, Switch, Redirect,
} from 'react-router-dom';
import history from './history';
import MainCont from './containers/MainCont';
import ReviewCont from './containers/ReviewCont';
import AdditionCont from './containers/AdditionCont';
import SignIn from './components/Authentication/SignIn';
import SignUp from './components/Authentication/SignUp';
import ProfilePage from './components/Authentication/ProfilePage';
import PasswordReset from './components/Authentication/PasswordReset';
import StagesCont from './containers/StagesCont';
import LearnCont from './containers/LearnCont';
import InfoCont from './containers/InfoCont';
import SearchCont from './containers/SearchCont';
import Layout from './hoc/Layout/Layout';

const App = (): ReactElement => {
  const routing = (
    <Router history={history}>
      <Layout>
        <Switch>
          <Route path="/main" component={MainCont} />
          <Route path="/review" component={ReviewCont} />
          <Route path="/add" component={AdditionCont} />
          <Route path="/learn" component={LearnCont} />
          <Route path="/sign-up" component={SignUp} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/password-reset" component={PasswordReset} />
          <Route path="/user" component={ProfilePage} />
          <Route path="/search" component={SearchCont} />
          <Route path="/stages" component={StagesCont} />
          <Route path="/info/:id" component={InfoCont} />
          <Redirect to="/main" />
        </Switch>
      </Layout>
    </Router>
  );

  return routing;
};

export default App;
