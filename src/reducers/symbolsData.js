import {
  SET_SYMBOLS_DATA,
  SET_QUERY_RESULT,
  FIRE_TIMER,
} from '../actions/symbolsData';

const symbolsData = (state = [], action) => {
  switch (action.type) {
    case SET_SYMBOLS_DATA: {
      return {
        ...state,
        data: action.data,
      };
    }
    case SET_QUERY_RESULT: {
      return {
        ...state,
        queryResult: action.queryResult,
      };
    }
    case FIRE_TIMER: {
      const fireTimer = !state.fireTimer;
      return {
        ...state,
        fireTimer,
      };
    }
    default:
      return state;
  }
};

export default symbolsData;
