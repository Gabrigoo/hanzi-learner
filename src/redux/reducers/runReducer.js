import * as actionTypes from '../actions/actionTypes.js';

const defaultState = {
    phase: 0,
    hanlist: null,
    loading: false,
    error: null
}

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.ADVANCE_PHASE:
            return {
                ...state,
                phase: action.payload
            }
        case actionTypes.START_LESSON:
            return {
                ...state,
                phase: 1,
                }
        case actionTypes.ADD_CHAR:
            return {
                ...state,
                phase: 2,
                }
        case actionTypes.FETCH_HANLIST_START:
            return {
                ...state,
                hanlist: null,
                loading: true,
                error: null,
                }
        case actionTypes.FETCH_HANLIST_SUCCESS:
            return {
                ...state,
                loading: false,
                hanlist: action.data,
                }
        case actionTypes.FETCH_HANLIST_FAILED:
            return {
                ...state,
                loading: false,
                error: action.error,
                }
        default:
            return state;
    }
}



/*  phase 0: main menu
    phase 1: ship placement (first user then AI)
    phase 2: combat
*/
