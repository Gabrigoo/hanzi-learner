import React, { ReactElement } from 'react';
import {
  Route, Routes, BrowserRouter,
} from 'react-router-dom';
import ReviewCont from './containers/ReviewCont';
import AdditionCont from './containers/AdditionCont';
import SignIn from './components/authentication/SignIn';
import SignUp from './components/authentication/SignUp';
import Summary from './components/learning/Summary';
import ProfilePage from './components/authentication/ProfilePage';
import PasswordReset from './components/authentication/PasswordReset';
import StagesCont from './containers/StagesCont';
import LearnCont from './containers/LearnCont';
import InfoCont from './containers/InfoCont';
import SearchCont from './containers/SearchCont';
import Layout from './hoc/Layout/Layout';

function App(): ReactElement {
  const routing = (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/review" element={<ReviewCont />} />
          <Route path="/add" element={<AdditionCont />} />
          <Route path="/learn" element={<LearnCont />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/password-reset" element={<PasswordReset />} />
          <Route path="/user" element={<ProfilePage />} />
          <Route path="/search" element={<SearchCont />} />
          <Route path="/stages" element={<StagesCont />} />
          <Route path="/info/:id" element={<InfoCont />} />
          <Route path="*" element={<Summary />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );

  return routing;
}

export default App;
