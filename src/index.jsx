import ReactDOM from 'react-dom/client';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { thunk } from 'redux-thunk';

import App from './App';
import * as serviceWorker from './serviceWorker';
import UserProvider from './components/authentication/provider/UserProvider';
import { rootReducer } from './redux/reducers';
import './index.css';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk)),
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <UserProvider>
      <App />
    </UserProvider>
  </Provider>,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
