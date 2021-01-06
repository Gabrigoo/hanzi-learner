import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dataReducer from './dataReducer';
import sessionReducer from './sessionReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
  session: sessionReducer,
});

export type RootState = ReturnType<typeof rootReducer>
