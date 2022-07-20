import { User } from 'firebase/auth';

import {
  SIGN_IN, SIGN_OUT, GET_TOKEN, AuthActionTypes,
} from '../actions/types';

interface AuthState {
  isSignedIn: boolean | null,
  user: User | null,
  token: string | null,
}

const INITIAL_STATE: AuthState = {
  isSignedIn: null,
  user: null,
  token: null,
};

export default (state = INITIAL_STATE, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case SIGN_IN:
      return {
        ...state,
        isSignedIn: true,
        user: action.payload,
      };
    case SIGN_OUT:
      return {
        ...state, ...INITIAL_STATE, isSignedIn: false,
      };
    case GET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};
