import {
  SIGN_IN, SIGN_OUT, GET_TOKEN, AuthActionTypes,
} from '../actions/types';

interface AuthState {
  isSignedIn: boolean,
  userId: string | null,
  token: string | null,
}

const INITIAL_STATE: AuthState = {
  isSignedIn: false,
  userId: null,
  token: null,
};

export default (state = INITIAL_STATE, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case SIGN_IN:
      return { ...state, isSignedIn: true, userId: action.payload };
    case SIGN_OUT:
      return {
        ...state, isSignedIn: false, userId: null, token: null,
      };
    case GET_TOKEN:
      return { ...state, token: action.payload };
    default:
      return state;
  }
};
