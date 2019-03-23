import {
  SET_THEME,
  SET_IS_FETCHING_DATA,
  SET_LOGGEDIN,
  SET_TIMER_ID,
  SET_TIMER_INTERVAL,
} from '../actions/appStatus';
import { THEME } from '../constants';

const appStatus = (state = [], action) => {
  switch (action.type) {
    case SET_THEME: {
      localStorage.setItem(THEME, action.theme);
      return {
        ...state,
        theme: action.theme,
      };
    }
    case SET_IS_FETCHING_DATA: {
      return {
        ...state,
        isFetchingData: action.isFetchingData,
      };
    }
    case SET_LOGGEDIN: {
      return {
        ...state,
        loggedin: action.loggedin,
      };
    }
    case SET_TIMER_ID: {
      return {
        ...state,
        timerId: action.timerId,
      };
    }
    case SET_TIMER_INTERVAL: {
      return {
        ...state,
        timerInterval: action.timerInterval,
      };
    }

    default:
      return state;
  }
};

export default appStatus;
