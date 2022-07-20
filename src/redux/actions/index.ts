import { CancelTokenSource } from 'axios';
import AxiosErrorObj from 'axios-error';
import { User } from 'firebase/auth';

import {
  SIGN_IN, SIGN_OUT, LOAD_MAIN_DATA, LOAD_USER_DATA, GET_TOKEN,
  ADD_MAIN_DATA, UPDATE_USER_DATA, UPDATE_USER_LEVEL, SESSION_START,
  AuthActionTypes, ANSWER_CORRECT, ANSWER_INCORRECT, AppThunk,
} from './types';
import {
  getMainData, getUserData, addNewWord, addUserData, setUserLevel, addReviewData,
} from '../../axios-instance';
import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';

// Authentication actions:
export const signIn = (user: User): AuthActionTypes => ({
  type: SIGN_IN,
  payload: user,
});

export const signOut = (): AuthActionTypes => ({
  type: SIGN_OUT,
});

export const getToken = (userAuth: User): AppThunk => async (dispatch) => {
  const idToken: string = await userAuth.getIdToken();

  localStorage.setItem('token', idToken);

  dispatch({ type: GET_TOKEN, payload: idToken });
};

// Database actions:
export const loadMainData = (
  source: CancelTokenSource,
): AppThunk | void => async (dispatch, getState) => {
  const { token } = { ...getState().auth };
  if (token) {
    const response = await getMainData(source, token);
    if (response instanceof AxiosErrorObj === false) {
      dispatch({ type: LOAD_MAIN_DATA, payload: response });
    }
  }
};

export const loadUserData = (
  source: CancelTokenSource,
): AppThunk | void => async (dispatch, getState) => {
  const { token, user } = { ...getState().auth };
  if (token && user) {
    const response = await getUserData(source, token, user.uid);
    if (response instanceof AxiosErrorObj === false) {
      dispatch({ type: LOAD_USER_DATA, payload: response });
    }
  }
};

export const addMainData = (
  word: string,
  object: MainCharacterInt | MainWordInt,
): AppThunk | void => async (dispatch, getState) => {
  const { token } = { ...getState().auth };
  if (token) {
    const response = await addNewWord(word, object, token);

    if (response instanceof AxiosErrorObj === false) {
      const type = word.length > 1 ? 'words' : 'characters';
      dispatch({ type: ADD_MAIN_DATA, payload: [word, object, type] });
    }
  }
};

export const updateUserData = (
  word: string,
  object: UserCharacterInt,
): AppThunk | void => async (dispatch, getState) => {
  const { token, user } = { ...getState().auth };
  if (token && user) {
    const response = await addUserData(word, object, token, user.uid);

    if (response instanceof AxiosErrorObj) {
      return response;
    } else {
      const type = word.length > 1 ? 'words' : 'characters';
      dispatch({ type: UPDATE_USER_DATA, payload: [word, object, type] });
    }
  }
  return null;
};

export const updateUserLevel = (
  newLevel: number,
): AppThunk | void => async (dispatch, getState) => {
  const { token, user } = { ...getState().auth };
  console.log('updating user level');
  console.log(user);
  if (token && user) {
    const response = await setUserLevel(newLevel, token, user.uid);

    if (response instanceof AxiosErrorObj === false) {
      dispatch({ type: UPDATE_USER_LEVEL, payload: newLevel });
    }
  }
};

// Session actions:
export const startSession = (
  remainingList: string[],
): AppThunk | void => async (dispatch, getState) => {
  const { token, user } = { ...getState().auth };
  if (token && user) {
    const currentTime = new Date().getTime();
    const payload = {
      sessionStart: currentTime,
      remainingList,
      correctList: [],
      incorrectList: [],
    };

    const response = await addReviewData(payload, token, user.uid);

    if (response instanceof AxiosErrorObj === false) {
      dispatch({ type: SESSION_START, payload });
    }
  }
};

export const answerCorrect = (
  word: string,
): AppThunk | void => async (dispatch, getState) => {
  const payload = { ...getState().session };
  const { token, user } = { ...getState().auth };
  if (token && user) {
    payload.remainingList = payload.remainingList.filter((item) => item !== word);
    payload.correctList = payload.correctList.concat(word);

    const response = await addReviewData(payload, token, user.uid);

    if (response instanceof AxiosErrorObj === false) {
      dispatch({ type: ANSWER_CORRECT, payload });
    }
  }
};

export const answerIncorrect = (
  word: string,
): AppThunk | void => async (dispatch, getState) => {
  const payload = { ...getState().session };
  const { token, user } = { ...getState().auth };
  if (token && user) {
    payload.remainingList = payload.remainingList.filter((item) => item !== word);
    payload.incorrectList = payload.incorrectList.concat(word);

    const response = await addReviewData(payload, token, user.uid);

    if (response instanceof AxiosErrorObj === false) {
      dispatch({ type: ANSWER_INCORRECT, payload });
    }
  }
};
