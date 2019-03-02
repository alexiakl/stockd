import { SET_THEME, SET_IS_FETCHING_DATA } from '../actions/appStatus';
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
    default:
      return state;
  }
};

export default appStatus;
