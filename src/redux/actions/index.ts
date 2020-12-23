import { CancelTokenSource } from 'axios';
import firebase from 'firebase/app';

import {
  SIGN_IN, SIGN_OUT, LOAD_MAIN_DATA, LOAD_USER_DATA, GET_TOKEN,
  ADD_MAIN_DATA, UPDATE_USER_DATA, UPDATE_USER_LEVEL, AuthActionTypes, DataActionTypes,
  AppThunk,
} from './types';
import {
  getMainData, getUserData, addNewWord, addUserData, setUserLevel,
} from '../../axios-instance';
import { MainCharacterInt, MainWordInt, UserCharacterInt } from '../../interfaces';

export const signIn = (userId: string): AuthActionTypes => ({
  type: SIGN_IN,
  payload: userId,
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
): AppThunk => async (dispatch) => {
  const response = await getMainData(source, token);

  dispatch({ type: LOAD_MAIN_DATA, payload: response });
};

export const loadUserData = (
  source: CancelTokenSource,
  token: string,
  userId: string,
): AppThunk => async (dispatch) => {
  const response = await getUserData(source, token, userId);

  dispatch({ type: LOAD_USER_DATA, payload: response });
};

export const addMainData = (
  word: string,
  object: MainCharacterInt | MainWordInt,
  token: string,
): DataActionTypes => {
  addNewWord(word, object, token);

  const type = word.length > 1 ? 'words' : 'characters';
  return { type: ADD_MAIN_DATA, payload: [word, object, type] };
};

export const updateUserData = (
  word: string,
  object: UserCharacterInt,
  token: string, userId: string,
): DataActionTypes => {
  addUserData(word, object, token, userId);

  const type = word.length > 1 ? 'words' : 'characters';
  return { type: UPDATE_USER_DATA, payload: [word, object, type] };
};

export const updateUserLevel = (
  newLevel: number,
  token: string,
  userId: string,
): DataActionTypes => {
  setUserLevel(newLevel, token, userId);

  return { type: UPDATE_USER_LEVEL, payload: newLevel };
};
