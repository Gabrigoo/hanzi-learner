import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';
import { User } from 'firebase/auth';

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

export const SESSION_START = 'SESSION_START';
export const ANSWER_CORRECT = 'ANSWER_CORRECT';
export const ANSWER_INCORRECT = 'ANSWER_INCORRECT';

interface SignInAction {
    type: typeof SIGN_IN
    payload: User
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

interface SessionStartAction {
    type: typeof SESSION_START
    payload: any
}

interface AnswerCorrectAction {
    type: typeof ANSWER_CORRECT
    payload: any
}

interface AnswerIncorrectAction {
    type: typeof ANSWER_INCORRECT
    payload: any
}

export type SessionActionTypes = SessionStartAction | AnswerCorrectAction | AnswerIncorrectAction
 | loadUserData

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
