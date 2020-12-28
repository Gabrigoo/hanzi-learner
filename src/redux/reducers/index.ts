import { combineReducers } from 'redux';
import authReducer from './authReducer';
import dataReducer from './dataReducer';

export const rootReducer = combineReducers({
  auth: authReducer,
  data: dataReducer,
});

export type RootState = ReturnType<typeof rootReducer>
