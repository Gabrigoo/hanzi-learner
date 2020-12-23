import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

import { RootState } from '../reducers';
import {
  MainInt, UserInt, MainCharacterInt,
  MainWordInt, UserCharacterInt,
} from '../../interfaces';

export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const GET_TOKEN = 'GET_TOKEN';

export const LOAD_MAIN_DATA = 'LOAD_MAIN_DATA';
export const LOAD_USER_DATA = 'LOAD_USER_DATA';
export const ADD_MAIN_DATA = 'ADD_MAIN_DATA';
export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const UPDATE_USER_LEVEL = 'UPDATE_USER_LEVEL';

interface SignInAction {
    type: typeof SIGN_IN
    payload: string
}

interface SignOutAction {
    type: typeof SIGN_OUT
}

interface getToken {
    type: typeof GET_TOKEN
    payload: string
}

export type AuthActionTypes = SignInAction | SignOutAction | getToken;

interface loadMainData {
    type: typeof LOAD_MAIN_DATA
    payload: MainInt
}

interface loadUserData {
    type: typeof LOAD_USER_DATA
    payload: UserInt
}

interface AddMainDataAction {
    type: typeof ADD_MAIN_DATA
    payload: [string, MainCharacterInt | MainWordInt, string]
}

interface UpdateUserDataAction {
    type: typeof UPDATE_USER_DATA
    payload: [string, UserCharacterInt, string]
}

interface UpdateUserLevelAction {
    type: typeof UPDATE_USER_LEVEL
    payload: number
}

export type DataActionTypes = AddMainDataAction | UpdateUserDataAction | UpdateUserLevelAction
| loadMainData | loadUserData;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
