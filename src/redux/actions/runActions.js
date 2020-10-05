import * as actionTypes from './actionTypes';
import axios from '../../axios-instance';

export const startLesson = () => {
    return {
        type: actionTypes.START_LESSON,
    };
};

export const addChar = () => {
    return {
        type: actionTypes.ADD_CHAR,
    };
};

export const advancePhase = (payload) => {
    return {
        type: actionTypes.ADVANCE_PHASE,
        payload
    };
};

export const fetchHanlistStart = () => {
    return {
        type: actionTypes.FETCH_HANLIST_START,
    };
};

export const fetchHanlistSuccess = (data) => {
    return {
        type: actionTypes.FETCH_HANLIST_SUCCESS,
        data
    };
};

export const fetchHanlistFailed = (error) => {
    return {
        type: actionTypes.FETCH_HANLIST_FAILED,
        error
    };
};

export const fetchHanlist = () => {
    return dispatch => {
        dispatch(fetchHanlistStart())
        axios.get("/characters.json").then((res) => dispatch(fetchHanlistSuccess(res.data))).catch((error) => dispatch(fetchHanlistFailed(error)))
    };
};