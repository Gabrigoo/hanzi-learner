import { CancelTokenSource } from 'axios';
import AxiosErrorObj from 'axios-error';
import firebase from 'firebase/app';

import {
  SIGN_IN, SIGN_OUT, LOAD_MAIN_DATA, LOAD_USER_DATA, GET_TOKEN,
  ADD_MAIN_DATA, UPDATE_USER_DATA, UPDATE_USER_LEVEL, AuthActionTypes,
  AppThunk,
} from './types';
import {
  getMainData, getUserData, addNewWord, addUserData, setUserLevel,
} from '../../axios-instance';
import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';

export const signIn = (user: firebase.User): AuthActionTypes => ({
  type: SIGN_IN,
  payload: user,
});

export const signOut = (): AuthActionTypes => ({
  type: SIGN_OUT,
});

export const getToken = (userAuth: firebase.User): AppThunk => async (dispatch) => {
  const idToken: string = await userAuth.getIdToken();

  localStorage.setItem('token', idToken);

  dispatch({ type: GET_TOKEN, payload: idToken });
};

export const loadMainData = (
  source: CancelTokenSource,
  token: string,
): AppThunk | void => async (dispatch) => {
  const response = await getMainData(source, token);
  if (response instanceof AxiosErrorObj === false) {
    dispatch({ type: LOAD_MAIN_DATA, payload: response });
  }
};

export const loadUserData = (
  source: CancelTokenSource,
  token: string,
  userId: string,
): AppThunk | void => async (dispatch) => {
  const response = await getUserData(source, token, userId);
  if (response instanceof AxiosErrorObj === false) {
    dispatch({ type: LOAD_USER_DATA, payload: response });
  }
};

export const addMainData = (
  word: string,
  object: MainCharacterInt | MainWordInt,
  token: string,
): AppThunk | void => async (dispatch) => {
  const response = await addNewWord(word, object, token);

  if (response instanceof AxiosErrorObj === false) {
    const type = word.length > 1 ? 'words' : 'characters';
    dispatch({ type: ADD_MAIN_DATA, payload: [word, object, type] });
  }
};

export const updateUserData = (
  word: string,
  object: UserCharacterInt,
  token: string, userId: string,
): AppThunk | void => async (dispatch) => {
  const response = await addUserData(word, object, token, userId);

  if (response instanceof AxiosErrorObj === false) {
    const type = word.length > 1 ? 'words' : 'characters';
    dispatch({ type: UPDATE_USER_DATA, payload: [word, object, type] });
  }
};

export const updateUserLevel = (
  newLevel: number,
  token: string,
  userId: string,
): AppThunk | void => async (dispatch) => {
  const response = await setUserLevel(newLevel, token, userId);

  if (response instanceof AxiosErrorObj === false) {
    dispatch({ type: UPDATE_USER_LEVEL, payload: newLevel });
  }
};
