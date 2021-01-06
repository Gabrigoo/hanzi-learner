import {
  LOAD_MAIN_DATA, LOAD_USER_DATA, UPDATE_USER_DATA, ADD_MAIN_DATA, UPDATE_USER_LEVEL,
  DataActionTypes,
} from '../actions/types';
// Have to ask someone smarter than me about this one
interface DataState {
  mainData: any,
  userData: any,
}

const INITIAL_STATE: DataState = {
  mainData: null,
  userData: null,
};

// Have to ask someone smarter than me about this one 2
export default (state = INITIAL_STATE, action: DataActionTypes): any => {
  switch (action.type) {
    case LOAD_MAIN_DATA:
      return { ...state, mainData: action.payload };
    case LOAD_USER_DATA:
      return { ...state, userData: action.payload };
    case ADD_MAIN_DATA:
      return {
        ...state,
        mainData: {
          ...state.mainData,
          [action.payload[2]]: {
            ...state.mainData[action.payload[2]],
            // 0 is the id, 1 is the actual data
            [action.payload[0]]: action.payload[1],
          },
        },
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        userData: {
          ...state.userData,
          [action.payload[2]]: {
            ...state.userData[action.payload[2]],
            // 0 is the id, 1 is the actual data, 2 is type
            [action.payload[0]]: action.payload[1],
          },
        },
      };
    case UPDATE_USER_LEVEL:
      return {
        ...state,
        userData: {
          ...state.userData,
          profileData: {
            ...state.userData.profileData,
            currentStage: action.payload,
          },
        },
      };
    default:
      return state;
  }
};
