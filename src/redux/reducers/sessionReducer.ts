import {
  SESSION_START, ANSWER_CORRECT, ANSWER_INCORRECT, LOAD_USER_DATA, SessionActionTypes,
} from '../actions/types';

interface AuthState {
  sessionStart: number | null,
  remainingList: string[],
  correctList: string[],
  incorrectList: string[],
}

const INITIAL_STATE: AuthState = {
  sessionStart: null,
  remainingList: [],
  correctList: [],
  incorrectList: [],
};

export default (state = INITIAL_STATE, action: SessionActionTypes): AuthState => {
  switch (action.type) {
    case LOAD_USER_DATA:
      return {
        ...state,
        sessionStart: action.payload.sessionData.sessionStart,
        remainingList: action.payload.sessionData.remainingList,
        correctList: action.payload.sessionData.correctList,
        incorrectList: action.payload.sessionData.incorrectList,
      };
    case SESSION_START:
      return {
        ...state,
        sessionStart: action.payload.sessionStart,
        remainingList: action.payload.remainingList,
        correctList: [],
        incorrectList: [],
      };
    case ANSWER_CORRECT:
      return {
        ...state,
        remainingList: action.payload.remainingList,
        correctList: action.payload.correctList,
      };
    case ANSWER_INCORRECT:
      return {
        ...state,
        remainingList: action.payload.remainingList,
        incorrectList: action.payload.incorrectList,
      };
    default:
      return state;
  }
};
